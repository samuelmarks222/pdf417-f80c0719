import { describe, expect, it } from "vitest";
import { generateDD } from "@/lib/documentGenerators";

describe("California document discriminator", () => {
  it("uses the issue date, five random digits, fixed AAFD code, and expiry year", () => {
    const dd = generateDD("CA", "01092025", "01092028");

    expect(dd).toMatch(/^01\/09\/2025\d{5}\/AAFD\/28$/);
  });
});
