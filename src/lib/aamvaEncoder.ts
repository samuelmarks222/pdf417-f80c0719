// AAMVA CDS (Card Design Standard) PDF417 Barcode Encoder
// Follows the AAMVA DL/ID Card Design Standard specification
// Compliant with REAL ID Act (6 CFR § 37.19)
// Reference: AAMVA 2020 DL/ID Card Design Standard

import { getStateConfig } from "./stateConfigs";

// Control characters per AAMVA spec (Section D.12)
const LF = "\n";           // Data Element Separator (0x0A)
const RS = "\x1e";          // Record Separator (0x1E)
const CR = "\r";            // Segment Terminator (0x0D)

function padZero(num: number, len: number = 2): string {
  return num.toString().padStart(len, "0");
}

// Generate random alphanumeric string (letters + digits only)
function generateAlphanumericString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function encodeAAMVA(
  data: {
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
  },
  iin: string,
  aamvaVersionStr: string,
  jurisdictionVersionStr: string,
): string {
  const jurVersion = jurisdictionVersionStr.padStart(2, "0");
  const versionStr = aamvaVersionStr.padStart(2, "0");

  // Height: total inches zero-padded to 3 digits + " in" per AAMVA CDS D.12
  const heightInches = parseInt(data.height) || 69;
  const heightStr = padZero(heightInches, 3) + " in";

  // Jurisdiction subfile type: "Z" + first letter of state name
  const stateConfig = getStateConfig(data.stateCode);
  const fullStateName = stateConfig ? stateConfig.name : data.stateCode;
  const jurSubfileType = "Z" + (fullStateName.charAt(0) || data.stateCode.charAt(0));

  // --- Build DL subfile data elements ---
  // Each element separated by LF (0x0A), last element terminated by CR (0x0D)
  const dlDataElements: string[] = [];

  // === MANDATORY AAMVA ELEMENTS (per Section D.12.3.1) ===

  // License number (DAQ) - mandatory
  dlDataElements.push(`DAQ${data.licenseNumber}`);

  // Customer name components
  dlDataElements.push(`DCS${data.lastName}`);
  dlDataElements.push(`DDEN`); // Family name truncation: N = not truncated

  if (data.firstMiddleName && !data.firstName) {
    // NY-style combined first & middle name
    dlDataElements.push(`DCT${data.firstMiddleName}`);
  } else {
    dlDataElements.push(`DAC${data.firstName}`);
    dlDataElements.push(`DDFN`); // First name truncation
    dlDataElements.push(`DAD${data.middleName || ""}`); // Always include for REAL ID
    dlDataElements.push(`DDGN`); // Middle name truncation
  }

  // Name suffix
  if (data.nameSuffix && data.nameSuffix !== "NONE") {
    dlDataElements.push(`DCU${data.nameSuffix}`);
  }

  // Document dates - mandatory (MMDDYYYY format per AAMVA spec)
  dlDataElements.push(`DBD${data.issueDate}`);      // Document Issue Date
  dlDataElements.push(`DBB${data.dateOfBirth}`);     // Date of Birth
  dlDataElements.push(`DBA${data.expirationDate}`);  // Document Expiration Date

  // Sex (DBC) - mandatory: 1=Male, 2=Female, 9=Not Specified
  dlDataElements.push(`DBC${data.gender}`);

  // Eye color (DAY)
  dlDataElements.push(`DAY${data.eyeColor}`);

  // Height (DAU) - "FFF in" format per AAMVA CDS
  dlDataElements.push(`DAU${heightStr}`);

  // Address - mandatory
  dlDataElements.push(`DAG${data.streetAddress}`);
  dlDataElements.push(`DAI${data.city}`);
  dlDataElements.push(`DAJ${data.stateCode}`);
  dlDataElements.push(`DAK${data.postalCode}`);

  // Document discriminator (DCF) - alphanumeric only
  const cleanDCF = (data.documentDiscriminator || "").replace(/[^A-Z0-9]/gi, "").substring(0, 25) || generateAlphanumericString(10);
  dlDataElements.push(`DCF${cleanDCF}`);

  // Country (DCG) - mandatory
  dlDataElements.push(`DCGUSA`);

  // === REAL ID MANDATORY FIELDS (6 CFR § 37.19) ===

  // DDA - Compliance Type: F = Fully Compliant
  dlDataElements.push(`DDAF`);

  // DDB - Card Revision Date (MMDDYYYY)
  const revisionDateForDDB = data.revisionDate || "01012020";
  dlDataElements.push(`DDB${revisionDateForDDB}`);

  // DDK - Inventory Control Number (alphanumeric, unique per card)
  const cleanDDK = (data.inventoryControlNumber || "").replace(/[^A-Z0-9]/gi, "").substring(0, 25) || generateAlphanumericString(11);
  dlDataElements.push(`DDK${cleanDDK}`);

  // === OPTIONAL STANDARD FIELDS ===

  // Weight (DAW) - 3-digit zero-padded (pounds)
  if (data.weight) {
    dlDataElements.push(`DAW${data.weight.padStart(3, "0")}`);
  }

  // Hair color (DAZ) if provided
  if (data.hairColor) {
    dlDataElements.push(`DAZ${data.hairColor}`);
  }

  // DL Class (DCA)
  if (data.dlClass) {
    dlDataElements.push(`DCA${data.dlClass}`);
  }

  // Restrictions (DCB) - include actual value or NONE
  dlDataElements.push(`DCB${data.restrictions && data.restrictions !== "NONE" ? data.restrictions : "NONE"}`);

  // Endorsements (DCD) - include actual value or NONE
  dlDataElements.push(`DCD${data.endorsement && data.endorsement !== "NONE" ? data.endorsement : "NONE"}`);

  // Build DL subfile: "DL" + elements separated by LF, last terminated by CR
  const dlSubfile = "DL" + dlDataElements.join(LF) + CR;

  // --- Build jurisdiction subfile ---
  const jurElements = [`ZCA${data.stateCode}`, `ZCB`];
  const jurSubfile = jurSubfileType + jurElements.join(LF) + CR;

  // --- Build header with dynamic offsets ---
  // Header structure per AAMVA CDS D.12.1:
  // @ (1) + LF (1) + RS (1) + CR (1) + "ANSI " (5) + IIN (6) + version (2) + jurVersion (2) + numEntries (2) = 21
  // Per entry descriptor: type (2) + offset (4) + length (4) = 10
  const numEntries = 2;
  const headerFixedLen = 21;
  const entryDescriptorLen = 10 * numEntries;
  const headerLen = headerFixedLen + entryDescriptorLen;

  const dlOffset = headerLen;
  const dlLength = dlSubfile.length;
  const zaOffset = dlOffset + dlLength;
  const zaLength = jurSubfile.length;

  let header = "";
  header += "@";            // Compliance Indicator
  header += LF;             // Data Element Separator
  header += RS;             // Record Separator
  header += CR;             // Segment Terminator
  header += "ANSI ";        // File Type (5 chars including space)
  header += iin;            // Issuer Identification Number (6 digits)
  header += versionStr;     // AAMVA Version Number (2 digits)
  header += jurVersion;     // Jurisdiction Version Number (2 digits)
  header += padZero(numEntries, 2); // Number of Entries (2 digits)

  // Entry descriptors
  header += "DL" + padZero(dlOffset, 4) + padZero(dlLength, 4);
  header += jurSubfileType + padZero(zaOffset, 4) + padZero(zaLength, 4);

  return header + dlSubfile + jurSubfile;
}
