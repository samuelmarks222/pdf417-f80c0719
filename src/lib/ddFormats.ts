export type DDCharacterType = "numeric" | "alphanumeric";
export type DDLogicType = "formula-based" | "randomized";

export interface DDFormat {
  jurisdiction: string;
  abbreviation: string;
  length: number;
  characterType: DDCharacterType;
  logicType: DDLogicType;
  structure: string;
  verificationStatus: "unverified";
}

const entry = (
  jurisdiction: string,
  abbreviation: string,
  length: number,
  characterType: DDCharacterType,
  logicType: DDLogicType,
  structure: string,
): DDFormat => ({ jurisdiction, abbreviation, length, characterType, logicType, structure, verificationStatus: "unverified" });

export const DD_FORMATS: Record<string, DDFormat> = {
  AL: entry("Alabama", "AL", 12, "numeric", "formula-based", "[2-Digit Year] + [3-Digit Julian Day] + [7-Digit Sequence]"),
  AK: entry("Alaska", "AK", 9, "alphanumeric", "randomized", "Randomized database token"),
  AZ: entry("Arizona", "AZ", 15, "alphanumeric", "randomized", "Cryptographically randomized unique record key"),
  AR: entry("Arkansas", "AR", 10, "numeric", "formula-based", "[Office ID] + [Julian Date] + [Terminal ID]"),
  CA: entry("California", "CA", 12, "alphanumeric", "formula-based", "DD + [Year] + [Julian Day] + [7-Digit Random Hash]"),
  CO: entry("Colorado", "CO", 13, "alphanumeric", "formula-based", "[Branch Code] + [Transaction Date] + [Counter]"),
  CT: entry("Connecticut", "CT", 14, "alphanumeric", "randomized", "Randomized database token"),
  DE: entry("Delaware", "DE", 11, "numeric", "formula-based", "[2-Digit Year] + [9-Digit Sequential Serial]"),
  DC: entry("District of Columbia", "DC", 12, "alphanumeric", "formula-based", "[Station ID] + [Date Stamp] + [Sequence]"),
  FL: entry("Florida", "FL", 15, "alphanumeric", "formula-based", "[Audit Year Code] + [Branch] + [Transaction Hash]"),
  GA: entry("Georgia", "GA", 12, "numeric", "randomized", "Randomized sequence token"),
  HI: entry("Hawaii", "HI", 10, "alphanumeric", "formula-based", "[County Prefix] + [9-Digit Transaction ID]"),
  ID: entry("Idaho", "ID", 13, "alphanumeric", "randomized", "Cryptographically randomized unique record key"),
  IL: entry("Illinois", "IL", 14, "numeric", "formula-based", "[Branch ID] + [Print Date MMDDYY] + [4-Digit Shift Counter]"),
  IN: entry("Indiana", "IN", 12, "numeric", "formula-based", "[Year] + [3-Digit Julian Day] + [7-Digit Batch Token]"),
  IA: entry("Iowa", "IA", 11, "alphanumeric", "randomized", "Randomized database token"),
  KS: entry("Kansas", "KS", 12, "alphanumeric", "randomized", "Randomized database token"),
  KY: entry("Kentucky", "KY", 13, "alphanumeric", "formula-based", "[Court Code] + [Issue Date MMDDYY] + [3-Digit Terminal]"),
  LA: entry("Louisiana", "LA", 11, "numeric", "formula-based", "[Shift Run ID] + [Julian Date] + [Machine ID]"),
  ME: entry("Maine", "ME", 10, "alphanumeric", "randomized", "Randomized tracking string"),
  MD: entry("Maryland", "MD", 15, "alphanumeric", "formula-based", "[Terminal Code] + [Exact Timestamp] + [Validation Index]"),
  MA: entry("Massachusetts", "MA", 12, "alphanumeric", "randomized", "Cryptographically randomized unique record key"),
  MI: entry("Michigan", "MI", 13, "alphanumeric", "formula-based", "[Station ID] + [Date YYMMDD] + [3-Digit Audit Count]"),
  MN: entry("Minnesota", "MN", 12, "alphanumeric", "formula-based", "[Production Run ID] + [Date Code] + [Serial Counter]"),
  MS: entry("Mississippi", "MS", 11, "numeric", "randomized", "Randomized unique numeric identifier"),
  MO: entry("Missouri", "MO", 14, "alphanumeric", "formula-based", "[Central Plant ID] + [Date Stamp] + [Batch Run Sequence]"),
  MT: entry("Montana", "MT", 12, "alphanumeric", "randomized", "Multi-layered database tracking version string"),
  NE: entry("Nebraska", "NE", 11, "numeric", "formula-based", "[Machine Hardware ID] + [Julian Date] + [Sequence]"),
  NV: entry("Nevada", "NV", 12, "alphanumeric", "formula-based", "[Field Station Code] + [Date MMDDYY] + [Shift Token]"),
  NH: entry("New Hampshire", "NH", 13, "alphanumeric", "randomized", "Randomized authentication node index"),
  NJ: entry("New Jersey", "NJ", 15, "alphanumeric", "formula-based", "[Agency ID] + [Issue Date YYMMDD] + [5-Digit Sequential]"),
  NM: entry("New Mexico", "NM", 11, "alphanumeric", "randomized", "Cryptographically randomized unique record key"),
  NY: entry("New York", "NY", 14, "alphanumeric", "formula-based", "[Factory Machine ID] + [Issue Date] + [Expiry Flags]"),
  NC: entry("North Carolina", "NC", 12, "numeric", "formula-based", "[Batch Output Job ID] + [Sequential Item Count]"),
  ND: entry("North Dakota", "ND", 10, "alphanumeric", "formula-based", "[Terminal ID] + [Shift Date] + [Counter]"),
  OH: entry("Ohio", "OH", 13, "alphanumeric", "formula-based", "[BMV Workstation ID] + [Print Date MMDDYY] + [Sequence]"),
  OK: entry("Oklahoma", "OK", 11, "alphanumeric", "formula-based", "[Database Location Node] + [Timestamp String]"),
  OR: entry("Oregon", "OR", 12, "alphanumeric", "formula-based", "[Grid Station Coordinates] + [Transaction Date]"),
  PA: entry("Pennsylvania", "PA", 12, "numeric", "formula-based", "[PennDOT Hub ID] + [Julian Calendar Day] + [Sequence]"),
  RI: entry("Rhode Island", "RI", 10, "numeric", "formula-based", "[Transaction Log Index] + [Year Code]"),
  SC: entry("South Carolina", "SC", 13, "alphanumeric", "randomized", "Randomized unique record key"),
  SD: entry("South Dakota", "SD", 11, "alphanumeric", "formula-based", "[Manufacturing System ID] + [Inlay Sheet Index]"),
  TN: entry("Tennessee", "TN", 16, "numeric", "formula-based", "[Station Terminal ID] + [Julian Date] + [Clock Counter]"),
  TX: entry("Texas", "TX", 20, "numeric", "formula-based", "[4-Digit DMV Branch Office] + [YYYYMMDD Date] + [8-Digit Counter]"),
  UT: entry("Utah", "UT", 12, "alphanumeric", "randomized", "Randomized identity-document verification stamp"),
  VT: entry("Vermont", "VT", 11, "numeric", "formula-based", "[Automated Track Run ID] + [Date YYMMDD]"),
  VA: entry("Virginia", "VA", 15, "alphanumeric", "formula-based", "[DMV Operational Hub] + [High-Precision Timestamp]"),
  WA: entry("Washington", "WA", 14, "alphanumeric", "formula-based", "[Licensing Office Code] + [Transaction Vector Map]"),
  WV: entry("West Virginia", "WV", 11, "alphanumeric", "randomized", "Randomized secure laminate film run identifier"),
  WI: entry("Wisconsin", "WI", 14, "alphanumeric", "formula-based", "[Queue Machine ID] + [Centralized Execution Day Hash]"),
  WY: entry("Wyoming", "WY", 10, "numeric", "randomized", "Randomized unique numeric identifier"),
};

export function getDDFormat(stateCode: string): DDFormat | undefined {
  return DD_FORMATS[stateCode];
}

export function sanitizeDD(value: string, format?: DDFormat): string {
  if (!format) return value;
  const normalized = format.characterType === "numeric"
    ? value.replace(/\D/g, "")
    : value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return normalized.slice(0, format.length);
}

export function isValidDD(value: string, format?: DDFormat): boolean {
  if (!format || value.length !== format.length) return false;
  return format.characterType === "numeric" ? /^\d+$/.test(value) : /^[A-Z0-9]+$/.test(value);
}
