// AAMVA CDS (Card Design Standard) PDF417 Barcode Encoder
// Follows the AAMVA DL/ID Card Design Standard specification

// Control characters per AAMVA spec
const COMPLIANCE_INDICATOR = "@";
const DATA_ELEMENT_SEPARATOR = "\n";  // LF (0x0A)
const RECORD_SEPARATOR = "\x1e";      // RS (0x1E)
const SEGMENT_TERMINATOR = "\r";      // CR (0x0D)
const FILE_TYPE = "ANSI ";

interface AAMVAField {
  id: string;
  value: string;
}

function padZero(num: number, len: number = 2): string {
  return num.toString().padStart(len, "0");
}

// Convert MMDDYYYY to MMDDYYYY for AAMVA (already correct format for most versions)
function formatDateMMDDYYYY(mmddyyyy: string): string {
  if (mmddyyyy.length !== 8) return mmddyyyy;
  return mmddyyyy;
}

// Build the subfile data elements for the DL subfile
function buildDLSubfile(data: {
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
}, aamvaVersion: number): string {
  const fields: AAMVAField[] = [];
  const heightInches = parseInt(data.height) || 69;
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;
  
  // AAMVA spec: DAU is total inches zero-padded to 3 digits + " in"
  const heightStr = padZero(heightInches, 3) + " in";

  // Mandatory elements (order matters for scannability)
  fields.push({ id: "DCS", value: data.lastName });
  
  // Handle name fields
  if (data.firstMiddleName && !data.firstName) {
    // NY-style combined
    fields.push({ id: "DCT", value: data.firstMiddleName });
  } else {
    fields.push({ id: "DAC", value: data.firstName });
    if (data.middleName) {
      fields.push({ id: "DAD", value: data.middleName });
    }
  }
  
  // Name truncation indicators
  fields.push({ id: "DDE", value: "N" }); // Family name truncation
  fields.push({ id: "DDF", value: "N" }); // First name truncation
  fields.push({ id: "DDG", value: "N" }); // Middle name truncation

  // Name suffix
  if (data.nameSuffix && data.nameSuffix !== "NONE") {
    fields.push({ id: "DCU", value: data.nameSuffix });
  }

  // Document dates (MMDDYYYY format)
  fields.push({ id: "DBD", value: formatDateMMDDYYYY(data.issueDate) });
  fields.push({ id: "DBB", value: formatDateMMDDYYYY(data.dateOfBirth) });
  fields.push({ id: "DBA", value: formatDateMMDDYYYY(data.expirationDate) });
  
  // License number
  fields.push({ id: "DAQ", value: data.licenseNumber });
  
  // Sex
  fields.push({ id: "DBC", value: data.gender });
  
  // Eye color
  fields.push({ id: "DAY", value: data.eyeColor });
  
  // Height
  fields.push({ id: "DAU", value: heightStr });

  // Address
  fields.push({ id: "DAG", value: data.streetAddress });
  fields.push({ id: "DAI", value: data.city });
  fields.push({ id: "DAJ", value: data.stateCode });
  fields.push({ id: "DAK", value: data.postalCode });

  // Country
  fields.push({ id: "DCG", value: "USA" });

  // Document discriminator
  if (data.documentDiscriminator) {
    fields.push({ id: "DCF", value: data.documentDiscriminator });
  }
  
  // DL Class
  if (data.dlClass) {
    fields.push({ id: "DCA", value: data.dlClass });
  }
  
  // Restrictions
  if (data.restrictions && data.restrictions !== "NONE") {
    fields.push({ id: "DCB", value: data.restrictions });
  } else {
    fields.push({ id: "DCB", value: "NONE" });
  }
  
  // Endorsements
  if (data.endorsement && data.endorsement !== "NONE") {
    fields.push({ id: "DCD", value: data.endorsement });
  } else {
    fields.push({ id: "DCD", value: "NONE" });
  }

  // Hair color
  if (data.hairColor) {
    fields.push({ id: "DAZ", value: data.hairColor });
  }

  // Weight
  if (data.weight) {
    fields.push({ id: "DAW", value: data.weight.padStart(3, "0") });
  }

  // Race
  if (data.race) {
    fields.push({ id: "DCL", value: data.race });
  }

  // Inventory Control Number
  if (data.inventoryControlNumber) {
    fields.push({ id: "DCK", value: data.inventoryControlNumber });
  }

  // Donor
  if (data.donor) {
    fields.push({ id: "DDK", value: data.donor === "Y" ? "1" : "0" });
  }

  // Build subfile content: each field is "ID" + value + LF
  let content = "";
  for (const field of fields) {
    content += field.id + field.value + DATA_ELEMENT_SEPARATOR;
  }
  
  return content;
}

// Build jurisdiction-specific (ZA/ZC etc.) subfile
function buildJurisdictionSubfile(stateCode: string): string {
  // Minimal jurisdiction data
  return `ZCA` + DATA_ELEMENT_SEPARATOR + `ZCB` + DATA_ELEMENT_SEPARATOR;
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
  },
  iin: string,
  aamvaVersionStr: string,
  jurisdictionVersionStr: string,
): string {
  const aamvaVersion = parseInt(aamvaVersionStr) || 9;
  const jurVersion = jurisdictionVersionStr.padStart(2, "0");
  const versionStr = aamvaVersionStr.padStart(2, "0");

  // Build subfile contents
  const dlContent = "DL" + buildDLSubfile(data, aamvaVersion);
  const zaContent = "ZC" + buildJurisdictionSubfile(data.stateCode);

  // Number of subfile entries
  const numEntries = 2;

  // Calculate the fixed header portion length:
  // "@\n\x1e\rANSI " = 9 chars
  // IIN (6) + version (2) + jurVersion (2) + numEntries (2) = 12 chars  
  // Per entry: type(2) + offset(4) + length(4) = 10 chars
  const headerFixedPart = COMPLIANCE_INDICATOR 
    + DATA_ELEMENT_SEPARATOR 
    + RECORD_SEPARATOR 
    + SEGMENT_TERMINATOR 
    + FILE_TYPE 
    + iin 
    + versionStr 
    + jurVersion 
    + padZero(numEntries, 2);

  // Each entry descriptor is 10 chars (type 2 + offset 4 + length 4)
  const entryDescriptorLen = 10 * numEntries;
  const headerLen = headerFixedPart.length + entryDescriptorLen + 1; // +1 for trailing LF after header

  // Calculate offsets
  const dlOffset = headerLen;
  const dlLength = dlContent.length;
  const zaOffset = dlOffset + dlLength;
  const zaLength = zaContent.length;

  // Build complete header
  let header = headerFixedPart;
  header += "DL" + padZero(dlOffset, 4) + padZero(dlLength, 4);
  header += "ZC" + padZero(zaOffset, 4) + padZero(zaLength, 4);
  header += DATA_ELEMENT_SEPARATOR;

  // Combine everything
  return header + dlContent + zaContent;
}
