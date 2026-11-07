import {
  confirmPayment,
  jsonResponse,
  recordPaymentEvent,
  serviceClient,
  updatePaymentStatus,
} from "../_shared/http.ts";
import {
  getSasapayToken,
  matchesPlisioInvoiceReference,
  sasapayRequest,
  verifyNowPaymentsIpn,
  verifyPlisioCallback,
} from "../_shared/payments.ts";

type Provider = "sasapay" | "nowpayments" | "plisio";

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
  if (provider !== "plisio" && provider !== "sasapay" && provider !== "nowpayments") {
    return jsonResponse({ error: "Unknown payment provider" }, 400);
  }

  let payload: Record<string, unknown>;
  try {
    payload = asObject(await request.json());
  } catch {
    return jsonResponse({ error: "Invalid provider callback" }, 400);
  }

  const client = serviceClient();
  if (provider === "nowpayments") {
    const ipnSecret = Deno.env.get("NOWPAYMENTS_IPN_SECRET");
    const apiKey = Deno.env.get("NOWPAYMENTS_API_KEY");
    if (!ipnSecret || !apiKey) {
      return jsonResponse({ error: "NOWPayments callback verification is not configured" }, 503);
    }
    if (!await verifyNowPaymentsIpn(payload, request.headers.get("x-nowpayments-sig"), ipnSecret)) {
      await recordPaymentEvent(client, null, provider, "invalid_signature", "IPN signature did not match.");
      return jsonResponse({ error: "Invalid IPN signature" }, 401);
    }

    const paymentId = String(payload.order_id ?? "");
    const providerPaymentId = String(payload.payment_id ?? "");
    if (!paymentId || !providerPaymentId) {
      await recordPaymentEvent(client, null, provider, "invalid_callback", "Signed IPN did not include order or payment ID.", payload);
      return jsonResponse({ error: "Callback is missing a payment reference" }, 400);
    }
    const { data: payment, error } = await client
      .from("credit_payments")
      .select("id,provider,provider_reference,amount_usd,status")
      .eq("id", paymentId)
      .eq("provider", "nowpayments")
      .maybeSingle();
    if (error || !payment) {
      await recordPaymentEvent(client, null, provider, "unknown_payment", "Signed IPN did not match a payment.", {
        order_id: paymentId,
        payment_id: providerPaymentId,
      });
      return jsonResponse({ error: "Payment was not found" }, 404);
    }

    await recordPaymentEvent(client, payment.id, provider, "callback_received", null, payload);
    try {
      const verificationResponse = await fetch(
        `https://api.nowpayments.io/v1/payment/${encodeURIComponent(providerPaymentId)}`,
        { headers: { "x-api-key": apiKey, Accept: "application/json" } },
      );
      const verifiedPayment = asObject(await verificationResponse.json().catch(() => null));
      if (!verificationResponse.ok) {
        throw new Error(`NOWPayments payment verification failed (${verificationResponse.status}).`);
      }

      const invoiceId = String(verifiedPayment.invoice_id ?? "");
      if (String(verifiedPayment.order_id ?? "") !== payment.id
        || !payment.provider_reference
        || (invoiceId && invoiceId !== payment.provider_reference)) {
        await recordPaymentEvent(client, payment.id, provider, "verification_error", "Payment or invoice reference did not match the stored checkout.", {
          payment_id: providerPaymentId,
          invoice_id: invoiceId || null,
        });
        return jsonResponse({ error: "Payment reference verification failed" }, 422);
      }

      const status = String(verifiedPayment.payment_status ?? "").toLowerCase();
      if (status === "finished") {
        const priceCurrency = String(verifiedPayment.price_currency ?? "").toUpperCase();
        if (priceCurrency !== "USD" || !sameAmount(verifiedPayment.price_amount, Number(payment.amount_usd))) {
          const message = "Completed payment did not match the stored invoice currency or USD amount.";
          await updatePaymentStatus(client, payment.id, "underpaid", message, verifiedPayment);
          await recordPaymentEvent(client, payment.id, provider, "verification_error", message, verifiedPayment);
          return jsonResponse({ error: "Invoice amount verification failed" }, 422);
        }

        try {
          await confirmPayment(client, payment.id, payment.provider_reference, {
            ...verifiedPayment,
            invoice_id: invoiceId,
          });
        } catch (verificationError) {
          const message = verificationError instanceof Error ? verificationError.message : "Could not credit verified payment.";
          await recordPaymentEvent(client, payment.id, provider, "credit_error", message);
          console.error("Could not finalize NOWPayments payment:", message);
          return jsonResponse({ error: "Payment confirmation could not be recorded" }, 500);
        }
        return jsonResponse({ received: true });
      }

      const nonSuccessStatus = status === "expired"
        ? "expired"
        : status === "partially_paid"
        ? "underpaid"
        : status === "failed" || status === "refunded"
        ? "failed"
        : "pending";
      await updatePaymentStatus(
        client,
        payment.id,
        nonSuccessStatus,
        nonSuccessStatus === "pending" ? null : `NOWPayments status: ${status || "unknown"}`,
        verifiedPayment,
      );
      return jsonResponse({ received: true });
    } catch (verificationError) {
      const message = verificationError instanceof Error ? verificationError.message : "NOWPayments payment verification failed.";
      await recordPaymentEvent(client, payment.id, provider, "verification_error", message, payload);
      console.error("NOWPayments payment verification error:", message);
      return jsonResponse({ error: "Payment verification failed; provider may retry the callback." }, 503);
    }
  }

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
      const switchReference = typeof payload.switch_id === "string" ? payload.switch_id : null;
      if (!matchesPlisioInvoiceReference(payment.provider_reference, transactionReference || null, switchReference)) {
        const message = "Completed callback transaction reference did not match the stored invoice.";
        await updatePaymentStatus(client, payment.id, "underpaid", message, payload);
        await recordPaymentEvent(client, payment.id, provider, "verification_error", message, {
          txn_id: transactionReference || null,
          switch_id: switchReference,
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
      : status === "cancelled"
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
