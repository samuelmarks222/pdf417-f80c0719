// AAMVA Driver License/ID Data Structure and US States

export const US_STATES = [
  { code: "AL", name: "Alabama", iin: "636033" },
  { code: "AK", name: "Alaska", iin: "636059" },
  { code: "AZ", name: "Arizona", iin: "636026" },
  { code: "AR", name: "Arkansas", iin: "636021" },
  { code: "CA", name: "California", iin: "636014" },
  { code: "CO", name: "Colorado", iin: "636020" },
  { code: "CT", name: "Connecticut", iin: "636006" },
  { code: "DE", name: "Delaware", iin: "636011" },
  { code: "DC", name: "District of Columbia", iin: "636043" },
  { code: "FL", name: "Florida", iin: "636010" },
  { code: "GA", name: "Georgia", iin: "636055" },
  { code: "HI", name: "Hawaii", iin: "636047" },
  { code: "ID", name: "Idaho", iin: "636050" },
  { code: "IL", name: "Illinois", iin: "636035" },
  { code: "IN", name: "Indiana", iin: "636037" },
  { code: "IA", name: "Iowa", iin: "636018" },
  { code: "KS", name: "Kansas", iin: "636022" },
  { code: "KY", name: "Kentucky", iin: "636046" },
  { code: "LA", name: "Louisiana", iin: "636007" },
  { code: "ME", name: "Maine", iin: "636041" },
  { code: "MD", name: "Maryland", iin: "636003" },
  { code: "MA", name: "Massachusetts", iin: "636002" },
  { code: "MI", name: "Michigan", iin: "636032" },
  { code: "MN", name: "Minnesota", iin: "636038" },
  { code: "MS", name: "Mississippi", iin: "636051" },
  { code: "MO", name: "Missouri", iin: "636030" },
  { code: "MT", name: "Montana", iin: "636008" },
  { code: "NE", name: "Nebraska", iin: "636054" },
  { code: "NV", name: "Nevada", iin: "636049" },
  { code: "NH", name: "New Hampshire", iin: "636039" },
  { code: "NJ", name: "New Jersey", iin: "636036" },
  { code: "NM", name: "New Mexico", iin: "636009" },
  { code: "NY", name: "New York", iin: "636001" },
  { code: "NC", name: "North Carolina", iin: "636004" },
  { code: "ND", name: "North Dakota", iin: "636034" },
  { code: "OH", name: "Ohio", iin: "636023" },
  { code: "OK", name: "Oklahoma", iin: "636058" },
  { code: "OR", name: "Oregon", iin: "636029" },
  { code: "PA", name: "Pennsylvania", iin: "636025" },
  { code: "RI", name: "Rhode Island", iin: "636052" },
  { code: "SC", name: "South Carolina", iin: "636005" },
  { code: "SD", name: "South Dakota", iin: "636042" },
  { code: "TN", name: "Tennessee", iin: "636053" },
  { code: "TX", name: "Texas", iin: "636015" },
  { code: "UT", name: "Utah", iin: "636040" },
  { code: "VT", name: "Vermont", iin: "636024" },
  { code: "VA", name: "Virginia", iin: "636000" },
  { code: "WA", name: "Washington", iin: "636045" },
  { code: "WV", name: "West Virginia", iin: "636061" },
  { code: "WI", name: "Wisconsin", iin: "636031" },
  { code: "WY", name: "Wyoming", iin: "636060" },
] as const;

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

export const GENDER_OPTIONS = [
  { code: "1", name: "Male" },
  { code: "2", name: "Female" },
] as const;

export interface AAMVAData {
  // Header info
  state: string;
  aamvaVersion: string;
  jurisdictionVersion: string;
  
  // Personal info
  firstName: string;
  middleName: string;
  lastName: string;
  nameSuffix: string;
  
  // Address
  streetAddress: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
  
  // Physical description
  dateOfBirth: string;
  gender: string;
  eyeColor: string;
  hairColor: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  
  // Document info
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
  documentDiscriminator: string;
  inventoryControlNumber: string;
  
  // Compliance
  complianceType: string;
}

export const DEFAULT_AAMVA_DATA: AAMVAData = {
  state: "CA",
  aamvaVersion: "10",
  jurisdictionVersion: "05",
  
  firstName: "JOHN",
  middleName: "MICHAEL",
  lastName: "DOE",
  nameSuffix: "",
  
  streetAddress: "123 MAIN ST",
  streetAddress2: "",
  city: "LOS ANGELES",
  postalCode: "900010000",
  
  dateOfBirth: "01011990",
  gender: "1",
  eyeColor: "BRO",
  hairColor: "BRO",
  heightFeet: "5",
  heightInches: "10",
  weight: "180",
  
  licenseNumber: "D1234567",
  issueDate: "01012020",
  expirationDate: "01012030",
  documentDiscriminator: "12345678901234567890123456789012",
  inventoryControlNumber: "1234567890",
  
  complianceType: "F",
};

// Generate random data for testing
export function generateRandomData(): Partial<AAMVAData> {
  const firstNames = ["JAMES", "JOHN", "ROBERT", "MICHAEL", "WILLIAM", "DAVID", "RICHARD", "JOSEPH", "MARY", "PATRICIA", "JENNIFER", "LINDA", "ELIZABETH", "BARBARA", "SUSAN", "JESSICA"];
  const middleNames = ["ALLEN", "BRIAN", "CHARLES", "DANIEL", "EDWARD", "FRANK", "GEORGE", "HENRY", "ANN", "BETH", "CLAIRE", "DIANE", "EVE", "GRACE", "HELEN", "IRIS"];
  const lastNames = ["SMITH", "JOHNSON", "WILLIAMS", "BROWN", "JONES", "GARCIA", "MILLER", "DAVIS", "RODRIGUEZ", "MARTINEZ", "HERNANDEZ", "LOPEZ", "GONZALEZ", "WILSON", "ANDERSON", "THOMAS"];
  const streets = ["MAIN ST", "OAK AVE", "MAPLE DR", "PARK BLVD", "CEDAR LN", "ELM ST", "PINE RD", "WASHINGTON AVE", "LINCOLN BLVD", "SUNSET DR"];
  const cities = ["LOS ANGELES", "SAN DIEGO", "SAN JOSE", "SAN FRANCISCO", "FRESNO", "SACRAMENTO", "LONG BEACH", "OAKLAND", "BAKERSFIELD", "ANAHEIM"];
  
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
  
  return {
    firstName: randomChoice(firstNames),
    middleName: randomChoice(middleNames),
    lastName: randomChoice(lastNames),
    streetAddress: `${randomNum(100, 9999)} ${randomChoice(streets)}`,
    city: randomChoice(cities),
    postalCode: `${randomNum(90001, 96162)}0000`,
    dateOfBirth: `${birthMonth}${birthDay}${birthYear}`,
    gender: randomChoice(GENDER_OPTIONS).code,
    eyeColor: randomChoice(EYE_COLORS).code,
    hairColor: randomChoice(HAIR_COLORS).code,
    heightFeet: randomNum(5, 6).toString(),
    heightInches: padZero(randomNum(0, 11), 2),
    weight: randomNum(120, 250).toString(),
    licenseNumber: `D${randomNum(1000000, 9999999)}`,
    issueDate: `${issueMonth}${issueDay}${issueYear}`,
    expirationDate: `${issueMonth}${issueDay}${expYear}`,
    documentDiscriminator: Array.from({ length: 32 }, () => randomNum(0, 9)).join(""),
    inventoryControlNumber: Array.from({ length: 10 }, () => randomNum(0, 9)).join(""),
  };
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
export function encodeAAMVA(data: AAMVAData): string {
  const state = US_STATES.find(s => s.code === data.state);
  const iin = state?.iin || "636014";
  
  // AAMVA Version
  const version = data.aamvaVersion.padStart(2, "0");
  
  // Height in format: feet'inches" (e.g., "510" for 5'10")
  const height = `${data.heightFeet}${data.heightInches.padStart(2, "0")} in`;
  
  // Build the barcode data string following AAMVA CDS format
  let barcodeData = "";
  
  // Compliance Indicator
  barcodeData += "@\n";
  
  // Data Element Separator and Header
  barcodeData += "\x1e\r"; // RS + CR
  barcodeData += `ANSI ${iin}${version}0102DL00410288ZA03290015DL`;
  
  // Subfile designators
  barcodeData += "\r"; // CR after header
  
  // Mandatory Data Elements
  barcodeData += `DAQ${data.licenseNumber}\n`; // Customer ID Number
  barcodeData += `DCS${data.lastName}\n`; // Customer Family Name
  barcodeData += `DDEN\n`; // Family Name Truncation
  barcodeData += `DAC${data.firstName}\n`; // Customer First Name
  barcodeData += `DDFN\n`; // First Name Truncation
  barcodeData += `DAD${data.middleName}\n`; // Customer Middle Name
  barcodeData += `DDGN\n`; // Middle Name Truncation
  
  // Document info
  barcodeData += `DBD${formatDateToAAMVA(data.issueDate)}\n`; // Document Issue Date
  barcodeData += `DBB${formatDateToAAMVA(data.dateOfBirth)}\n`; // Date of Birth
  barcodeData += `DBA${formatDateToAAMVA(data.expirationDate)}\n`; // Document Expiration Date
  barcodeData += `DBC${data.gender}\n`; // Sex
  
  // Physical description
  barcodeData += `DAY${data.eyeColor}\n`; // Eye Color
  barcodeData += `DAU${height}\n`; // Height
  
  // Address
  barcodeData += `DAG${data.streetAddress}\n`; // Street Address 1
  if (data.streetAddress2) {
    barcodeData += `DAH${data.streetAddress2}\n`; // Street Address 2
  }
  barcodeData += `DAI${data.city}\n`; // City
  barcodeData += `DAJ${data.state}\n`; // State
  barcodeData += `DAK${data.postalCode}\n`; // Postal Code
  
  // Additional elements
  barcodeData += `DCF${data.documentDiscriminator}\n`; // Document Discriminator
  barcodeData += `DCGUSA\n`; // Country
  
  // Optional elements
  if (data.hairColor) {
    barcodeData += `DAZ${data.hairColor}\n`; // Hair Color
  }
  if (data.weight) {
    barcodeData += `DAW${data.weight}\n`; // Weight (lbs)
  }
  if (data.nameSuffix) {
    barcodeData += `DCU${data.nameSuffix}\n`; // Name Suffix
  }
  
  // Inventory Control Number
  barcodeData += `DCK${data.inventoryControlNumber}\n`;
  
  // Compliance Type (F = Full Compliance, N = Non-Compliant)
  barcodeData += `DDA${data.complianceType}\n`;
  
  // Jurisdiction-specific data (California example)
  barcodeData += `ZCA${data.state}\n`;
  barcodeData += `ZCB\n`;
  barcodeData += `ZCC\n`;
  
  return barcodeData;
}
