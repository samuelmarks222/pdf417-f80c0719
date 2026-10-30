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

// AAMVA CDS DDA - Compliance Type
export const COMPLIANCE_TYPES = [
  { code: "F", name: "F - Fully Compliant" },
  { code: "A", name: "A - Non-Compliant" },
  { code: "B", name: "B - Non-Compliant U21" },
  { code: "Q", name: "Q - Exemption" },
  { code: "V", name: "V - Virginia" },
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
  addressLine2?: string;
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
  complianceType: string;
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
  middleName: "",
  lastName: "DOE",
  firstMiddleName: "",
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
  documentDiscriminator: "39JVRM7512",
  inventoryControlNumber: "A8F9G2H1J3K",
  restrictions: "NONE",
  endorsement: "NONE",
  complianceType: "F",
  
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
  const isAlberta = stateCode === "AB";
  
  const firstName = randomChoice(firstNames);
  const middleName = randomChoice(middleNames);
  const cities = citiesByState[stateCode] || citiesByState.default;
  
  // State-specific license number formats
  const generateLicenseNumber = (state: string): string => {
    switch (state) {
      case "CA":
        return `D${randomNum(1000000, 9999999)}`;
      case "AB":
        return `${randomNum(100000, 999999)}-${randomNum(100, 999)}`;
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
    dateOfBirth: isAlberta ? `${birthYear}${birthMonth}${birthDay}` : `${birthMonth}${birthDay}${birthYear}`,
    gender: randomChoice(GENDER_OPTIONS).code,
    eyeColor: randomChoice(EYE_COLORS).code,
    eyeColorOnDL: randomChoice(EYE_COLORS_ON_DL).code,
    hairColor: randomChoice(HAIR_COLORS).code,
    hairColorOnDL: randomChoice(HAIR_COLORS_ON_DL).code,
    height: isAlberta ? randomNum(160, 195).toString() : randomNum(60, 78).toString(),
    weight: randomNum(120, 250).toString(),
    licenseNumber: generateLicenseNumber(stateCode),
    issueDate: isAlberta ? `${issueYear}${issueMonth}${issueDay}` : `${issueMonth}${issueDay}${issueYear}`,
    expirationDate: isAlberta ? `${issueYear + 5}${birthMonth}${birthDay}` : `${issueMonth}${issueDay}${expYear}`,
    documentDiscriminator: generateDD(stateCode, isAlberta ? `${issueYear}${issueMonth}${issueDay}` : `${issueMonth}${issueDay}${issueYear}`, isAlberta ? `${issueYear + 5}${birthMonth}${birthDay}` : `${issueMonth}${issueDay}${expYear}`),
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

// Generate random alphanumeric string (letters + digits only)
function generateAlphanumericString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Height conversion helpers
export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54);
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592);
}
