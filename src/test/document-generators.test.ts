import { describe, expect, it } from "vitest";
import { generateDD } from "@/lib/documentGenerators";
import { getDDFormat, isValidDD } from "@/lib/ddFormats";

describe("configured U.S. document discriminators", () => {
  it("uses the configured California length and character type", () => {
    const dd = generateDD("CA", "01092025", "01092028");

    expect(dd).toHaveLength(12);
    expect(isValidDD(dd, getDDFormat("CA"))).toBe(true);
  });

  it("provides an entry and compliant generated value for all 51 jurisdictions", () => {
    const codes = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    ];

    expect(codes).toHaveLength(51);
    for (const code of codes) {
      const format = getDDFormat(code);
      const dd = generateDD(code);
      expect(format).toBeDefined();
      expect(dd).toHaveLength(format!.length);
      expect(isValidDD(dd, format)).toBe(true);
    }
  });
});
