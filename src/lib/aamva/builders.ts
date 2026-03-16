import { AAMVA_CONTROL, AAMVA_REAL_ID_COMPLIANCE, FALLBACKS } from "./constants";
import {
  ensureDateMMDDYYYY,
  formatHeightInches,
  formatWeight,
  normalizeAlphanumeric,
  normalizePostalCode,
  normalizeStateCode,
  padZero,
  sanitizeUpper,
} from "./formatters";

export interface AamvaEncodeInput {
  stateCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  firstMiddleName: string;
  nameSuffix: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  eyeColor: string;
  hairColor: string;
  height: string;
  weight: string;
  race: string;
  licenseNumber: string;
  dlClass: string;
  issueDate: string;
  expirationDate: string;
  documentDiscriminator: string;
  inventoryControlNumber: string;
  restrictions: string;
  endorsement: string;
  donor: string;
  revisionDate?: string;
}

interface BuildDlSubfileArgs {
  data: AamvaEncodeInput;
  fullStateName: string;
}

export function buildDlSubfile({ data, fullStateName }: BuildDlSubfileArgs): string {
  const stateCode = normalizeStateCode(data.stateCode);
  const [combinedFirstNameRaw = "", combinedMiddleNameRaw = ""] = sanitizeUpper(data.firstMiddleName || "", 81)
    .split(",")
    .map((part) => part.trim());

  const sourceLastName = sanitizeUpper(data.lastName || FALLBACKS.LAST_NAME, 128);
  const sourceFirstName = sanitizeUpper(
    combinedFirstNameRaw || data.firstName || FALLBACKS.FIRST_NAME,
    128,
  );
  const sourceMiddleName = sanitizeUpper(combinedMiddleNameRaw || data.middleName || "", 128);

  const lastName = sourceLastName.substring(0, 40);
  const firstName = sourceFirstName.substring(0, 40);
  const middleName = sourceMiddleName.substring(0, 40);

  const issueDate = ensureDateMMDDYYYY(data.issueDate, FALLBACKS.ISSUE);
  const dob = ensureDateMMDDYYYY(data.dateOfBirth, FALLBACKS.DOB);
  const expiryDate = ensureDateMMDDYYYY(data.expirationDate, FALLBACKS.EXPIRY);
  const revisionDate = ensureDateMMDDYYYY(data.revisionDate || "", FALLBACKS.REVISION);

  const licenseNumber = sanitizeUpper(data.licenseNumber || FALLBACKS.LICENSE_NUMBER, 25);
  const documentDiscriminator = normalizeAlphanumeric(data.documentDiscriminator, 8, 25, 10);
  const inventoryControlNumber = normalizeAlphanumeric(data.inventoryControlNumber, 10, 25, 11);

  const dlClass = sanitizeUpper(data.dlClass || "", 8);
  const restrictions = sanitizeUpper(data.restrictions || "NONE", 40);
  const endorsement = sanitizeUpper(data.endorsement || "NONE", 40);
  const donor = data.donor === "Y" ? "1" : "0";

  const elements: string[] = [];

  // Mandatory identifiers
  elements.push(`DAQ${licenseNumber}`);
  elements.push(`DCS${lastName}`);
  elements.push(`DDE${sourceLastName.length > 40 ? "T" : "N"}`);

  // Name structure - prefer combined first/middle input when present for scanner consistency
  elements.push(`DAC${firstName}`);
  elements.push(`DDF${sourceFirstName.length > 40 ? "T" : "N"}`);
  elements.push(`DAD${middleName}`);
  elements.push(`DDG${sourceMiddleName.length > 40 ? "T" : "N"}`);

  if (data.nameSuffix && data.nameSuffix !== "NONE") {
    elements.push(`DCU${sanitizeUpper(data.nameSuffix, 10)}`);
  }

  // Dates
  elements.push(`DBD${issueDate}`);
  elements.push(`DBB${dob}`);
  elements.push(`DBA${expiryDate}`);

  // Physical profile
  elements.push(`DBC${data.gender || "9"}`);
  elements.push(`DAY${sanitizeUpper(data.eyeColor || "UNK", 3)}`);
  elements.push(`DAU${formatHeightInches(data.height)}`);

  const weight = formatWeight(data.weight || FALLBACKS.WEIGHT_LBS);
  if (weight) {
    elements.push(`DAW${weight}`);
  }

  if (data.hairColor) {
    elements.push(`DAZ${sanitizeUpper(data.hairColor, 3)}`);
  }

  // Address
  elements.push(`DAG${sanitizeUpper(data.streetAddress || FALLBACKS.STREET, 80)}`);
  elements.push(`DAI${sanitizeUpper(data.city || FALLBACKS.CITY, 40)}`);
  elements.push(`DAJ${stateCode}`);
  elements.push(`DAK${normalizePostalCode(data.postalCode)}`);

  // Standard/REAL ID
  elements.push(`DCF${documentDiscriminator}`);
  elements.push("DCGUSA");
  elements.push(`DDA${AAMVA_REAL_ID_COMPLIANCE}`);
  elements.push(`DDB${revisionDate}`);
  elements.push(`DCI${sanitizeUpper(fullStateName, 40)}`);
  elements.push(`DDK${inventoryControlNumber}`);

  if (dlClass) {
    elements.push(`DCA${dlClass}`);
  }

  elements.push(`DCB${restrictions !== "" ? restrictions : "NONE"}`);
  elements.push(`DCD${endorsement !== "" ? endorsement : "NONE"}`);
  elements.push(`DDL${donor}`);

  return `DL${elements.join(AAMVA_CONTROL.LF)}${AAMVA_CONTROL.CR}`;
}


interface BuildHeaderArgs {
  iin: string;
  aamvaVersion: string;
  jurisdictionVersion: string;
  dlSubfileLength: number;
}

export function buildHeader({
  iin,
  aamvaVersion,
  jurisdictionVersion,
  dlSubfileLength,
}: BuildHeaderArgs): string {
  const version = aamvaVersion.padStart(2, "0");
  const jurVersion = jurisdictionVersion.padStart(2, "0");
  const numEntries = 1;

  const fixedHeader =
    "@" +
    AAMVA_CONTROL.LF +
    AAMVA_CONTROL.RS +
    AAMVA_CONTROL.CR +
    "ANSI " +
    iin +
    version +
    jurVersion +
    padZero(numEntries, 2);

  const entryDescriptorLength = 10 * numEntries;
  const headerLength = fixedHeader.length + entryDescriptorLength;
  const dlOffset = headerLength;

  return fixedHeader + "DL" + padZero(dlOffset, 4) + padZero(dlSubfileLength, 4);
}
