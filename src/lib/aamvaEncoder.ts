// AAMVA CDS (Card Design Standard) PDF417 Barcode Encoder
// Follows the AAMVA DL/ID Card Design Standard specification
// Compliant with REAL ID Act (6 CFR § 37.19)

import { getStateConfig } from "./stateConfigs";

// Control characters per AAMVA spec
const DATA_ELEMENT_SEPARATOR = "\n";  // LF (0x0A)
const RECORD_SEPARATOR = "\x1e";      // RS (0x1E)
const SEGMENT_TERMINATOR = "\r";      // CR (0x0D)

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

  // Height: total inches zero-padded to 3 digits (NO units per spec)
  const heightInches = parseInt(data.height) || 69;
  const heightStr = padZero(heightInches, 3);

  // Jurisdiction subfile type: "Z" + first letter of state name
  const stateConfig = getStateConfig(data.stateCode);
  const fullStateName = stateConfig ? stateConfig.name : data.stateCode;
  const jurSubfileType = "Z" + (fullStateName.charAt(0) || data.stateCode.charAt(0));

  // --- Build DL subfile elements ---
  let dlElements = "";

  // === MANDATORY AAMVA ELEMENTS ===

  // License number (DAQ) - mandatory
  dlElements += `DAQ${data.licenseNumber}\n`;

  // Last name (DCS) - mandatory
  dlElements += `DCS${data.lastName}\n`;

  // Name truncation indicators
  dlElements += `DDEN\n`; // Family name truncation
  
  // Name fields
  if (data.firstMiddleName && !data.firstName) {
    // NY-style combined first & middle name
    dlElements += `DCT${data.firstMiddleName}\n`;
  } else {
    // First name (DAC) - mandatory
    dlElements += `DAC${data.firstName}\n`;
    dlElements += `DDFN\n`; // First name truncation
    // Middle name (DAD) - always include even if empty for REAL ID
    dlElements += `DAD${data.middleName || ""}\n`;
    dlElements += `DDGN\n`; // Middle name truncation
  }

  // Name suffix
  if (data.nameSuffix && data.nameSuffix !== "NONE") {
    dlElements += `DCU${data.nameSuffix}\n`;
  }

  // Document dates - mandatory (MMDDYYYY format)
  dlElements += `DBD${data.issueDate}\n`;      // Issue date
  dlElements += `DBB${data.dateOfBirth}\n`;     // Date of birth
  dlElements += `DBA${data.expirationDate}\n`;  // Expiration date

  // Sex (DBC) - mandatory: 1=Male, 2=Female, 9=Not Specified
  dlElements += `DBC${data.gender}\n`;

  // Eye color (DAY)
  dlElements += `DAY${data.eyeColor}\n`;

  // Height (DAU) - 3-digit inches, NO units
  dlElements += `DAU${heightStr}\n`;

  // Address - mandatory
  dlElements += `DAG${data.streetAddress}\n`;
  dlElements += `DAI${data.city}\n`;
  dlElements += `DAJ${data.stateCode}\n`;
  dlElements += `DAK${data.postalCode}\n`;

  // Document discriminator (DCF) - alphanumeric only, 8-12 chars
  const cleanDCF = (data.documentDiscriminator || "").replace(/[^A-Z0-9]/gi, "").substring(0, 12) || generateAlphanumericString(10);
  dlElements += `DCF${cleanDCF}\n`;

  // Country (DCG) - mandatory
  dlElements += `DCGUSA\n`;

  // === REAL ID MANDATORY FIELDS ===

  // DDA - Compliance Type: F = Fully Compliant (CRITICAL for REAL ID)
  dlElements += `DDAF\n`;

  // DDB - Card Revision Date (MMDDYYYY)
  const revisionDateForDDB = data.revisionDate || "01012020";
  dlElements += `DDB${revisionDateForDDB}\n`;

  // DDC - Hazmat Endorsement Expiration (include empty if none)
  dlElements += `DDC\n`;

  // DCI - Full Jurisdiction Name (mandatory, no abbreviations)
  dlElements += `DCI${fullStateName}\n`;

  // DDK - Inventory Control Number (alphanumeric 10-12 chars, unique per card)
  const cleanDDK = (data.inventoryControlNumber || "").replace(/[^A-Z0-9]/gi, "").substring(0, 12) || generateAlphanumericString(11);
  dlElements += `DDK${cleanDDK}\n`;

  // === OPTIONAL STANDARD FIELDS ===

  // Weight (DAW) - 3-digit zero-padded
  if (data.weight) {
    dlElements += `DAW${data.weight.padStart(3, "0")}\n`;
  }

  // DL Class (DCA)
  if (data.dlClass) {
    dlElements += `DCA${data.dlClass}\n`;
  }

  // Restrictions (DCB) - always include, default NONE
  dlElements += `DCB${data.restrictions && data.restrictions !== "NONE" ? data.restrictions : "NONE"}\n`;

  // Endorsements (DCD) - always include, default NONE
  dlElements += `DCD${data.endorsement && data.endorsement !== "NONE" ? data.endorsement : "NONE"}\n`;

  // Full DL subfile = "DL" prefix + elements
  const dlSubfile = "DL" + dlElements;

  // --- Build jurisdiction subfile ---
  const jurElements = `ZCA${data.stateCode}\nZCB\n`;
  const jurSubfile = jurSubfileType + jurElements;

  // --- Build header with dynamic offsets ---
  const numEntries = 2;

  // Fixed header: @ + LF + RS + CR + "ANSI " + IIN(6) + version(2) + jurVersion(2) + numEntries(2)
  const headerFixedPart = "@"
    + DATA_ELEMENT_SEPARATOR
    + RECORD_SEPARATOR
    + SEGMENT_TERMINATOR
    + "ANSI "
    + iin
    + versionStr
    + jurVersion
    + padZero(numEntries, 2);

  // Each entry descriptor: type(2) + offset(4) + length(4) = 10 chars
  const entryDescriptorLen = 10 * numEntries;
  const headerLen = headerFixedPart.length + entryDescriptorLen + 1; // +1 for trailing LF

  const dlOffset = headerLen;
  const dlLength = dlSubfile.length;
  const zaOffset = dlOffset + dlLength;
  const zaLength = jurSubfile.length;

  let header = headerFixedPart;
  header += "DL" + padZero(dlOffset, 4) + padZero(dlLength, 4);
  header += jurSubfileType + padZero(zaOffset, 4) + padZero(zaLength, 4);
  header += DATA_ELEMENT_SEPARATOR;

  return header + dlSubfile + jurSubfile;
}
