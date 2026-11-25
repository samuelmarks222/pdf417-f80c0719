import { describe, expect, it } from "vitest";
import { generateDD, generateICN } from "@/lib/documentGenerators";
import { generateRandomData } from "@/lib/aamvaData";

describe("California document discriminator", () => {
  it("uses the issue date, five random digits, fixed AAFD code, and expiry year", () => {
    const dd = generateDD("CA", "01092025", "01092028");

    expect(dd).toMatch(/^01\/09\/2025\d{5}\/AAFD\/28$/);
  });
});

describe("Alabama ICN and DL class", () => {
  it("uses the document number, random digits, issue year, day of year, and 01 suffix", () => {
    const icn = generateICN("AL", "50764683", "08262023");

    expect(icn).toMatch(/^50764683\d{5}2323801$/);
  });

  it("sets the generated DL class to NONE", () => {
    expect(generateRandomData("AL").dlClass).toBe("NONE");
  });
});

describe("Florida ICN", () => {
  it("uses the fixed 0100 prefix followed by 12 random digits", () => {
    expect(generateICN("FL", "H655435851100", "04112020")).toMatch(/^0100\d{12}$/);
  });
});

describe("Alaska DD and ICN", () => {
  it("embeds the issue date in YYMMDD format in the DD", () => {
    expect(generateDD("AK", "08262020")).toMatch(/^\d{7} \d{3}200826[A-Z]{3}-[01]$/);
  });

  it("uses a 1000 prefix followed by six random digits in the ICN", () => {
    expect(generateICN("AK")).toMatch(/^1000\d{6}$/);
  });
});
