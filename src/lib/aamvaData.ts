// AAMVA Driver License/ID Data Structure
import { generateDD, generateICN } from "./documentGenerators";
import { getStateConfig } from "./stateConfigs";

export const EYE_COLORS = [
  { code: "BLK", name: "Black" },
  { code: "BLU", name: "Blue" },
  { code: "BRO", name: "Brown" },
  { code: "GRY", name: "Gray" },
  { code: "GRN", name: "Green" },
  { code: "HAZ", name: "Hazel" },
  { code: "MAR", name: "Maroon" },
  { code: "PNK", name: "Pink" },
  { code: "DIC", name: "Dichromatic" },
  { code: "UNK", name: "Unknown" },
] as const;

export const EYE_COLORS_ON_DL = [
  { code: "BLK", name: "Black" },
  { code: "BLU", name: "Blue" },
  { code: "BRN", name: "Brown" },
  { code: "GRN", name: "Green" },
  { code: "GRY", name: "Gray" },
  { code: "HAZ", name: "Hazel" },
  { code: "MAR", name: "Maroon" },
  { code: "MUL", name: "Multicolored" },
  { code: "PNK", name: "Pink" },
  { code: "UNK", name: "Unknown" },
] as const;

export const HAIR_COLORS = [
  { code: "BAL", name: "Bald" },
  { code: "BLK", name: "Black" },
  { code: "BLN", name: "Blond" },
  { code: "BRO", name: "Brown" },
  { code: "GRY", name: "Gray" },
  { code: "RED", name: "Red/Auburn" },
  { code: "SDY", name: "Sandy" },
  { code: "WHI", name: "White" },
  { code: "UNK", name: "Unknown" },
] as const;

export const HAIR_COLORS_ON_DL = [
  { code: "BLK", name: "Black" },
  { code: "BLN", name: "Blond" },
  { code: "BRN", name: "Brown" },
  { code: "DBR", name: "Dark Brown" },
  { code: "GRY", name: "Gray" },
  { code: "LBR", name: "Light Brown" },
  { code: "RED", name: "Red/Auburn" },
  { code: "SDY", name: "Sandy" },
  { code: "WHI", name: "White" },
  { code: "UNK", name: "Unknown/Bald" },
] as const;

export const GENDER_OPTIONS = [
  { code: "1", name: "Male", short: "M" },
  { code: "2", name: "Female", short: "F" },
] as const;

export const RACE_OPTIONS = [
  { code: "AI", name: "Alaskan or American Indian" },
  { code: "AP", name: "Asian or Pacific Islander" },
  { code: "BK", name: "Black" },
  { code: "H", name: "Hispanic Origin" },
  { code: "O", name: "Non-hispanic" },
  { code: "U", name: "Unknown" },
  { code: "W", name: "White" },
] as const;

export const NAME_SUFFIXES = [
  { code: "NONE", name: "NONE" },
  { code: "JR", name: "JR (Junior)" },
  { code: "SR", name: "SR (Senior)" },
  { code: "I", name: "1ST or I (First)" },
  { code: "II", name: "2ND or II (Second)" },
  { code: "III", name: "3RD or III (Third)" },
  { code: "IV", name: "4TH or IV (Fourth)" },
  { code: "V", name: "5TH or V (Fifth)" },
  { code: "VI", name: "6TH or VI (Sixth)" },
] as const;

export const DL_CLASSES = [
  { code: "A", name: "Class A" },
  { code: "B", name: "Class B" },
  { code: "C", name: "Class C" },
  { code: "D", name: "Class D" },
  { code: "M", name: "Class M (Motorcycle)" },
] as const;

export interface AAMVAData {
  // State/Revision info
  stateCode: string;
  revisionId: string;
  
  // Personal info
  firstName: string;
  middleName: string;
  lastName: string;
  firstMiddleName: string; // For NY-style combined field
  nameSuffix: string;
  
  // Address
  streetAddress: string;
  city: string;
  postalCode: string;
  
  // Physical description
  dateOfBirth: string;
  gender: string;
  eyeColor: string;
  eyeColorOnDL: string;
  hairColor: string;
  hairColorOnDL: string;
  height: string;
  weight: string;
  race: string;
  
  // Document info
  licenseNumber: string;
  dlClass: string;
  issueDate: string;
  expirationDate: string;
  documentDiscriminator: string;
  inventoryControlNumber: string;
  restrictions: string;
  endorsement: string;
  
  // Additional
  donor: string;
  safeDriver: string;
  revisionDate: string;
}

export const DEFAULT_AAMVA_DATA: AAMVAData = {
  stateCode: "CA",
  revisionId: "CA_2017",
  
  firstName: "JOHN",
  middleName: "MICHAEL",
  lastName: "DOE",
  firstMiddleName: "JOHN,MICHAEL",
  nameSuffix: "",
  
  streetAddress: "123 MAIN ST",
  city: "LOS ANGELES",
  postalCode: "900010000",
  
  dateOfBirth: "01151970",
  gender: "1",
  eyeColor: "BRO",
  eyeColorOnDL: "BRN",
  hairColor: "BRO",
  hairColorOnDL: "BRN",
  height: "69",
  weight: "169",
  race: "",
  
  licenseNumber: "D1234567",
  dlClass: "C",
  issueDate: "08262021",
  expirationDate: "01152026",
  documentDiscriminator: "08/25/202165508/AAFD/26",
  inventoryControlNumber: "21237D12345670401",
  restrictions: "NONE",
  endorsement: "NONE",
  
  donor: "N",
  safeDriver: "Y",
  revisionDate: "",
};

// Generate random data for testing
export function generateRandomData(stateCode: string): Partial<AAMVAData> {
  const firstNames = ["JAMES", "JOHN", "ROBERT", "MICHAEL", "WILLIAM", "DAVID", "RICHARD", "JOSEPH", "MARY", "PATRICIA", "JENNIFER", "LINDA", "ELIZABETH", "BARBARA", "SUSAN", "JESSICA"];
  const middleNames = ["ALLEN", "BRIAN", "CHARLES", "DANIEL", "EDWARD", "FRANK", "GEORGE", "HENRY", "ANN", "BETH", "CLAIRE", "DIANE", "EVE", "GRACE", "HELEN", "IRIS"];
  const lastNames = ["SMITH", "JOHNSON", "WILLIAMS", "BROWN", "JONES", "GARCIA", "MILLER", "DAVIS", "RODRIGUEZ", "MARTINEZ", "HERNANDEZ", "LOPEZ", "GONZALEZ", "WILSON", "ANDERSON", "THOMAS"];
  const streets = ["MAIN ST", "OAK AVE", "MAPLE DR", "PARK BLVD", "CEDAR LN", "ELM ST", "PINE RD", "WASHINGTON AVE", "LINCOLN BLVD", "SUNSET DR"];
  
  const citiesByState: Record<string, string[]> = {
    CA: ["LOS ANGELES", "SAN DIEGO", "SAN JOSE", "SAN FRANCISCO", "FRESNO", "SACRAMENTO"],
    TX: ["HOUSTON", "SAN ANTONIO", "DALLAS", "AUSTIN", "FORT WORTH", "EL PASO"],
    FL: ["JACKSONVILLE", "MIAMI", "TAMPA", "ORLANDO", "ST PETERSBURG", "HIALEAH"],
    NY: ["NEW YORK", "BUFFALO", "ROCHESTER", "YONKERS", "SYRACUSE", "ALBANY"],
    default: ["SPRINGFIELD", "RIVERSIDE", "FRANKLIN", "CLINTON", "MADISON", "GEORGETOWN"],
  };
  
  const randomChoice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const padZero = (num: number, len: number) => num.toString().padStart(len, "0");
  
  const birthYear = randomNum(1950, 2000);
  const birthMonth = padZero(randomNum(1, 12), 2);
  const birthDay = padZero(randomNum(1, 28), 2);
  
  const issueYear = randomNum(2020, 2024);
  const issueMonth = padZero(randomNum(1, 12), 2);
  const issueDay = padZero(randomNum(1, 28), 2);
  
  const expYear = issueYear + randomNum(4, 8);
  
  const firstName = randomChoice(firstNames);
  const middleName = randomChoice(middleNames);
  const cities = citiesByState[stateCode] || citiesByState.default;
  
  // State-specific license number formats
  const generateLicenseNumber = (state: string): string => {
    switch (state) {
      case "CA":
        return `D${randomNum(1000000, 9999999)}`;
      case "TX":
        return `${randomNum(10000000, 99999999)}`;
      case "FL":
        return `H${randomNum(100000000000, 999999999999)}`;
      case "NY":
        return `${randomNum(100000000, 999999999)}`;
      default:
        return `${randomNum(10000000, 99999999)}`;
    }
  };

  return {
    firstName,
    middleName,
    lastName: randomChoice(lastNames),
    firstMiddleName: `${firstName},${middleName}`,
    streetAddress: `${randomNum(100, 9999)} ${randomChoice(streets)}`,
    city: randomChoice(cities),
    postalCode: `${randomNum(10000, 99999)}${randomNum(1000, 9999)}`,
    dateOfBirth: `${birthMonth}${birthDay}${birthYear}`,
    gender: randomChoice(GENDER_OPTIONS).code,
    eyeColor: randomChoice(EYE_COLORS).code,
    eyeColorOnDL: randomChoice(EYE_COLORS_ON_DL).code,
    hairColor: randomChoice(HAIR_COLORS).code,
    hairColorOnDL: randomChoice(HAIR_COLORS_ON_DL).code,
    height: randomNum(60, 78).toString(),
    weight: randomNum(120, 250).toString(),
    licenseNumber: generateLicenseNumber(stateCode),
    issueDate: `${issueMonth}${issueDay}${issueYear}`,
    expirationDate: `${issueMonth}${issueDay}${expYear}`,
    documentDiscriminator: generateDD(stateCode, `${issueMonth}${issueDay}${issueYear}`),
    inventoryControlNumber: generateICN(stateCode, generateLicenseNumber(stateCode), `${issueMonth}${issueDay}${issueYear}`),
  };
}

export function generateDocumentDiscriminator(stateCode: string): string {
  const now = new Date();
  const dateStr = `${padZero(now.getMonth() + 1)}/${padZero(now.getDate())}/${now.getFullYear()}`;
  const randomPart = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
  const suffix = Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  return `${dateStr}${randomPart}/${suffix}/${randomNum(10, 99)}`;
}

export function generateInventoryControlNumber(): string {
  const prefix = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const suffix = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join("");
  return `${prefix}${letter}${suffix}`;
}

function padZero(num: number, len: number = 2): string {
  return num.toString().padStart(len, "0");
}

function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Convert MMDDYYYY to YYYYMMDD for AAMVA format
function formatDateToAAMVA(mmddyyyy: string): string {
  if (mmddyyyy.length !== 8) return mmddyyyy;
  const month = mmddyyyy.substring(0, 2);
  const day = mmddyyyy.substring(2, 4);
  const year = mmddyyyy.substring(4, 8);
  return `${year}${month}${day}`;
}

// Encode data to AAMVA PDF417 format
export function encodeAAMVA(data: AAMVAData, iin: string, aamvaVersion: string, jurisdictionVersion: string): string {
  const version = aamvaVersion.padStart(2, "0");
  const jurVersion = jurisdictionVersion.padStart(2, "0");
  
  // Height: total inches zero-padded to 3 digits + " in"
  const heightInches = parseInt(data.height) || 69;
  const heightStr = padZero(heightInches, 3) + " in";

  // Jurisdiction subfile type: "Z" + first letter of state name
  const stateConfig = getStateConfig(data.stateCode);
  const fullStateName = stateConfig ? stateConfig.name : data.stateCode;
  const jurSubfileType = "Z" + (fullStateName.charAt(0) || data.stateCode.charAt(0));

  // --- Build DL subfile content (without "DL" prefix) ---
  let dlElements = "";

  // Mandatory AAMVA elements
  dlElements += `DAQ${data.licenseNumber}\n`;
  dlElements += `DCS${data.lastName}\n`;
  dlElements += `DDEN\n`; // Family name truncation

  // Name fields
  if (data.firstMiddleName && !data.firstName) {
    // NY-style combined first & middle name
    dlElements += `DCT${data.firstMiddleName}\n`;
  } else {
    dlElements += `DAC${data.firstName}\n`;
    dlElements += `DDFN\n`; // First name truncation
    dlElements += `DAD${data.middleName || ""}\n`; // Always include for REAL ID
    dlElements += `DDGN\n`; // Middle name truncation
  }

  // Name suffix
  if (data.nameSuffix && data.nameSuffix !== "NONE") {
    dlElements += `DCU${data.nameSuffix}\n`;
  }

  // Document dates (MMDDYYYY)
  dlElements += `DBD${data.issueDate}\n`;
  dlElements += `DBB${data.dateOfBirth}\n`;
  dlElements += `DBA${data.expirationDate}\n`;

  // Sex (1=Male, 2=Female, 9=Not Specified)
  dlElements += `DBC${data.gender}\n`;

  // Physical description
  dlElements += `DAY${data.eyeColor}\n`;
  dlElements += `DAU${heightStr}\n`;

  // Address
  dlElements += `DAG${data.streetAddress}\n`;
  dlElements += `DAI${data.city}\n`;
  dlElements += `DAJ${data.stateCode}\n`;
  dlElements += `DAK${data.postalCode}\n`;

  // Document discriminator
  if (data.documentDiscriminator) {
    dlElements += `DCF${data.documentDiscriminator}\n`;
  }

  // Country
  dlElements += `DCGUSA\n`;

  // REAL ID Mandatory: DDA - Compliance Type (F = Fully Compliant)
  dlElements += `DDAF\n`;

  // REAL ID: DDB - Card Revision Date (MMDDYYYY)
  const revisionDateForDDB = data.revisionDate || "01012020";
  dlElements += `DDB${revisionDateForDDB}\n`;

  // REAL ID: DDC - Hazmat Endorsement Expiration (optional, include empty)
  dlElements += `DDC\n`;

  // REAL ID Mandatory: DCI - Jurisdiction (full state name)
  dlElements += `DCI${fullStateName}\n`;

  // REAL ID Mandatory: DDK - Organ Donor (always include)
  dlElements += `DDK${data.donor === "Y" ? "1" : "0"}\n`;

  // Optional elements
  if (data.hairColor) {
    dlElements += `DAZ${data.hairColor}\n`;
  }
  if (data.weight) {
    dlElements += `DAW${data.weight.padStart(3, "0")}\n`;
  }
  if (data.race) {
    dlElements += `DCL${data.race}\n`;
  }

  // DL Class
  if (data.dlClass) {
    dlElements += `DCA${data.dlClass}\n`;
  }

  // Restrictions and Endorsements (always include, default NONE)
  dlElements += `DCB${data.restrictions && data.restrictions !== "NONE" ? data.restrictions : "NONE"}\n`;
  dlElements += `DCD${data.endorsement && data.endorsement !== "NONE" ? data.endorsement : "NONE"}\n`;

  // Inventory Control Number (always include)
  dlElements += `DCK${data.inventoryControlNumber || "0000000000"}\n`;

  // Full DL subfile = "DL" prefix + elements + segment terminator
  const dlSubfile = "DL" + dlElements;

  // --- Build jurisdiction subfile ---
  const jurElements = `ZCA${data.stateCode}\nZCB\n`;
  const jurSubfile = jurSubfileType + jurElements;

  // --- Build header with dynamic offsets ---
  // Header structure:
  // @ (1) + \n (1) + \x1e (1) + \r (1) + "ANSI " (5) + IIN (6) + version (2) + jurVersion (2) + numEntries (2) = 21
  // Per entry: type (2) + offset (4) + length (4) = 10
  const numEntries = 2;
  const headerLen = 21 + (10 * numEntries);

  const dlOffset = headerLen;
  const dlLength = dlSubfile.length;
  const jurOffset = dlOffset + dlLength;
  const jurLength = jurSubfile.length;

  let header = "";
  header += "@";        // Compliance indicator
  header += "\n";       // Data element separator (LF 0x0A)
  header += "\x1e";     // Record separator (RS 0x1E)
  header += "\r";       // Segment terminator (CR 0x0D)
  header += "ANSI ";    // File type (5 chars)
  header += iin;        // IIN (6 chars)
  header += version;    // AAMVA version (2 chars)
  header += jurVersion; // Jurisdiction version (2 chars)
  header += padZero(numEntries, 2); // Number of entries

  // Entry descriptors
  header += "DL" + padZero(dlOffset, 4) + padZero(dlLength, 4);
  header += jurSubfileType + padZero(jurOffset, 4) + padZero(jurLength, 4);

  return header + dlSubfile + jurSubfile;
}

// Height conversion helpers
export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592);
}
