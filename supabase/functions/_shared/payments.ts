export async function getSasapayToken() {
  const baseUrl = Deno.env.get("SASAPAY_BASE_URL");
  const consumerKey = Deno.env.get("SASAPAY_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("SASAPAY_CONSUMER_SECRET");
  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error("SasaPay credentials and base URL are required");
  }

  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/auth/token/?grant_type=client_credentials`, {
    method: "GET",
    headers: { Authorization: `Basic ${credentials}`, Accept: "application/json" },
  });
  const result = await response.json();
  if (!response.ok || typeof result.access_token !== "string") {
    throw new Error(`SasaPay authentication failed (${response.status})`);
  }
  return result.access_token as string;
}

export async function sasapayRequest(path: string, token: string, body: Record<string, unknown>) {
  const baseUrl = Deno.env.get("SASAPAY_BASE_URL");
  if (!baseUrl) throw new Error("SASAPAY_BASE_URL is required");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, {
    method: "POST",
    headers: {
      Authorization: ["Bearer", token].join(" "),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`SasaPay request failed (${response.status})`);
  return result as Record<string, unknown>;
}

export async function verifyPlisioCallback(payload: Record<string, unknown>, secret: string) {
  const signature = payload.verify_hash;
  if (typeof signature !== "string") return false;

  const signedPayload = { ...payload };
  delete signedPayload.verify_hash;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(JSON.stringify(signedPayload)));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  }
  return mismatch === 0;
}
