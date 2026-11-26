import { describe, expect, it } from "vitest";
import { generateDD, generateICN } from "@/lib/documentGenerators";
import { generateRandomData } from "@/lib/aamvaData";
import { generateDLNumber } from "@/lib/calculators";
import { STATE_CONFIGS } from "@/lib/stateConfigs";

describe("California document discriminator", () => {
  it("uses the issue date, five random digits, fixed AAFD code, and expiry year", () => {
    const dd = generateDD("CA", "01092025", "01092028");

    expect(dd).toMatch(/^01\/09\/2025\d{5}\/AAFD\/28$/);
  });

  it("uses the issue year, day of year, DL number, and fixed 0401 ICN suffix", () => {
    expect(generateICN("CA", "D1234567", "08252021")).toBe("21237D12345670401");
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

describe("Alabama hair color field", () => {
  it("shows the ANSI hair color field for both revisions", () => {
    const alabama = STATE_CONFIGS.find((state) => state.code === "AL");

    expect(alabama?.revisions.map((revision) => revision.fields.hasHairColor)).toEqual([true, true]);
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

describe("Arizona DL number", () => {
  it("uses a fixed D prefix in generated form data", () => {
    expect(generateRandomData("AZ").licenseNumber).toMatch(/^D\d{8}$/);
  });

  it("uses a fixed D prefix when recalculated", () => {
    expect(generateDLNumber("AZ")).toMatch(/^D\d{8}$/);
  });
});

describe("Arkansas identifiers", () => {
  it("uses a fixed 9 prefix followed by eight random digits", () => {
    expect(generateRandomData("AR").licenseNumber).toMatch(/^9\d{8}$/);
    expect(generateDLNumber("AR")).toMatch(/^9\d{8}$/);
  });

  it("uses the Arkansas DD and ICN formats when randomizing form data", () => {
    const data = generateRandomData("AR");

    expect(data.documentDiscriminator).toMatch(/^\d{9,10} \d{4}$/);
    expect(data.inventoryControlNumber).toMatch(/^02101\d{11}$/);
  });

  it("generates a DD with 9 or 10 digits, a space, and four digits", () => {
    expect(generateDD("AR", "08262020")).toMatch(/^\d{9,10} \d{4}$/);
  });

  it("uses the 02101 prefix followed by eleven random digits for ICN", () => {
    expect(generateICN("AR", "935713596", "08262020")).toMatch(/^02101\d{11}$/);
  });
});

describe("Ohio identifiers", () => {
  it("uses nine random digits for DD", () => {
    expect(generateDD("OH")).toMatch(/^\d{9}$/);
  });

  it("uses one random letter followed by eight digits for ICN", () => {
    expect(generateICN("OH")).toMatch(/^[A-Z]\d{8}$/);
  });

  it("uses the Ohio DD and ICN formats when randomizing form data", () => {
    const data = generateRandomData("OH");

    expect(data.documentDiscriminator).toMatch(/^\d{9}$/);
    expect(data.inventoryControlNumber).toMatch(/^[A-Z]\d{8}$/);
  });
});
