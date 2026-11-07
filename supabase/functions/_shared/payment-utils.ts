export function normalizeSasapayBaseUrl(baseUrl: string) {
  const normalized = baseUrl.trim().replace(/\/+$/, "");
  return /\/api\/v1$/i.test(normalized) ? normalized : `${normalized}/api/v1`;
}

export function sasapayApiUrl(baseUrl: string, path: string) {
  return `${normalizeSasapayBaseUrl(baseUrl)}/${path.replace(/^\/+/, "")}`;
}

function hexDigest(digest: ArrayBuffer) {
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hmacMatches(expected: string, signature: string) {
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ signature.toLowerCase().charCodeAt(index);
  }
  return mismatch === 0;
}

async function hmacHex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  return hexDigest(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

export async function verifyPlisioCallback(payload: Record<string, unknown>, apiKey: string) {
  const signature = payload.verify_hash;
  if (typeof signature !== "string") return false;

  const callbackData = { ...payload };
  delete callbackData.verify_hash;
  const legacyCallbackData = Object.fromEntries(
    Object.keys(callbackData).sort().map((key) => [key, callbackData[key]]),
  );
  if ("expire_utc" in legacyCallbackData) {
    legacyCallbackData.expire_utc = String(legacyCallbackData.expire_utc);
  }
  if (typeof legacyCallbackData.tx_urls === "string") {
    try {
      legacyCallbackData.tx_urls = decodeURIComponent(legacyCallbackData.tx_urls);
    } catch {
      return false;
    }
  }

  // `callback_url?...&json=true` makes Plisio send JSON. Its Node example
  // signs the callback object in received field order. Keep the legacy sorted
  // form for previously configured callbacks while evaluating both forms in
  // constant-time comparisons.
  const [receivedOrder, legacyOrder] = await Promise.all([
    hmacHex(apiKey, JSON.stringify(callbackData)),
    hmacHex(apiKey, JSON.stringify(legacyCallbackData)),
  ]);
  const receivedOrderMatches = hmacMatches(receivedOrder, signature);
  const legacyOrderMatches = hmacMatches(legacyOrder, signature);
  return receivedOrderMatches || legacyOrderMatches;
}

/**
 * Plisio creates a child invoice when the buyer changes cryptocurrencies in its
 * hosted checkout. A signed callback for the child retains the original
 * invoice ID in `switch_id`; treating only `txn_id` as valid rejects an
 * otherwise completed payment.
 */
export function matchesPlisioInvoiceReference(
  storedReference: string | null,
  transactionReference: string | null,
  switchReference: string | null,
) {
  if (!storedReference || !transactionReference) return false;
  return transactionReference === storedReference || switchReference === storedReference;
}
