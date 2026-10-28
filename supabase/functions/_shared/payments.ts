import { sasapayApiUrl } from "./payment-utils.ts";

export { normalizeSasapayBaseUrl, verifyPlisioCallback } from "./payment-utils.ts";

export async function getSasapayToken() {
  const baseUrl = Deno.env.get("SASAPAY_BASE_URL");
  const consumerKey = Deno.env.get("SASAPAY_CLIENT_ID") ?? Deno.env.get("SASAPAY_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("SASAPAY_CLIENT_SECRET") ?? Deno.env.get("SASAPAY_CONSUMER_SECRET");
  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error("SasaPay credentials and base URL are required");
  }

  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  const response = await fetch(sasapayApiUrl(baseUrl, "auth/token/?grant_type=client_credentials"), {
    method: "GET",
    headers: { Authorization: `Basic ${credentials}`, Accept: "application/json" },
  });
  const result = await response.json();
  if (!response.ok || typeof result.access_token !== "string") {
    throw new Error(`SasaPay authentication failed (${response.status})`);
  }
  return result.access_token;
}

export async function sasapayRequest(path: string, token: string, body: Record<string, unknown>) {
  const baseUrl = Deno.env.get("SASAPAY_BASE_URL");
  if (!baseUrl) throw new Error("SASAPAY_BASE_URL is required");
  const response = await fetch(sasapayApiUrl(baseUrl, path), {
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
