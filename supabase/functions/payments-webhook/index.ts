import {
  confirmPayment,
  jsonResponse,
  recordPaymentEvent,
  serviceClient,
  updatePaymentStatus,
} from "../_shared/http.ts";
import { getSasapayToken, sasapayRequest, verifyPlisioCallback } from "../_shared/payments.ts";

type Provider = "sasapay" | "plisio";

function asObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function sameAmount(actual: unknown, expected: number) {
  const parsed = Number(actual);
  return Number.isFinite(parsed) && Math.abs(parsed - expected) < 0.005;
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);
  const provider = new URL(request.url).searchParams.get("provider") as Provider | null;
  if (provider !== "plisio" && provider !== "sasapay") {
    return jsonResponse({ error: "Unknown payment provider" }, 400);
  }

  let payload: Record<string, unknown>;
  try {
    payload = asObject(await request.json());
  } catch {
    return jsonResponse({ error: "Invalid provider callback" }, 400);
  }

  const client = serviceClient();
  if (provider === "plisio") {
    const apiKey = Deno.env.get("PLISIO_API_KEY") ?? Deno.env.get("PLISIO_SECRET_KEY");
    if (!apiKey) return jsonResponse({ error: "Payment callback verification is not configured" }, 503);
    if (!await verifyPlisioCallback(payload, apiKey)) {
      await recordPaymentEvent(client, null, provider, "invalid_signature", "Callback signature did not match.");
      return jsonResponse({ error: "Invalid callback signature" }, 401);
    }

    const paymentId = String(payload.order_number ?? "");
    const { data: payment, error } = await client
      .from("credit_payments")
      .select("id,provider,provider_reference,amount_usd,status")
      .eq("id", paymentId)
      .eq("provider", "plisio")
      .maybeSingle();
    if (error || !payment) {
      await recordPaymentEvent(client, null, provider, "unknown_payment", "Signed callback did not match a payment.", {
        order_number: paymentId,
        txn_id: payload.txn_id ?? null,
      });
      return jsonResponse({ error: "Payment was not found" }, 404);
    }

    await recordPaymentEvent(client, payment.id, provider, "callback_received", null, payload);
    const status = String(payload.status ?? payload.Status ?? "").toLowerCase();
    const transactionReference = String(payload.txn_id ?? "");
    if (status === "completed") {
      if (!transactionReference || transactionReference !== payment.provider_reference) {
        const message = "Completed callback transaction reference did not match the stored invoice.";
        await updatePaymentStatus(client, payment.id, "underpaid", message, payload);
        await recordPaymentEvent(client, payment.id, provider, "verification_error", message, {
          txn_id: transactionReference || null,
        });
        return jsonResponse({ error: "Invoice reference verification failed" }, 422);
      }

      const sourceCurrency = String(payload.source_currency ?? "").toUpperCase();
      const sourceAmount = payload.source_amount;
      if (sourceCurrency !== "USD" || !sameAmount(sourceAmount, Number(payment.amount_usd))) {
        const message = "Completed callback did not match the stored invoice currency or USD amount.";
        await updatePaymentStatus(client, payment.id, "underpaid", message, payload);
        await recordPaymentEvent(client, payment.id, provider, "verification_error", message, {
          txn_id: transactionReference || null,
          source_currency: sourceCurrency || null,
          source_amount: sourceAmount ?? null,
        });
        return jsonResponse({ error: "Invoice amount verification failed" }, 422);
      }

      try {
        await confirmPayment(client, payment.id, transactionReference, payload);
      } catch (verificationError) {
        const message = verificationError instanceof Error ? verificationError.message : "Could not credit verified payment.";
        await recordPaymentEvent(client, payment.id, provider, "credit_error", message);
        console.error("Could not finalize Plisio payment:", message);
        return jsonResponse({ error: "Payment confirmation could not be recorded" }, 500);
      }
      return jsonResponse({ received: true });
    }

    const nonSuccessStatus = status === "expired"
      ? "expired"
      : status === "mismatch" || status === "underpaid"
      ? "underpaid"
      : status === "cancelled" || status === "cancelled duplicate"
      ? "cancelled"
      : status === "error" || status === "failed"
      ? "failed"
      : "pending";
    await updatePaymentStatus(
      client,
      payment.id,
      nonSuccessStatus,
      nonSuccessStatus === "pending" ? null : `Plisio invoice status: ${status || "unknown"}`,
      payload,
    );
    return jsonResponse({ received: true });
  }

  const providerReference = String(
    payload.CheckoutRequestID
      ?? payload.checkout_request_id
      ?? payload.MerchantRequestID
      ?? payload.merchant_request_id
      ?? "",
  );
  const { data: payment, error } = await client
    .from("credit_payments")
    .select("id,provider,provider_reference,amount_due,currency,status")
    .eq("provider", "sasapay")
    .eq("provider_reference", providerReference)
    .maybeSingle();
  if (error || !payment) {
    await recordPaymentEvent(client, null, provider, "unknown_payment", "Callback did not match a SasaPay payment.", {
      checkout_request_id: providerReference || null,
    });
    return jsonResponse({ received: true });
  }

  await recordPaymentEvent(client, payment.id, provider, "callback_received", null, payload);
  try {
    const token = await getSasapayToken();
    const statusPath = Deno.env.get("SASAPAY_STATUS_PATH") ?? "payments/transaction-status/";
    const verification = await sasapayRequest(statusPath, token, {
      MerchantCode: Deno.env.get("SASAPAY_MERCHANT_CODE"),
      CheckoutRequestID: payload.CheckoutRequestID ?? payload.checkout_request_id ?? null,
      MerchantRequestID: payload.MerchantRequestID ?? payload.merchant_request_id ?? null,
    });
    const resultCode = String(verification.ResultCode ?? "");
    const responseCode = String(verification.ResponseCode ?? "");
    const amount = verification.Amount ?? verification.amount;
    const currency = String(verification.Currency ?? verification.currency ?? "").toUpperCase();

    if (resultCode === "0") {
      if (!sameAmount(amount, Number(payment.amount_due)) || currency !== payment.currency) {
        const message = "SasaPay status amount or currency did not match the stored checkout.";
        await updatePaymentStatus(client, payment.id, "underpaid", message, verification);
        await recordPaymentEvent(client, payment.id, provider, "verification_error", message, verification);
        return jsonResponse({ received: true });
      }

      await confirmPayment(client, payment.id, providerReference, verification);
      return jsonResponse({ received: true });
    }

    if (resultCode && resultCode !== "0") {
      const cancelled = resultCode === "1032" || /cancel/i.test(String(verification.ResultDescription ?? ""));
      await updatePaymentStatus(
        client,
        payment.id,
        cancelled ? "cancelled" : "failed",
        String(verification.ResultDescription ?? "SasaPay confirmed that the payment did not complete."),
        verification,
      );
      return jsonResponse({ received: true });
    }

    await updatePaymentStatus(
      client,
      payment.id,
      "pending",
      responseCode && responseCode !== "0" ? String(verification.ResponseDescription ?? "Payment is not complete.") : null,
      verification,
    );
    return jsonResponse({ received: true });
  } catch (verificationError) {
    const message = verificationError instanceof Error ? verificationError.message : "SasaPay status verification failed.";
    await updatePaymentStatus(client, payment.id, "pending", message, {});
    await recordPaymentEvent(client, payment.id, provider, "verification_error", message);
    console.error("SasaPay status verification error:", message);
    return jsonResponse({ received: true });
  }
});
