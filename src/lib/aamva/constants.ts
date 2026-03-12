export const AAMVA_CONTROL = {
  LF: "\n",
  RS: "\x1e",
  CR: "\r",
} as const;

export const AAMVA_REAL_ID_COMPLIANCE = "F" as const;
export const JURISDICTION_SUBFILE_TYPE = "ZA" as const;

export const FALLBACKS = {
  DOB: "01011990",
  ISSUE: "01012020",
  EXPIRY: "01012030",
  REVISION: "01012020",
  HEIGHT_INCHES: 69,
  WEIGHT_LBS: "170",
  POSTAL_CODE: "00000",
  LICENSE_NUMBER: "A0000000",
  FIRST_NAME: "JOHN",
  LAST_NAME: "DOE",
  CITY: "ANYTOWN",
  STREET: "123 MAIN ST",
  STATE: "CA",
} as const;
