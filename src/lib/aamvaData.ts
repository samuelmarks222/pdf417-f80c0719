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
  // Calculate header sizes based on AAMVA version
  const version = aamvaVersion.padStart(2, "0");
  const jurVersion = jurisdictionVersion.padStart(2, "0");
  
  // Height format
  const heightInches = parseInt(data.height) || 69;
  const heightStr = `${Math.floor(heightInches / 12)}${padZero(heightInches % 12)} in`;
  
  // Build the barcode data string following AAMVA CDS format
  let barcodeData = "";
  
  // Compliance Indicator and Header
  barcodeData += "@\n";
  barcodeData += "\x1e\r";
  barcodeData += `ANSI ${iin}${version}${jurVersion}DL00410288ZA03290015DL`;
  barcodeData += "\n";
  
  // Mandatory Data Elements
  barcodeData += `DAQ${data.licenseNumber}\n`;
  barcodeData += `DCS${data.lastName}\n`;
  barcodeData += `DDEN\n`;
  
  // Handle name fields based on state format
  if (data.firstMiddleName && !data.firstName) {
    // NY-style combined first & middle name
    barcodeData += `DCT${data.firstMiddleName}\n`;
  } else {
    barcodeData += `DAC${data.firstName}\n`;
    barcodeData += `DDFN\n`;
    // REAL ID: Always include DAD even if empty
    barcodeData += `DAD${data.middleName || ""}\n`;
    barcodeData += `DDGN\n`;
  }
  
  // Name suffix
  if (data.nameSuffix && data.nameSuffix !== "NONE") {
    barcodeData += `DCU${data.nameSuffix}\n`;
  }
  
  // Document dates (MMDDYYYY format per AAMVA spec)
  barcodeData += `DBD${data.issueDate}\n`;
  barcodeData += `DBB${data.dateOfBirth}\n`;
  barcodeData += `DBA${data.expirationDate}\n`;
  
  // Sex
  barcodeData += `DBC${data.gender}\n`;
  
  // Physical description
  barcodeData += `DAY${data.eyeColor}\n`;
  barcodeData += `DAU${heightStr}\n`;
  
  // Address
  barcodeData += `DAG${data.streetAddress}\n`;
  barcodeData += `DAI${data.city}\n`;
  barcodeData += `DAJ${data.stateCode}\n`;
  barcodeData += `DAK${data.postalCode}\n`;
  
  // Document info
  if (data.documentDiscriminator) {
    barcodeData += `DCF${data.documentDiscriminator}\n`;
  }
  barcodeData += `DCGUSA\n`;

  // REAL ID Mandatory: DDA - Compliance Type / Card Revision Date (MMDDYYYY)
  // Use revision date from state config, or fall back to a sensible default
  const revisionDateForDDA = data.revisionDate || "01012020";
  barcodeData += `DDA${revisionDateForDDA}\n`;

  // REAL ID Mandatory: DCI - Place of birth / Jurisdiction (full state name)
  const stateConfig = getStateConfig(data.stateCode);
  const fullStateName = stateConfig ? stateConfig.name : data.stateCode;
  barcodeData += `DCI${fullStateName}\n`;

  // REAL ID Mandatory: DDK - Organ Donor (always include, default 0)
  barcodeData += `DDK${data.donor === "Y" ? "1" : "0"}\n`;
  
  // Optional elements
  if (data.hairColor) {
    barcodeData += `DAZ${data.hairColor}\n`;
  }
  if (data.weight) {
    barcodeData += `DAW${data.weight}\n`;
  }
  if (data.race) {
    barcodeData += `DCL${data.race}\n`;
  }
  
  // DL Class
  if (data.dlClass) {
    barcodeData += `DCA${data.dlClass}\n`;
  }
  
  // Restrictions and Endorsements
  if (data.restrictions && data.restrictions !== "NONE") {
    barcodeData += `DCB${data.restrictions}\n`;
  }
  if (data.endorsement && data.endorsement !== "NONE") {
    barcodeData += `DCD${data.endorsement}\n`;
  }
  
  // Inventory Control Number (always include)
  barcodeData += `DCK${data.inventoryControlNumber || "0000000000"}\n`;
  
  // Jurisdiction-specific data
  barcodeData += `ZC${data.stateCode}A${data.stateCode}\n`;
  barcodeData += `ZC${data.stateCode}B\n`;
  
  return barcodeData;
}

// Height conversion helpers
export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592);
}
