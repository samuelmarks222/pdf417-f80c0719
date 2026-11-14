import { authenticatedUser, jsonResponse, preflight, serviceClient } from "../_shared/http.ts";
import { getSasapayToken, sasapayRequest } from "../_shared/payments.ts";

type Provider = "sasapay" | "plisio" | "manual_crypto";
type CryptoAsset = "BTC" | "LTC" | "ETH" | "USDT_TRC20" | "USDC_ERC20";

const cryptoAssets: Record<CryptoAsset, { name: string; network: string; setting: string }> = {
  BTC: { name: "Bitcoin", network: "Bitcoin", setting: "crypto_btc_address" },
  LTC: { name: "Litecoin", network: "Litecoin", setting: "crypto_ltc_address" },
  ETH: { name: "Ethereum", network: "Ethereum (ERC-20)", setting: "crypto_eth_address" },
  USDT_TRC20: { name: "Tether (USDT)", network: "Tron (TRC-20)", setting: "crypto_usdt_trc20_address" },
  USDC_ERC20: { name: "USD Coin (USDC)", network: "Ethereum (ERC-20)", setting: "crypto_usdc_erc20_address" },
};

function redactProviderSecrets(message: string) {
  let redacted = message.replace(/([?&]api_key=)[^&\s)]+/gi, "$1[redacted]");
  const secrets = [
    Deno.env.get("PLISIO_API_KEY"),
    Deno.env.get("PLISIO_SECRET_KEY"),
    Deno.env.get("SASAPAY_CLIENT_SECRET"),
    Deno.env.get("SASAPAY_CONSUMER_SECRET"),
  ].filter((secret): secret is string => Boolean(secret));

  for (const secret of secrets) {
    redacted = redacted.replaceAll(secret, "[redacted]");
    redacted = redacted.replaceAll(encodeURIComponent(secret), "[redacted]");
  }
  return redacted;
}

Deno.serve(async (request: Request) => {
  const options = preflight(request);
  if (options) return options;
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const user = await authenticatedUser(request);
  if (!user) return jsonResponse({ error: "Sign in to purchase credits." }, 401);

  let body: { packageId?: string; provider?: Provider; phoneNumber?: string; cryptoAsset?: CryptoAsset };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }
  if (!body.packageId) return jsonResponse({ error: "Choose a credit package first." }, 400);
  if (!["sasapay", "plisio", "manual_crypto"].includes(body.provider ?? "")) {
    return jsonResponse({ error: "Choose M-Pesa or manual crypto as your payment method." }, 400);
  }

  const provider = body.provider as Provider;
  const cryptoAsset = body.cryptoAsset;
  const cryptoOption = provider === "manual_crypto"
      && cryptoAsset
      && Object.prototype.hasOwnProperty.call(cryptoAssets, cryptoAsset)
    ? cryptoAssets[cryptoAsset]
    : null;
  if (provider === "manual_crypto" && !cryptoOption) {
    return jsonResponse({ error: "Choose a supported cryptocurrency and network." }, 400);
  }
  const appOrigin = Deno.env.get("APP_ORIGIN")?.replace(/\/$/, "");
  const client = serviceClient();
  let cryptoAddress: string | null = null;
  if (provider === "manual_crypto" && cryptoOption) {
    const { data: settings, error: settingsError } = await client
      .from("site_settings")
      .select(cryptoOption.setting)
      .eq("id", 1)
      .maybeSingle();
    if (settingsError) return jsonResponse({ error: "Could not load the configured crypto wallet." }, 500);
    const configuredAddress = settings?.[cryptoOption.setting];
    cryptoAddress = typeof configuredAddress === "string" ? configuredAddress.trim() : null;
    if (!cryptoAddress) {
      return jsonResponse({ error: `Manual ${cryptoOption.name} payments are not configured yet. Contact an administrator.` }, 503);
    }
  }
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
  } else if (provider === "plisio") {
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
    provider_data: provider === "manual_crypto" && cryptoOption
      ? {
        crypto_asset: cryptoAsset,
        asset_name: cryptoOption.name,
        network: cryptoOption.network,
        wallet_address: cryptoAddress,
      }
      : {},
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
        success_invoice_url: `${appOrigin}/account?payment=${paymentId}`,
        fail_invoice_url: `${appOrigin}/account?payment=${paymentId}`,
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

    if (provider === "manual_crypto" && cryptoOption && cryptoAddress) {
      return jsonResponse({
        paymentId,
        provider,
        status: "pending",
        asset: cryptoAsset,
        assetName: cryptoOption.name,
        network: cryptoOption.network,
        walletAddress: cryptoAddress,
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
    const rawMessage = error instanceof Error ? error.message : "The payment provider request failed.";
    const message = redactProviderSecrets(rawMessage);
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
    const userMessage = provider === "sasapay"
      ? "Could not start M-Pesa checkout. Please try again later."
      : provider === "manual_crypto"
      ? "Could not start crypto checkout. Please try again later."
      : "Could not start cryptocurrency checkout. Please try again later.";
    return jsonResponse({ error: userMessage }, 502);
  }
});
