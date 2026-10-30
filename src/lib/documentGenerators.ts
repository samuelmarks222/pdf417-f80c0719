// State-specific Document Discriminator (DD/DCF) and Inventory Control Number (ICN/DCK) generators
// Based on AAMVA CDS specifications and real jurisdiction barcode calibration sheets
// DCF = Document Discriminator (unique per card issuance)
// DCK = Inventory Control Number (card production tracking / 1D barcode)

const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const padZero = (num: number, len: number = 2) => num.toString().padStart(len, "0");
const randomLetter = () => String.fromCharCode(65 + randomNum(0, 25));
const randomLetters = (n: number) => Array.from({ length: n }, randomLetter).join("");
const randomDigits = (n: number) => Array.from({ length: n }, () => randomNum(0, 9)).join("");

// Parse issue date components from MMDDYYYY format
function parseDateParts(issueDate?: string) {
  const now = new Date();
  let month = padZero(now.getMonth() + 1);
  let day = padZero(now.getDate());
  let year = now.getFullYear().toString();
  let shortYear = year.substring(2);
  const dayOfYear = padZero(Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000), 3);

  if (issueDate && issueDate.length === 8) {
    month = issueDate.substring(0, 2);
    day = issueDate.substring(2, 4);
    year = issueDate.substring(4, 8);
    shortYear = year.substring(2);
  }

  return { month, day, year, shortYear, dayOfYear };
}

// ===================== DOCUMENT DISCRIMINATOR (DD / DCF) =====================
// Based on real barcode calibration sheets from state DMVs and AAMVA CDS specs

export function generateDD(stateCode: string, issueDate?: string, expirationDate?: string, licenseNumber?: string): string {
  const { month, day, year, shortYear } = parseDateParts(issueDate);

  switch (stateCode) {
    // Alberta: four digits, hyphen, five digits (e.g. 0571-54946)
    case "AB":
      return `0${randomDigits(3)}-${randomDigits(5)}`;
    case "MB":
      return randomDigits(9);
    case "ON":
      return `G${randomLetter()}${randomDigits(7)}`;
    case "QC":
      return `PE${randomLetters(2)}${randomDigits(2)}${randomLetters(2)}${randomLetter()}`;
    case "SK":
      return randomDigits(10);
    case "YT":
      return `${(licenseNumber || randomDigits(6)).replace(/\D/g, "") || randomDigits(6)}R0`;
    // Alabama: 2 letters + 8 digits
    case "AL":
      return `${randomLetters(2)}${randomDigits(8)}`;

    // Alaska: 2 letters + 8 digits
    case "AK":
      return `${randomLetters(2)}${randomDigits(8)}`;

    // Arizona: 2 letters + 9 digits (e.g., YB123456789)
    case "AZ":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Arkansas: 9 digits
    case "AR":
      return randomDigits(9);

    // California: MM/DD/YYYYnnnnn/AAFD/YY
    case "CA":
      return `${month}/${day}/${year}${randomDigits(5)}/AAFD/${
        expirationDate && expirationDate.length === 8
          ? expirationDate.substring(6, 8)
          : shortYear
      }`;

    // Colorado: nnnnnnnnnn (10 digits)
    case "CO":
      return randomDigits(10);

    // Connecticut: 2 letters + 8 digits
    case "CT":
      return `${randomLetters(2)}${randomDigits(8)}`;

    // Delaware: 2 letters + 6 digits
    case "DE":
      return `${randomLetters(2)}${randomDigits(6)}`;

    // DC: 10 digits
    case "DC":
      return randomDigits(10);

    // Florida: Letter + 12 digits (per FL HSMV calibration sheet: Q931611290000)
    case "FL":
      return `${randomLetter()}${randomDigits(12)}`;

    // Georgia: 2 letters + 9 digits
    case "GA":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Hawaii: 2 letters + 8 digits
    case "HI":
      return `${randomLetters(2)}${randomDigits(8)}`;

    // Idaho: 2 letters + 9 digits
    case "ID":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Illinois: 4 letters + 8 digits
    case "IL":
      return `${randomLetters(4)}${randomDigits(8)}`;

    // Indiana: 10 digits
    case "IN":
      return randomDigits(10);

    // Iowa: 9 alphanumeric
    case "IA":
      return `${randomDigits(3)}${randomLetters(2)}${randomDigits(4)}`;

    // Kansas: 10 digits
    case "KS":
      return randomDigits(10);

    // Kentucky: 2 letters + 8 digits
    case "KY":
      return `${randomLetters(2)}${randomDigits(8)}`;

    // Louisiana: 8 digits starting with 0
    case "LA":
      return `0${randomDigits(7)}`;

    // Maine: 10 digits
    case "ME":
      return randomDigits(10);

    // Maryland: 2 letters + 12 digits
    case "MD":
      return `${randomLetters(2)}${randomDigits(12)}`;

    // Massachusetts: 2 letters + 9 digits
    case "MA":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Michigan: 2 letters + 10 digits
    case "MI":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // Minnesota: 12 digits
    case "MN":
      return randomDigits(12);

    // Mississippi: 9 digits
    case "MS":
      return randomDigits(9);

    // Missouri: 10 digits
    case "MO":
      return randomDigits(10);

    // Montana: 13 digits
    case "MT":
      return randomDigits(13);

    // Nebraska: 25 alphanumeric (per NE DMV calibration: 1234567890123456789012345)
    case "NE":
      return randomDigits(25);

    // Nevada: 10 digits
    case "NV":
      return randomDigits(10);

    // New Hampshire: 2 letters + 8 digits
    case "NH":
      return `${randomLetters(2)}${randomDigits(8)}`;

    // New Jersey: 16 digits
    case "NJ":
      return randomDigits(16);

    // New Mexico: 9 digits
    case "NM":
      return randomDigits(9);

    // New York: 10 digits (no spaces in barcode data)
    case "NY":
      return randomDigits(10);

    // North Carolina: 14 digits
    case "NC":
      return randomDigits(14);

    // North Dakota: 3 letters + 6 digits
    case "ND":
      return `${randomLetters(3)}${randomDigits(6)}`;

    // Ohio: 2 letters + 10 digits
    case "OH":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // Oklahoma: 10 digits
    case "OK":
      return randomDigits(10);

    // Oregon: 7 digits
    case "OR":
      return randomDigits(7);

    // Pennsylvania: 2 letters + 10 digits
    case "PA":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // Rhode Island: 7 digits
    case "RI":
      return randomDigits(7);

    // South Carolina: 10 digits
    case "SC":
      return randomDigits(10);

    // South Dakota: 10 digits
    case "SD":
      return randomDigits(10);

    // Tennessee: 9 digits
    case "TN":
      return randomDigits(9);

    // Texas: 20 digits (e.g., 00629380085007284213)
    case "TX":
      return randomDigits(20);

    // Utah: 10 digits
    case "UT":
      return randomDigits(10);

    // Vermont: 8 digits
    case "VT":
      return randomDigits(8);

    // Virginia: 9 digits (e.g., 071536360)
    case "VA":
      return randomDigits(9);

    // Washington: 12 alphanumeric
    case "WA":
      return `${randomLetters(5)}${randomDigits(7)}`;

    // West Virginia: 7 alphanumeric
    case "WV":
      return `${randomLetter()}${randomDigits(6)}`;

    // Wisconsin: letter + 15 digits (Lnnn-nnnn-nnnn-nn)
    case "WI":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(2)}`;

    // Wyoming: 9 digits
    case "WY":
      return `${randomDigits(6)}-${randomDigits(3)}`;

    // Default: 10 digits
    default:
      return randomDigits(10);
  }
}

// ===================== INVENTORY CONTROL NUMBER (ICN / DCK) =====================
// DCK is typically the 1D barcode value on the card
// Based on real barcode calibration sheets from state DMVs

export function generateICN(stateCode: string, dlNumber?: string, issueDate?: string): string {
  const { month, day, year, shortYear, dayOfYear } = parseDateParts(issueDate);

  // Strip non-alphanumeric from DL number for embedding
  const cleanDL = (dlNumber || "").replace(/[^A-Z0-9]/gi, "");

  switch (stateCode) {
    // Alabama: 10 fixed zeroes followed by 10 random digits
    case "AL":
      return `0000000000${randomDigits(10)}`;

    // Louisiana: fixed 00700 prefix followed by 11 random digits
    case "LA":
      return `00700${randomDigits(11)}`;

    // Manitoba: nine numeric characters
    case "MB":
      return randomDigits(9);

    // Ontario: seven numeric characters
    case "ON":
      return randomDigits(7);

    // Quebec: seven numeric characters
    case "QC":
      return randomDigits(7);

    // Saskatchewan: one letter followed by eight numeric characters
    case "SK":
      return `${randomLetter()}${randomDigits(8)}`;

    // Alaska: 15 alphanumeric
    case "AK":
      return `${randomLetters(2)}${randomDigits(13)}`;

    // Arizona: 14 alphanumeric
    case "AZ":
      return `${randomLetters(2)}${randomDigits(12)}`;

    // Arkansas: 18 digits
    case "AR":
      return randomDigits(18);

    // California: YYDOYLdlnumber+suffix (embeds DL#, year, day-of-year)
    // Example: 21237D12345670401
    case "CA":
      return `${shortYear}${dayOfYear}${randomLetter()}${cleanDL.padEnd(8, "0").substring(0, 8)}${randomDigits(4)}`;

    // Colorado: 20 digits
    case "CO":
      return randomDigits(20);

    // Connecticut: 18 alphanumeric
    case "CT":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // Delaware: 15 digits
    case "DE":
      return randomDigits(15);

    // DC: 18 digits
    case "DC":
      return randomDigits(18);

    // Florida: 16 digits (per FL calibration sheet: 0110009295000261)
    case "FL":
      return `${randomDigits(16)}`;

    // Georgia: 18 digits
    case "GA":
      return randomDigits(18);

    // Hawaii: 15 digits
    case "HI":
      return randomDigits(15);

    // Idaho: 15 alphanumeric
    case "ID":
      return `${randomLetters(2)}${randomDigits(13)}`;

    // Illinois: 20 alphanumeric
    case "IL":
      return `${randomLetters(4)}${randomDigits(16)}`;

    // Indiana: 18 digits
    case "IN":
      return randomDigits(18);

    // Iowa: 18 alphanumeric
    case "IA":
      return `${randomDigits(3)}${randomLetters(2)}${randomDigits(13)}`;

    // Kansas: 18 digits
    case "KS":
      return randomDigits(18);

    // Kentucky: 18 alphanumeric
    case "KY":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // Louisiana: 18 digits starting with 0
    case "LA":
      return `0${randomDigits(17)}`;

    // Maine: 18 digits
    case "ME":
      return randomDigits(18);

    // Maryland: 18 alphanumeric
    case "MD":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // Massachusetts: 18 alphanumeric
    case "MA":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // Michigan: 18 alphanumeric
    case "MI":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // Minnesota: 18 digits
    case "MN":
      return randomDigits(18);

    // Mississippi: 18 digits
    case "MS":
      return randomDigits(18);

    // Missouri: 18 digits
    case "MO":
      return randomDigits(18);

    // Montana: 18 digits
    case "MT":
      return randomDigits(18);

    // Nebraska: Letter + DL# + state code + suffix (per NE calibration: A12345678NEW6XM01)
    case "NE":
      return `${randomLetter()}${cleanDL.padEnd(8, "0").substring(0, 8)}${stateCode}${randomDigits(1)}${randomLetters(2)}${randomDigits(2)}`;

    // Nevada: 18 digits
    case "NV":
      return randomDigits(18);

    // New Hampshire: 18 alphanumeric
    case "NH":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // New Jersey: 20 digits
    case "NJ":
      return randomDigits(20);

    // New Mexico: 18 digits
    case "NM":
      return randomDigits(18);

    // New York: 14 digits (no spaces)
    case "NY":
      return randomDigits(14);

    // North Carolina: 20 digits
    case "NC":
      return randomDigits(20);

    // North Dakota: 18 alphanumeric
    case "ND":
      return `${randomLetters(3)}${randomDigits(15)}`;

    // Ohio: 18 alphanumeric
    case "OH":
      return `${randomLetters(2)}${randomDigits(16)}`;

    // Oklahoma: 18 digits
    case "OK":
      return randomDigits(18);

    // Oregon: 18 digits
    case "OR":
      return randomDigits(18);

    // Pennsylvania: 18 digits
    case "PA":
      return randomDigits(18);

    // Rhode Island: 18 digits
    case "RI":
      return randomDigits(18);

    // South Carolina: 18 digits
    case "SC":
      return randomDigits(18);

    // South Dakota: 18 digits
    case "SD":
      return randomDigits(18);

    // Tennessee: 18 digits
    case "TN":
      return randomDigits(18);

    // Texas: fixed 10000 prefix followed by six random digits
    case "TX":
      return `10000${randomDigits(6)}`;

    // Utah: 18 digits
    case "UT":
      return randomDigits(18);

    // Vermont: 18 digits
    case "VT":
      return randomDigits(18);

    // Virginia: 16 digits (e.g., 9061900001136215)
    case "VA":
      return randomDigits(16);

    // Washington: 18 alphanumeric
    case "WA":
      return `${randomLetters(5)}${randomDigits(13)}`;

    // West Virginia: 18 alphanumeric
    case "WV":
      return `${randomLetter()}${randomDigits(17)}`;

    // Wisconsin: Letter + 15 digits
    case "WI":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Wyoming: 18 digits
    case "WY":
      return `${randomDigits(9)}-${randomDigits(9)}`;

    // Default: YY + DOY + Letter + 11 digits
    default:
      return `${shortYear}${dayOfYear}${randomLetter()}${randomDigits(11)}`;
  }
}
