import { authenticatedUser, jsonResponse, preflight, serviceClient } from "../_shared/http.ts";
import { getSasapayToken, sasapayRequest } from "../_shared/payments.ts";

type Provider = "sasapay" | "plisio";

Deno.serve(async (request: Request) => {
  const options = preflight(request);
  if (options) return options;
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const user = await authenticatedUser(request);
  if (!user) return jsonResponse({ error: "Sign in to purchase credits." }, 401);

  let body: { packageId?: string; provider?: Provider; phoneNumber?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }
  if (!body.packageId || !["sasapay", "plisio"].includes(body.provider ?? "")) {
    return jsonResponse({ error: "Choose a valid package and payment provider." }, 400);
  }

  const provider = body.provider as Provider;
  const appOrigin = Deno.env.get("APP_ORIGIN")?.replace(/\/$/, "");
  const client = serviceClient();
  const { data: pkg, error: packageError } = await client
    .from("credit_packages")
    .select("id,name,credits,price_usd,active")
    .eq("id", body.packageId)
    .eq("active", true)
    .maybeSingle();
  if (packageError) return jsonResponse({ error: "Could not load the selected package." }, 500);
  if (!pkg) return jsonResponse({ error: "That package is not available." }, 404);

  const callbackUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/payments-webhook`;
  const paymentId = crypto.randomUUID();
  const checkoutReference = paymentId;
  let amountDue = Number(pkg.price_usd);
  let currency = "USD";
  let normalizedPhone: string | null = null;

  if (provider === "sasapay") {
    const exchangeRate = Number(Deno.env.get("SASAPAY_KES_PER_USD"));
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      return jsonResponse({ error: "SasaPay checkout is not configured with a valid KES-per-USD rate." }, 503);
    }
    if (!Deno.env.get("SASAPAY_MERCHANT_CODE")) {
      return jsonResponse({ error: "SasaPay merchant settings are not configured." }, 503);
    }
    const phone = (body.phoneNumber ?? "").replace(/[^\d+]/g, "").replace(/^\+/, "");
    normalizedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;
    if (!/^254[17]\d{8}$/.test(normalizedPhone)) {
      return jsonResponse({ error: "Enter a valid Kenyan M-Pesa number, such as 0712345678." }, 400);
    }
    amountDue = Math.ceil(Number(pkg.price_usd) * exchangeRate);
    currency = "KES";
  } else {
    if (!Deno.env.get("PLISIO_API_KEY") && !Deno.env.get("PLISIO_SECRET_KEY")) {
      return jsonResponse({ error: "Plisio is not configured for this deployment." }, 503);
    }
    if (!appOrigin) return jsonResponse({ error: "APP_ORIGIN is required for Plisio return URLs." }, 503);
  }

  const { error: insertError } = await client.from("credit_payments").insert({
    id: paymentId,
    user_id: user.id,
    package_id: pkg.id,
    provider,
    checkout_reference: checkoutReference,
    credits_granted: pkg.credits,
    amount_usd: pkg.price_usd,
    amount_due: amountDue,
    currency,
    phone_number: normalizedPhone,
    status: "pending",
  });
  if (insertError) {
    console.error("Could not create pending payment:", insertError.message);
    return jsonResponse({ error: "Could not start checkout." }, 500);
  }

  try {
    if (provider === "plisio") {
      const apiKey = Deno.env.get("PLISIO_API_KEY") ?? Deno.env.get("PLISIO_SECRET_KEY")!;
      const params = new URLSearchParams({
        api_key: apiKey,
        order_number: paymentId,
        order_name: `${pkg.name} barcode credits`,
        source_currency: "USD",
        source_amount: Number(pkg.price_usd).toFixed(2),
        callback_url: `${callbackUrl}?provider=plisio&json=true`,
        success_callback_url: `${appOrigin}/account?payment=${paymentId}`,
        fail_callback_url: `${appOrigin}/account?payment=${paymentId}`,
        json: "true",
      });
      const response = await fetch(`https://api.plisio.net/api/v1/invoices/new?${params}`);
      const result = await response.json().catch(() => null);
      const invoice = result?.data;
      if (!response.ok || result?.status !== "success" || !invoice?.txn_id || !invoice?.invoice_url) {
        const providerMessage = result?.data?.message ?? result?.message ?? result?.error;
        const safeProviderMessage = typeof providerMessage === "string"
          ? providerMessage.replaceAll(apiKey, "[redacted]").slice(0, 300)
          : "";
        const details = safeProviderMessage
          ? `: ${safeProviderMessage}`
          : ` (HTTP ${response.status}; check that the Plisio API key and shop are active)`;
        throw new Error(`Plisio invoice request failed${details}`);
      }

      const { error } = await client.from("credit_payments").update({
        provider_reference: String(invoice.txn_id),
        checkout_url: String(invoice.invoice_url),
        provider_data: { txn_id: invoice.txn_id, invoice_url: invoice.invoice_url },
        updated_at: new Date().toISOString(),
      }).eq("id", paymentId);
      if (error) throw new Error("Could not save Plisio invoice reference.");

      return jsonResponse({
        paymentId,
        provider,
        status: "pending",
        checkoutUrl: invoice.invoice_url,
        amount: Number(pkg.price_usd).toFixed(2),
        currency: "USD",
      });
    }

    const token = await getSasapayToken();
    const response = await sasapayRequest("payments/request-payment/", token, {
      MerchantCode: Deno.env.get("SASAPAY_MERCHANT_CODE"),
      NetworkCode: Deno.env.get("SASAPAY_NETWORK_CODE") ?? "63902",
      PhoneNumber: normalizedPhone,
      Currency: "KES",
      Amount: amountDue,
      CallBackURL: `${callbackUrl}?provider=sasapay`,
      AccountReference: paymentId,
      TransactionDesc: `${pkg.name} barcode credits`,
      RequestRefID: paymentId,
    });
    const accepted = String(response.ResponseCode ?? "") === "0";
    const providerReference = String(response.CheckoutRequestID ?? response.MerchantRequestID ?? "");
    if (!accepted || !providerReference) {
      throw new Error(String(response.ResponseDescription ?? response.message ?? "SasaPay did not accept the payment request."));
    }

    const { error } = await client.from("credit_payments").update({
      provider_reference: providerReference,
      provider_data: {
        checkout_request_id: response.CheckoutRequestID ?? null,
        merchant_request_id: response.MerchantRequestID ?? null,
      },
      updated_at: new Date().toISOString(),
    }).eq("id", paymentId);
    if (error) throw new Error("Could not save SasaPay payment reference.");

    return jsonResponse({
      paymentId,
      provider,
      status: "pending",
      message: String(response.CustomerMessage ?? response.ResponseDescription ?? "Check your phone to complete M-Pesa payment."),
      amount: amountDue,
      currency,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The payment provider request failed.";
    await client.rpc("update_credit_payment_status", {
      p_payment_id: paymentId,
      p_status: "failed",
      p_error: message,
      p_provider_data: {},
    });
    await client.from("payment_events").insert({
      payment_id: paymentId,
      provider,
      event_type: "checkout_error",
      message,
      payload: {},
    });
    console.error(`${provider} checkout error:`, message);
    const userMessage = provider === "plisio"
      ? message
      : "Could not start provider checkout. Please try again later.";
    return jsonResponse({ error: userMessage }, 502);
  }
});
