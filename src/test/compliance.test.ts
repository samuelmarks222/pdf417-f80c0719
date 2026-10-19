import { describe, it, expect } from "vitest";
import { encodeAAMVA } from "@/lib/aamvaEncoder";
import type { AamvaEncodeInput } from "@/lib/aamva/builders";

const base: AamvaEncodeInput = {
  stateCode: "CA",
  firstName: "EMILY",
  middleName: "",
  lastName: "GAWEY",
  firstMiddleName: "EMILY",
  nameSuffix: "NONE",
  streetAddress: "123 MAIN ST",
  city: "LOS ANGELES",
  postalCode: "900010000",
  dateOfBirth: "01151970",
  gender: "2",
  eyeColor: "BRO",
  hairColor: "BRO",
  height: "69",
  weight: "169",
  race: "",
  licenseNumber: "D1234567",
  dlClass: "C",
  issueDate: "08262021",
  expirationDate: "01152026",
  documentDiscriminator: "39JVRM7512",
  inventoryControlNumber: "A8F9G2H1J3K",
  restrictions: "NONE",
  endorsement: "NONE",
  donor: "N",
  revisionDate: "08292017",
};

const IIN = "636014";

describe("DDA compliance type", () => {
  it("encodes DDA=F when compliance type F is selected", () => {
    const encoded = encodeAAMVA({ ...base, complianceType: "F" }, IIN, "09", "01");
    expect(encoded).toContain("DDAF");
  });

  it("defaults to DDA=F when no compliance type is given", () => {
    expect(encodeAAMVA(base, IIN, "09", "01")).toContain("DDAF");
  });

  it("falls back to DDA=F for an unknown compliance type", () => {
    expect(encodeAAMVA({ ...base, complianceType: "Z" }, IIN, "09", "01")).toContain("DDAF");
  });

  it("encodes a non-compliant type when explicitly selected", () => {
    expect(encodeAAMVA({ ...base, complianceType: "A" }, IIN, "09", "01")).toContain("DDAA");
  });
});
