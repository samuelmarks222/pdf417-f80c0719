// State-specific Document Discriminator (DD/DCF) and Inventory Control Number (ICN/DCK) generators
// Based on AAMVA CDS specifications and real jurisdiction formats
// DCF = Document Discriminator (unique per card issuance)
// DCK = Inventory Control Number (card production tracking)

const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const padZero = (num: number, len: number = 2) => num.toString().padStart(len, "0");
const randomLetter = () => String.fromCharCode(65 + randomNum(0, 25));
const randomLetters = (n: number) => Array.from({ length: n }, randomLetter).join("");
const randomDigits = (n: number) => Array.from({ length: n }, () => randomNum(0, 9)).join("");
const randomHex = (n: number) => Array.from({ length: n }, () => "0123456789ABCDEF"[randomNum(0, 15)]).join("");

// Parse issue date components
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

export function generateDD(stateCode: string, issueDate?: string): string {
  const { month, day, year, shortYear, dayOfYear } = parseDateParts(issueDate);

  switch (stateCode) {
    // Alabama: 10-digit numeric
    case "AL":
      return randomDigits(10);

    // Alaska: 10-digit numeric
    case "AK":
      return randomDigits(10);

    // Arizona: 2 letters + 9 digits (e.g., YB123456789)
    case "AZ":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Arkansas: 9-digit numeric
    case "AR":
      return randomDigits(9);

    // California: MM/DD/YYYY/nnnnn/LLLL/nn (issue-date based)
    case "CA":
      return `${month}/${day}/${year}/${randomDigits(5)}/${randomLetters(4)}/${padZero(randomNum(10, 99))}`;

    // Colorado: CODL_n_MMDDYY_nnnnn format (audit-style)
    case "CO":
      return `CODL_${randomNum(0, 9)}_${month}${day}${shortYear}_${randomDigits(5)}`;

    // Connecticut: 9-digit numeric
    case "CT":
      return randomDigits(9);

    // Delaware: 9-digit numeric
    case "DE":
      return randomDigits(9);

    // DC: 10-digit numeric
    case "DC":
      return randomDigits(10);

    // Florida: YYnnnLLnnnnnN (year-based alphanumeric)
    case "FL":
      return `${shortYear}${randomDigits(3)}${randomLetters(2)}${randomDigits(5)}${randomNum(0, 9)}`;

    // Georgia: 11-digit numeric
    case "GA":
      return randomDigits(11);

    // Hawaii: 10-digit numeric
    case "HI":
      return randomDigits(10);

    // Idaho: LL + 9 digits
    case "ID":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Illinois: L-nnn-nnnn-nnnn
    case "IL":
      return `${randomLetter()}-${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Indiana: nnnn-nn-nnnn
    case "IN":
      return `${randomDigits(4)}-${randomDigits(2)}-${randomDigits(4)}`;

    // Iowa: nnnLLnnnn
    case "IA":
      return `${randomDigits(3)}${randomLetters(2)}${randomDigits(4)}`;

    // Kansas: Lnn-nn-nnnn
    case "KS":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(2)}-${randomDigits(4)}`;

    // Kentucky: Lnn-nnn-nnn
    case "KY":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(3)}-${randomDigits(3)}`;

    // Louisiana: 0nnnnnnn (starts with 0)
    case "LA":
      return `0${randomDigits(7)}`;

    // Maine: 9-digit numeric
    case "ME":
      return randomDigits(9);

    // Maryland: LL-nnn-nnn-nnn-nnn
    case "MD":
      return `${randomLetters(2)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}`;

    // Massachusetts: 2 letters + 9 digits
    case "MA":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Michigan: LnnnnLnnnnn
    case "MI":
      return `${randomLetter()}${randomDigits(4)}${randomLetter()}${randomDigits(5)}`;

    // Minnesota: Lnnn-nnn-nnn-nnn
    case "MN":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}`;

    // Mississippi: nnn-nn-nnnn
    case "MS":
      return `${randomDigits(3)}-${randomDigits(2)}-${randomDigits(4)}`;

    // Missouri: Lnnnnnnnnn (letter + 9 digits)
    case "MO":
      return `${randomLetter()}${randomDigits(9)}`;

    // Montana: 13-digit numeric
    case "MT":
      return randomDigits(13);

    // Nebraska: Lnnnnnnnn (letter + 8 digits)
    case "NE":
      return `${randomLetter()}${randomDigits(8)}`;

    // Nevada: 10-digit numeric
    case "NV":
      return randomDigits(10);

    // New Hampshire: nnLLLnnnnn
    case "NH":
      return `${randomDigits(2)}${randomLetters(3)}${randomDigits(5)}`;

    // New Jersey: 16-digit numeric
    case "NJ":
      return randomDigits(16);

    // New Mexico: 9-digit numeric
    case "NM":
      return randomDigits(9);

    // New York: nn nnn nnnnn nnn (spaced groups)
    case "NY":
      return `${randomDigits(2)} ${randomDigits(3)} ${randomDigits(5)} ${randomDigits(3)}`;

    // North Carolina: 14-digit numeric
    case "NC":
      return randomDigits(14);

    // North Dakota: LLL-nnnnnn
    case "ND":
      return `${randomLetters(3)}-${randomDigits(6)}`;

    // Ohio: LLnnnnnnnnn (2 letters + 9 digits)
    case "OH":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Oklahoma: Lnnnnnnnnn (letter + 9 digits)
    case "OK":
      return `${randomLetter()}${randomDigits(9)}`;

    // Oregon: 7-digit numeric
    case "OR":
      return randomDigits(7);

    // Pennsylvania: nn nnnn nnnn (spaced)
    case "PA":
      return `${randomDigits(2)} ${randomDigits(4)} ${randomDigits(4)}`;

    // Rhode Island: 7-digit numeric
    case "RI":
      return randomDigits(7);

    // South Carolina: 9-digit numeric
    case "SC":
      return randomDigits(9);

    // South Dakota: 9-digit numeric
    case "SD":
      return randomDigits(9);

    // Tennessee: 9-digit numeric
    case "TN":
      return randomDigits(9);

    // Texas: 11-digit numeric
    case "TX":
      return randomDigits(11);

    // Utah: 10-digit numeric
    case "UT":
      return randomDigits(10);

    // Vermont: 8-digit numeric
    case "VT":
      return randomDigits(8);

    // Virginia: 16-digit numeric (per VA DMV spec)
    case "VA":
      return randomDigits(16);

    // Washington: LLLLLnnnnn (5 letters + 5 digits)
    case "WA":
      return `${randomLetters(5)}${randomDigits(5)}`;

    // West Virginia: Lnnnnnn
    case "WV":
      return `${randomLetter()}${randomDigits(6)}`;

    // Wisconsin: Lnnn-nnnn-nnnn-nn
    case "WI":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(2)}`;

    // Wyoming: nnnnnn-nnn
    case "WY":
      return `${randomDigits(6)}-${randomDigits(3)}`;

    // Default fallback: 10-digit numeric
    default:
      return randomDigits(10);
  }
}

// ===================== INVENTORY CONTROL NUMBER (ICN / DCK) =====================

export function generateICN(stateCode: string, dlNumber?: string, issueDate?: string): string {
  const { month, day, year, shortYear, dayOfYear } = parseDateParts(issueDate);

  // Strip non-alphanumeric from DL number for embedding
  const cleanDL = (dlNumber || "").replace(/[^A-Z0-9]/gi, "");

  switch (stateCode) {
    // Alabama: 11-digit numeric
    case "AL":
      return randomDigits(11);

    // Alaska: 12-digit numeric
    case "AK":
      return randomDigits(12);

    // Arizona: LL + 11 digits
    case "AZ":
      return `${randomLetters(2)}${randomDigits(11)}`;

    // Arkansas: 10-digit numeric
    case "AR":
      return randomDigits(10);

    // California: YYDOYLdlnumbernnnn (year + day-of-year + letter + DL embedded + suffix)
    case "CA":
      return `${shortYear}${dayOfYear}${randomLetter()}${cleanDL.padEnd(8, "0").substring(0, 8)}${randomDigits(4)}`;

    // Colorado: CODL_n_MMDDYY_nnnnnnn (audit format extended)
    case "CO":
      return `CODL_${randomNum(0, 9)}_${month}${day}${shortYear}_${randomDigits(7)}`;

    // Connecticut: 12-digit numeric
    case "CT":
      return randomDigits(12);

    // Delaware: 12-digit numeric
    case "DE":
      return randomDigits(12);

    // DC: 12-digit numeric
    case "DC":
      return randomDigits(12);

    // Florida: Letter + 17 digits
    case "FL":
      return `${randomLetter()}${randomDigits(17)}`;

    // Georgia: 15-digit numeric
    case "GA":
      return randomDigits(15);

    // Hawaii: 12-digit numeric
    case "HI":
      return randomDigits(12);

    // Idaho: LL + 11 digits
    case "ID":
      return `${randomLetters(2)}${randomDigits(11)}`;

    // Illinois: Lnnn-nnnn-nnnn
    case "IL":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Indiana: nnnn-nn-nnnn-nn
    case "IN":
      return `${randomDigits(4)}-${randomDigits(2)}-${randomDigits(4)}-${randomDigits(2)}`;

    // Iowa: nnnLLnnnnnnn
    case "IA":
      return `${randomDigits(3)}${randomLetters(2)}${randomDigits(7)}`;

    // Kansas: Lnn-nn-nnnnnnn
    case "KS":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(2)}-${randomDigits(7)}`;

    // Kentucky: Lnn-nnn-nnnnnn
    case "KY":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(3)}-${randomDigits(6)}`;

    // Louisiana: 0nnnnnnnnn (starts with 0)
    case "LA":
      return `0${randomDigits(9)}`;

    // Maine: 10-digit numeric
    case "ME":
      return randomDigits(10);

    // Maryland: LL-nnn-nnn-nnn-nnnn
    case "MD":
      return `${randomLetters(2)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`;

    // Massachusetts: 2 letters + 10 digits
    case "MA":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // Michigan: Lnnnn-Lnnnnn-nn
    case "MI":
      return `${randomLetter()}${randomDigits(4)}-${randomLetter()}${randomDigits(5)}-${randomDigits(2)}`;

    // Minnesota: Lnnn-nnn-nnn-nnnn
    case "MN":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`;

    // Mississippi: nnn-nn-nnnnnnn
    case "MS":
      return `${randomDigits(3)}-${randomDigits(2)}-${randomDigits(7)}`;

    // Missouri: Lnnnnnnnnnn (letter + 10 digits)
    case "MO":
      return `${randomLetter()}${randomDigits(10)}`;

    // Montana: 14-digit numeric
    case "MT":
      return randomDigits(14);

    // Nebraska: Lnnnnnnnnn
    case "NE":
      return `${randomLetter()}${randomDigits(9)}`;

    // Nevada: 12-digit numeric
    case "NV":
      return randomDigits(12);

    // New Hampshire: nnLLLnnnnnn
    case "NH":
      return `${randomDigits(2)}${randomLetters(3)}${randomDigits(6)}`;

    // New Jersey: 18-digit numeric
    case "NJ":
      return randomDigits(18);

    // New Mexico: 10-digit numeric
    case "NM":
      return randomDigits(10);

    // New York: nn nnn nnnnn nnnn
    case "NY":
      return `${randomDigits(2)} ${randomDigits(3)} ${randomDigits(5)} ${randomDigits(4)}`;

    // North Carolina: 16-digit numeric
    case "NC":
      return randomDigits(16);

    // North Dakota: LLL-nnnnnnn
    case "ND":
      return `${randomLetters(3)}-${randomDigits(7)}`;

    // Ohio: LLnnnnnnnnnn (2 letters + 10 digits)
    case "OH":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // Oklahoma: Lnnnnnnnnnn (letter + 10 digits)
    case "OK":
      return `${randomLetter()}${randomDigits(10)}`;

    // Oregon: 11-digit numeric
    case "OR":
      return randomDigits(11);

    // Pennsylvania: 16-digit numeric
    case "PA":
      return randomDigits(16);

    // Rhode Island: 9-digit numeric
    case "RI":
      return randomDigits(9);

    // South Carolina: 12-digit numeric
    case "SC":
      return randomDigits(12);

    // South Dakota: 12-digit numeric
    case "SD":
      return randomDigits(12);

    // Tennessee: 12-digit numeric
    case "TN":
      return randomDigits(12);

    // Texas: 17-digit numeric
    case "TX":
      return randomDigits(17);

    // Utah: 12-digit numeric
    case "UT":
      return randomDigits(12);

    // Vermont: 10-digit numeric
    case "VT":
      return randomDigits(10);

    // Virginia: 16-digit numeric (per VA DMV spec: 9061900001136215)
    case "VA":
      return randomDigits(16);

    // Washington: LLLLLnnnnnn (5 letters + 6 digits)
    case "WA":
      return `${randomLetters(5)}${randomDigits(6)}`;

    // West Virginia: Lnnnnnnn
    case "WV":
      return `${randomLetter()}${randomDigits(7)}`;

    // Wisconsin: Lnnn-nnnn-nnnn-nnnn
    case "WI":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Wyoming: nnnnnn-nnnnnn
    case "WY":
      return `${randomDigits(6)}-${randomDigits(6)}`;

    // Default: YYDOYLnnnnnnnnnnn
    default:
      return `${shortYear}${dayOfYear}${randomLetter()}${randomDigits(11)}`;
  }
}
