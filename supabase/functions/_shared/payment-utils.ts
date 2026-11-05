export function normalizeSasapayBaseUrl(baseUrl: string) {
  const normalized = baseUrl.trim().replace(/\/+$/, "");
  return /\/api\/v1$/i.test(normalized) ? normalized : `${normalized}/api/v1`;
}

export function sasapayApiUrl(baseUrl: string, path: string) {
  return `${normalizeSasapayBaseUrl(baseUrl)}/${path.replace(/^\/+/, "")}`;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map(
        (key) => [key, sortObjectKeys((value as Record<string, unknown>)[key])],
      ),
    );
  }
  return value;
}

export async function verifyNowPaymentsIpn(
  payload: Record<string, unknown>,
  signature: string | null,
  ipnSecret: string,
) {
  if (!signature || !/^[a-f\d]{128}$/i.test(signature)) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ipnSecret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(JSON.stringify(sortObjectKeys(payload))),
  );
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ signature.toLowerCase().charCodeAt(index);
  }
  return mismatch === 0;
}

export async function verifyPlisioCallback(payload: Record<string, unknown>, apiKey: string) {
  const signature = payload.verify_hash;
  if (typeof signature !== "string") return false;

  const callbackData = { ...payload };
  delete callbackData.verify_hash;

  const sortedCallbackData = Object.fromEntries(
    Object.keys(callbackData).sort().map((key) => [key, callbackData[key]]),
  );
  if ("expire_utc" in sortedCallbackData) {
    sortedCallbackData.expire_utc = String(sortedCallbackData.expire_utc);
  }
  if (typeof sortedCallbackData.tx_urls === "string") {
    try {
      sortedCallbackData.tx_urls = decodeURIComponent(sortedCallbackData.tx_urls);
    } catch {
      return false;
    }
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(apiKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(JSON.stringify(sortedCallbackData)));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  }
  return mismatch === 0;
}
