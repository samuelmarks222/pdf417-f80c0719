import { authenticatedUser, jsonResponse, preflight, recordPaymentEvent, serviceClient, updatePaymentStatus } from "../_shared/http.ts";
import { getSasapayToken, sasapayRequest } from "../_shared/payments.ts";

function sameAmount(actual: unknown, expected: number) {
  const parsed = Number(actual);
  return Number.isFinite(parsed) && Math.abs(parsed - expected) < 0.005;
}

Deno.serve(async (request: Request) => {
  const options = preflight(request);
  if (options) return options;
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const user = await authenticatedUser(request);
  if (!user) return jsonResponse({ error: "Authentication required." }, 401);
  const client = serviceClient();
  const { data: profile } = await client
    .from("credit_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) return jsonResponse({ error: "Administrator access required." }, 403);

  let body: { paymentId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }
  if (!body.paymentId) return jsonResponse({ error: "Payment ID is required." }, 400);

  const { data: payment, error } = await client
    .from("credit_payments")
    .select("id,provider,provider_reference,amount_usd,amount_due,currency,status")
    .eq("id", body.paymentId)
    .maybeSingle();
  if (error || !payment) return jsonResponse({ error: "Payment was not found." }, 404);
  if (payment.status === "successful") return jsonResponse({ status: "successful", credited: false });

  try {
    let response: Record<string, unknown>;
    if (payment.provider === "sasapay") {
      const token = await getSasapayToken();
      const statusPath = Deno.env.get("SASAPAY_STATUS_PATH") ?? "payments/transaction-status/";
      response = await sasapayRequest(statusPath, token, {
        MerchantCode: Deno.env.get("SASAPAY_MERCHANT_CODE"),
        CheckoutRequestID: payment.provider_reference,
      });
      if (String(response.ResultCode ?? "") === "0") {
        if (!sameAmount(response.Amount ?? response.amount, Number(payment.amount_due))
          || String(response.Currency ?? response.currency ?? "").toUpperCase() !== payment.currency) {
          await updatePaymentStatus(client, payment.id, "underpaid", "Provider status amount or currency did not match.", response);
          await recordPaymentEvent(client, payment.id, "sasapay", "reconciliation_mismatch", "Status amount or currency did not match.", response);
          return jsonResponse({ status: "underpaid", credited: false });
        }
        const { data: credited, error: creditError } = await client.rpc("confirm_credit_payment", {
          p_payment_id: payment.id,
          p_provider_reference: payment.provider_reference,
          p_provider_data: response,
        });
        if (creditError) throw creditError;
        await recordPaymentEvent(client, payment.id, "sasapay", "admin_reconciled_success", `Reconciled by ${user.email ?? user.id}.`, response);
        return jsonResponse({ status: "successful", credited: Boolean(credited) });
      }

      const resultCode = String(response.ResultCode ?? "");
      if (resultCode && resultCode !== "0") {
        const isCancelled = resultCode === "1032" || /cancel/i.test(String(response.ResultDescription ?? ""));
        const status = isCancelled ? "cancelled" : "failed";
        await updatePaymentStatus(client, payment.id, status, String(response.ResultDescription ?? "Provider reported unsuccessful payment."), response);
        await recordPaymentEvent(client, payment.id, "sasapay", "admin_reconciled_status", `Reconciled by ${user.email ?? user.id}: ${status}.`, response);
        return jsonResponse({ status, credited: false });
      }
    } else {
      const apiKey = Deno.env.get("PLISIO_API_KEY") ?? Deno.env.get("PLISIO_SECRET_KEY");
      if (!apiKey || !payment.provider_reference) {
        return jsonResponse({ error: "Plisio invoice verification is not configured." }, 503);
      }
      const responseUrl = new URL(`https://api.plisio.net/api/v1/operations/${encodeURIComponent(payment.provider_reference)}`);
      responseUrl.searchParams.set("api_key", apiKey);
      const providerResponse = await fetch(responseUrl);
      const result = await providerResponse.json();
      response = result?.data ?? {};
      if (!providerResponse.ok || result?.status !== "success") {
        throw new Error("Plisio could not verify this invoice.");
      }
      const status = String(response.status ?? "").toLowerCase();
      if (status === "completed") {
        if (String(response.source_currency ?? "").toUpperCase() !== "USD"
          || !sameAmount(response.source_amount, Number(payment.amount_usd))) {
          await updatePaymentStatus(client, payment.id, "underpaid", "Provider status amount or currency did not match.", response);
          await recordPaymentEvent(client, payment.id, "plisio", "reconciliation_mismatch", "Status amount or currency did not match.", response);
          return jsonResponse({ status: "underpaid", credited: false });
        }
        const { data: credited, error: creditError } = await client.rpc("confirm_credit_payment", {
          p_payment_id: payment.id,
          p_provider_reference: payment.provider_reference,
          p_provider_data: response,
        });
        if (creditError) throw creditError;
        await recordPaymentEvent(client, payment.id, "plisio", "admin_reconciled_success", `Reconciled by ${user.email ?? user.id}.`, response);
        return jsonResponse({ status: "successful", credited: Boolean(credited) });
      }
      if (status === "expired" || status === "mismatch" || status === "underpaid" || status === "cancelled" || status === "error") {
        const paymentStatus = status === "mismatch" || status === "underpaid" ? "underpaid" : status === "error" ? "failed" : status;
        await updatePaymentStatus(client, payment.id, paymentStatus, `Plisio invoice status: ${status}.`, response);
        await recordPaymentEvent(client, payment.id, "plisio", "admin_reconciled_status", `Reconciled by ${user.email ?? user.id}: ${paymentStatus}.`, response);
        return jsonResponse({ status: paymentStatus, credited: false });
      }
    }

    await recordPaymentEvent(client, payment.id, payment.provider, "admin_reconciliation_pending", `Reconciliation requested by ${user.email ?? user.id}.`, response!);
    await updatePaymentStatus(client, payment.id, "pending", null, response!);
    return jsonResponse({ status: "pending", credited: false });
  } catch (verificationError) {
    const message = verificationError instanceof Error ? verificationError.message : "Provider verification failed.";
    await client.from("credit_payments").update({
      verification_error: message,
      updated_at: new Date().toISOString(),
    }).eq("id", payment.id);
    await recordPaymentEvent(client, payment.id, payment.provider, "admin_verification_error", message);
    console.error("Payment reconciliation error:", message);
    return jsonResponse({ error: "Provider verification failed. No credits were added." }, 502);
  }
});
