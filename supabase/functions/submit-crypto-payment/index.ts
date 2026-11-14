import { authenticatedUser, jsonResponse, preflight, recordPaymentEvent, serviceClient } from "../_shared/http.ts";

Deno.serve(async (request: Request) => {
  const options = preflight(request);
  if (options) return options;
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const user = await authenticatedUser(request);
  if (!user) return jsonResponse({ error: "Sign in to submit your transaction hash." }, 401);

  let body: { paymentId?: string; transactionHash?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }
  const paymentId = body.paymentId?.trim();
  const transactionHash = body.transactionHash?.trim();
  if (!paymentId || !transactionHash || !/^[A-Za-z0-9_-]{16,160}$/.test(transactionHash)) {
    return jsonResponse({ error: "Enter a valid blockchain transaction hash." }, 400);
  }

  const client = serviceClient();
  const { data: payment, error: paymentError } = await client
    .from("credit_payments")
    .select("id,provider_data,provider_reference,status")
    .eq("id", paymentId)
    .eq("user_id", user.id)
    .eq("provider", "manual_crypto")
    .maybeSingle();
  if (paymentError || !payment) return jsonResponse({ error: "Crypto payment was not found." }, 404);
  if (payment.status !== "pending") return jsonResponse({ error: "This payment is no longer pending." }, 409);
  if (payment.provider_reference) return jsonResponse({ error: "A transaction hash has already been submitted for this payment." }, 409);

  const { data: updated, error: updateError } = await client
    .from("credit_payments")
    .update({
      provider_reference: transactionHash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .is("provider_reference", null)
    .select("id")
    .maybeSingle();
  if (updateError) {
    if (updateError.code === "23505") {
      return jsonResponse({ error: "That transaction hash has already been submitted." }, 409);
    }
    console.error("Could not save manual crypto transaction hash:", updateError.message);
    return jsonResponse({ error: "Could not submit the transaction hash. Please try again." }, 500);
  }
  if (!updated) return jsonResponse({ error: "A transaction hash has already been submitted for this payment." }, 409);

  await recordPaymentEvent(client, payment.id, "manual_crypto", "transaction_submitted", null, {
    transaction_hash: transactionHash,
    crypto_asset: payment.provider_data?.crypto_asset ?? null,
  });
  return jsonResponse({ status: "pending" });
});
