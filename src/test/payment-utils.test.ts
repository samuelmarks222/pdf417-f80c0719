import { createHmac, webcrypto } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  matchesPlisioInvoiceReference,
  normalizeSasapayBaseUrl,
  sasapayApiUrl,
  verifyPlisioCallback,
} from "../../supabase/functions/_shared/payment-utils";

const plisioApiKey = "test-plisio-api-key";

function signPlisioCallback(payload: Record<string, unknown>) {
  const callbackData = { ...payload };
  delete callbackData.verify_hash;
  const sortedCallbackData = Object.fromEntries(
    Object.keys(callbackData).sort().map((key) => [key, callbackData[key]]),
  );
  if ("expire_utc" in sortedCallbackData) {
    sortedCallbackData.expire_utc = String(sortedCallbackData.expire_utc);
  }
  if (typeof sortedCallbackData.tx_urls === "string") {
    sortedCallbackData.tx_urls = decodeURIComponent(sortedCallbackData.tx_urls);
  }
  return createHmac("sha1", plisioApiKey).update(JSON.stringify(sortedCallbackData)).digest("hex");
}

function signPlisioJsonCallback(payload: Record<string, unknown>) {
  const callbackData = { ...payload };
  delete callbackData.verify_hash;
  return createHmac("sha1", plisioApiKey).update(JSON.stringify(callbackData)).digest("hex");
}

describe("payment provider utilities", () => {
  beforeAll(() => {
    vi.stubGlobal("crypto", webcrypto);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("adds the SasaPay API version when omitted and avoids duplicating it", () => {
    expect(normalizeSasapayBaseUrl("https://api.sasapay.app")).toBe("https://api.sasapay.app/api/v1");
    expect(normalizeSasapayBaseUrl("https://sandbox.sasapay.app/api/v1/")).toBe("https://sandbox.sasapay.app/api/v1");
    expect(sasapayApiUrl("https://api.sasapay.app", "/payments/request-payment/"))
      .toBe("https://api.sasapay.app/api/v1/payments/request-payment/");
  });

  it("validates Plisio callbacks using sorted fields, decoded URLs, and the API key", async () => {
    const payload = {
      tx_urls: encodeURIComponent("https://example.test/transaction"),
      status: "completed",
      expire_utc: 1793200000,
      order_number: "payment-123",
    };
    const signedPayload = { ...payload, verify_hash: signPlisioCallback(payload) };

    expect(await verifyPlisioCallback(signedPayload, plisioApiKey)).toBe(true);
    expect(await verifyPlisioCallback(signedPayload, "wrong-key")).toBe(false);
    expect(await verifyPlisioCallback({ ...signedPayload, status: "pending" }, plisioApiKey)).toBe(false);
  });

  it("validates Plisio JSON callbacks in their received field order", async () => {
    const payload = {
      txn_id: "replacement-invoice",
      status: "completed",
      switch_id: "initial-invoice",
      order_number: "payment-123",
      tx_urls: ["https://example.test/transaction"],
    };
    const signedPayload = { ...payload, verify_hash: signPlisioJsonCallback(payload) };

    expect(await verifyPlisioCallback(signedPayload, plisioApiKey)).toBe(true);
    expect(await verifyPlisioCallback({ ...signedPayload, status: "pending" }, plisioApiKey)).toBe(false);
  });

  it("rejects malformed encoded transaction URLs", async () => {
    const payload = { tx_urls: "%zz", status: "completed" };
    const signature = createHmac("sha1", plisioApiKey).update(JSON.stringify(payload)).digest("hex");

    expect(await verifyPlisioCallback({ ...payload, verify_hash: signature }, plisioApiKey)).toBe(false);
  });

  it("accepts a completed Plisio child invoice when it links to the original invoice", () => {
    expect(matchesPlisioInvoiceReference("initial-invoice", "initial-invoice", null)).toBe(true);
    expect(matchesPlisioInvoiceReference("initial-invoice", "replacement-invoice", "initial-invoice")).toBe(true);
    expect(matchesPlisioInvoiceReference("initial-invoice", "replacement-invoice", "another-invoice")).toBe(false);
    expect(matchesPlisioInvoiceReference("initial-invoice", null, "initial-invoice")).toBe(false);
  });

});
