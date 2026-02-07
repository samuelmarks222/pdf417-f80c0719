// State-specific Document Discriminator (DD/DCF) and Inventory Control Number (ICN/DCK) generators
// Based on real AAMVA formats per jurisdiction

const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const padZero = (num: number, len: number = 2) => num.toString().padStart(len, "0");
const randomLetter = () => String.fromCharCode(65 + randomNum(0, 25));
const randomLetters = (n: number) => Array.from({ length: n }, randomLetter).join("");
const randomDigits = (n: number) => Array.from({ length: n }, () => randomNum(0, 9)).join("");

// ===================== DOCUMENT DISCRIMINATOR (DD / DCF) =====================

export function generateDD(stateCode: string, issueDate?: string): string {
  // Parse issue date components if available
  const now = new Date();
  let month = padZero(now.getMonth() + 1);
  let day = padZero(now.getDate());
  let year = now.getFullYear().toString();
  let shortYear = year.substring(2);

  if (issueDate && issueDate.length === 8) {
    month = issueDate.substring(0, 2);
    day = issueDate.substring(2, 4);
    year = issueDate.substring(4, 8);
    shortYear = year.substring(2);
  }

  switch (stateCode) {
    // California: MM/DD/YYYYnnnnn/LLLL/nn
    case "CA":
      return `${month}/${day}/${year}${randomDigits(5)}/${randomLetters(4)}/${randomNum(10, 99)}`;

    // Texas: nnnnnnnnnnn (11 digits)
    case "TX":
      return `${randomDigits(11)}`;

    // Florida: FLnnnnnnnnn or date-based
    case "FL":
      return `${shortYear}${randomDigits(3)}${randomLetters(2)}${randomDigits(5)}${randomNum(0, 9)}`;

    // New York: nn nnn nnnnn nnn or similar
    case "NY":
      return `${randomDigits(2)} ${randomDigits(3)} ${randomDigits(5)} ${randomDigits(3)}`;

    // Illinois: L-nnn-nnnn-nnnn
    case "IL":
      return `${randomLetter()}-${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Pennsylvania: nn nnnn nnnn
    case "PA":
      return `${randomDigits(2)} ${randomDigits(4)} ${randomDigits(4)}`;

    // Ohio: LLnnnnnnnnn
    case "OH":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Georgia: nnnnnnnnnnn
    case "GA":
      return `${randomDigits(11)}`;

    // North Carolina: nnnnnnnnnnnnnn
    case "NC":
      return `${randomDigits(14)}`;

    // Michigan: LnnnnLnnnnn
    case "MI":
      return `${randomLetter()}${randomDigits(4)}${randomLetter()}${randomDigits(5)}`;

    // Virginia: nnnnnnnnnn
    case "VA":
      return `${randomDigits(10)}`;

    // Washington: LLLLLnnnnn
    case "WA":
      return `${randomLetters(5)}${randomDigits(5)}`;

    // New Jersey: nnnnnnnnnnnnnnnn (16 digits)
    case "NJ":
      return `${randomDigits(16)}`;

    // Maryland: LL-nnn-nnn-nnn-nnn
    case "MD":
      return `${randomLetters(2)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}`;

    // Massachusetts: Snnnnnnnnn
    case "MA":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Arizona: LLnnnnnnnnn
    case "AZ":
      return `${randomLetters(2)}${randomDigits(9)}`;

    // Colorado: nn-nnn-nnnn
    case "CO":
      return `${randomDigits(2)}-${randomDigits(3)}-${randomDigits(4)}`;

    // Alabama: nnnnnnnnn
    case "AL":
      return `${randomDigits(9)}`;

    // Indiana: nnnn-nn-nnnn
    case "IN":
      return `${randomDigits(4)}-${randomDigits(2)}-${randomDigits(4)}`;

    // Minnesota: Lnnn-nnn-nnn-nnn
    case "MN":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}`;

    // Wisconsin: Lnnn-nnnn-nnnn-nn
    case "WI":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(2)}`;

    // Missouri: Lnnnnnnnnn
    case "MO":
      return `${randomLetter()}${randomDigits(9)}`;

    // Oregon: nnnnnnn
    case "OR":
      return `${randomDigits(7)}`;

    // Connecticut: nnnnnnnnn
    case "CT":
      return `${randomDigits(9)}`;

    // Iowa: nnnLLnnnn
    case "IA":
      return `${randomDigits(3)}${randomLetters(2)}${randomDigits(4)}`;

    // Kansas: Lnn-nn-nnnn
    case "KS":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(2)}-${randomDigits(4)}`;

    // Kentucky: Lnn-nnn-nnn
    case "KY":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(3)}-${randomDigits(3)}`;

    // Tennessee: nnnnnnnnn
    case "TN":
      return `${randomDigits(9)}`;

    // South Carolina: nnnnnnnnn
    case "SC":
      return `${randomDigits(9)}`;

    // Louisiana: 0nnnnnnn
    case "LA":
      return `0${randomDigits(7)}`;

    // Default: MM/DD/YYYYnnnnn/LLLL/nn (generic format)
    default:
      return `${month}/${day}/${year}${randomDigits(5)}/${randomLetters(4)}/${randomNum(10, 99)}`;
  }
}

// ===================== INVENTORY CONTROL NUMBER (ICN / DCK) =====================

export function generateICN(stateCode: string, dlNumber?: string, issueDate?: string): string {
  const now = new Date();
  let shortYear = now.getFullYear().toString().substring(2);
  const dayOfYear = padZero(Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000), 3);

  if (issueDate && issueDate.length === 8) {
    shortYear = issueDate.substring(6, 8);
  }

  // Strip non-alphanumeric from DL number for embedding
  const cleanDL = (dlNumber || "").replace(/[^A-Z0-9]/gi, "");

  switch (stateCode) {
    // California: YYDDDLdlnumbernnnn (2yr + 3dayOfYear + letter + DL digits + suffix)
    case "CA":
      return `${shortYear}${dayOfYear}${randomLetter()}${cleanDL.padEnd(8, "0").substring(0, 8)}${randomDigits(4)}`;

    // Texas: nnnnnnnnnnnnnnnnn (17 digits)
    case "TX":
      return `${randomDigits(17)}`;

    // Florida: Lnnnnnnnnnnnnnnnnn (letter + 17 digits)
    case "FL":
      return `${randomLetter()}${randomDigits(17)}`;

    // Illinois: Lnnn-nnnn-nnnn (letter + digits)
    case "IL":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Pennsylvania: nnnnnnnnnnnnnnnn (16 digits)
    case "PA":
      return `${randomDigits(16)}`;

    // Ohio: LLnnnnnnnnnn
    case "OH":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // Georgia: nnnnnnnnnnnnnnn (15 digits)
    case "GA":
      return `${randomDigits(15)}`;

    // North Carolina: nnnnnnnnnnnnnnnn
    case "NC":
      return `${randomDigits(16)}`;

    // Michigan: Lnnnn-Lnnnnn-nn
    case "MI":
      return `${randomLetter()}${randomDigits(4)}-${randomLetter()}${randomDigits(5)}-${randomDigits(2)}`;

    // Virginia: nnnnnnnnnnnn
    case "VA":
      return `${randomDigits(12)}`;

    // Washington: LLLLLnnnnnn
    case "WA":
      return `${randomLetters(5)}${randomDigits(6)}`;

    // Alabama: nnnnnnnnnnn
    case "AL":
      return `${randomDigits(11)}`;

    // Arizona: LLnnnnnnnnnnn
    case "AZ":
      return `${randomLetters(2)}${randomDigits(11)}`;

    // Colorado: nn-nnn-nnnnnnn
    case "CO":
      return `${randomDigits(2)}-${randomDigits(3)}-${randomDigits(7)}`;

    // Maryland: LL-nnn-nnn-nnn-nnnn
    case "MD":
      return `${randomLetters(2)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`;

    // Massachusetts: Snnnnnnnnnn
    case "MA":
      return `${randomLetters(2)}${randomDigits(10)}`;

    // New Jersey: nnnnnnnnnnnnnnnnnn (18 digits)
    case "NJ":
      return `${randomDigits(18)}`;

    // Indiana: nnnn-nn-nnnn-nn
    case "IN":
      return `${randomDigits(4)}-${randomDigits(2)}-${randomDigits(4)}-${randomDigits(2)}`;

    // Connecticut: nnnnnnnnnnnn
    case "CT":
      return `${randomDigits(12)}`;

    // Minnesota: Lnnn-nnn-nnn-nnnn
    case "MN":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`;

    // Missouri: Lnnnnnnnnnn
    case "MO":
      return `${randomLetter()}${randomDigits(10)}`;

    // Wisconsin: Lnnn-nnnn-nnnn-nnnn
    case "WI":
      return `${randomLetter()}${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}-${randomDigits(4)}`;

    // Tennessee: nnnnnnnnnnnn
    case "TN":
      return `${randomDigits(12)}`;

    // South Carolina: nnnnnnnnnnnn
    case "SC":
      return `${randomDigits(12)}`;

    // Oregon: nnnnnnnnnnn
    case "OR":
      return `${randomDigits(11)}`;

    // Iowa: nnnLLnnnnnnn
    case "IA":
      return `${randomDigits(3)}${randomLetters(2)}${randomDigits(7)}`;

    // Kansas: Lnn-nn-nnnnnnn
    case "KS":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(2)}-${randomDigits(7)}`;

    // Kentucky: Lnn-nnn-nnnnnn
    case "KY":
      return `${randomLetter()}${randomDigits(2)}-${randomDigits(3)}-${randomDigits(6)}`;

    // Louisiana: 0nnnnnnnnn
    case "LA":
      return `0${randomDigits(9)}`;

    // Default: YYDDDLnnnnnnnnnnn
    default:
      return `${shortYear}${dayOfYear}${randomLetter()}${randomDigits(11)}`;
  }
}
