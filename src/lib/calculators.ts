// Calculator utilities for DL form fields

const FIRST_NAMES_MALE = ["JAMES", "JOHN", "ROBERT", "MICHAEL", "WILLIAM", "DAVID", "RICHARD", "JOSEPH", "THOMAS", "CHARLES", "CHRISTOPHER", "DANIEL", "MATTHEW", "ANTHONY", "MARK"];
const FIRST_NAMES_FEMALE = ["MARY", "PATRICIA", "JENNIFER", "LINDA", "ELIZABETH", "BARBARA", "SUSAN", "JESSICA", "SARAH", "KAREN", "LISA", "NANCY", "BETTY", "MARGARET", "SANDRA"];
const MIDDLE_NAMES_MALE = ["ALLEN", "BRIAN", "CHARLES", "DANIEL", "EDWARD", "FRANK", "GEORGE", "HENRY", "IVAN", "JACK", "KENNETH", "LOUIS", "MARTIN", "NATHAN", "OLIVER"];
const MIDDLE_NAMES_FEMALE = ["ANN", "BETH", "CLAIRE", "DIANE", "EVE", "GRACE", "HELEN", "IRIS", "JANE", "KATE", "LYNN", "MARIE", "NICOLE", "PAIGE", "ROSE"];
const LAST_NAMES = ["SMITH", "JOHNSON", "WILLIAMS", "BROWN", "JONES", "GARCIA", "MILLER", "DAVIS", "RODRIGUEZ", "MARTINEZ", "HERNANDEZ", "LOPEZ", "GONZALEZ", "WILSON", "ANDERSON", "THOMAS", "TAYLOR", "MOORE", "JACKSON", "MARTIN"];

const randomChoice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const padZero = (num: number, len: number = 2) => num.toString().padStart(len, "0");

// ===================== NAME CALCULATORS =====================

export function generateFirstName(gender?: string): string {
  if (gender === "2") return randomChoice(FIRST_NAMES_FEMALE);
  if (gender === "1") return randomChoice(FIRST_NAMES_MALE);
  return randomChoice([...FIRST_NAMES_MALE, ...FIRST_NAMES_FEMALE]);
}

export function generateMiddleName(gender?: string): string {
  if (gender === "2") return randomChoice(MIDDLE_NAMES_FEMALE);
  if (gender === "1") return randomChoice(MIDDLE_NAMES_MALE);
  return randomChoice([...MIDDLE_NAMES_MALE, ...MIDDLE_NAMES_FEMALE]);
}

export function generateLastName(): string {
  return randomChoice(LAST_NAMES);
}

export function generateFirstMiddleName(gender?: string): string {
  return `${generateFirstName(gender)},${generateMiddleName(gender)}`;
}

// ===================== DL NUMBER CALCULATORS =====================

// State-specific DL number formats
export function generateDLNumber(stateCode: string): string {
  switch (stateCode) {
    case "AB": return `1${randomNum(10000, 99999)}-${randomNum(100, 999)}`;
    case "MB": return `${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}-${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}-${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}-${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(100, 999)}${String.fromCharCode(65 + randomNum(0, 25))}${Math.random() < 0.5 ? String.fromCharCode(65 + randomNum(0, 25)) : randomNum(0, 9)}`;
    case "ON": return `${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(1000, 9999)}-${randomNum(10000, 99999)}-${randomNum(10000, 99999)}`;
    case "QC": return `${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(1000, 9999)}-${randomNum(100000, 999999)}-${randomNum(10, 99)}`;
    case "SK": return `${randomNum(10000000, 99999999)}`;
    case "YT": return `${randomNum(100000, 999999)}`;
    case "AL": return `${randomNum(1000000, 9999999)}`;
    case "AK": return `${randomNum(1000000, 9999999)}`;
    case "AZ": return `${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(10000000, 99999999)}`;
    case "AR": return `${randomNum(100000000, 999999999)}`;
    case "CA": return `${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(1000000, 9999999)}`;
    case "CO": return `${randomNum(10, 99)}-${randomNum(100, 999)}-${randomNum(1000, 9999)}`;
    case "CT": return `${randomNum(100000000, 999999999)}`;
    case "DE": return `${randomNum(1000000, 9999999)}`;
    case "DC": return `${randomNum(1000000, 9999999)}`;
    case "FL": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100, 999)}-${randomNum(100, 999)}-${randomNum(10, 99)}-${randomNum(100, 999)}-${randomNum(0, 9)}`;
    }
    case "GA": return `${randomNum(100000000, 999999999)}`;
    case "HI": return `H${randomNum(10000000, 99999999)}`;
    case "ID": {
      const letters = `${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}`;
      return `${letters}${randomNum(100000, 999999)}${String.fromCharCode(65 + randomNum(0, 25))}`;
    }
    case "IL": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100, 999)}-${randomNum(1000, 9999)}-${randomNum(1000, 9999)}`;
    }
    case "IN": return `${randomNum(1000, 9999)}-${randomNum(10, 99)}-${randomNum(1000, 9999)}`;
    case "IA": return `${randomNum(100, 999)}${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(1000, 9999)}`;
    case "KS": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(10, 99)}-${randomNum(10, 99)}-${randomNum(1000, 9999)}`;
    }
    case "KY": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(10, 99)}-${randomNum(100, 999)}-${randomNum(100, 999)}`;
    }
    case "LA": return `0${randomNum(0, 1)}${randomNum(100000, 999999)}`;
    case "ME": return `${randomNum(1000000, 9999999)}`;
    case "MD": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}-${randomNum(100, 999)}-${randomNum(100, 999)}-${randomNum(100, 999)}-${randomNum(100, 999)}`;
    }
    case "MA": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `S${randomNum(10000000, 99999999)}`;
    }
    case "MI": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter} ${randomNum(100, 999)} ${randomNum(100, 999)} ${randomNum(100, 999)} ${randomNum(100, 999)}`;
    }
    case "MN": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100, 999)}-${randomNum(100, 999)}-${randomNum(100, 999)}-${randomNum(100, 999)}`;
    }
    case "MS": return `${randomNum(100, 999)}-${randomNum(10, 99)}-${randomNum(1000, 9999)}`;
    case "MO": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100000000, 999999999)}`;
    }
    case "MT": return `${randomNum(1000000000000, 9999999999999)}`;
    case "NE": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(10000000, 99999999)}`;
    }
    case "NV": return `${randomNum(1000000000, 9999999999)}`;
    case "NH": return `${randomNum(10, 99)}${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(10000, 99999)}`;
    case "NJ": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(1000, 9999)} ${randomNum(10000, 99999)} ${randomNum(10000, 99999)}`;
    }
    case "NM": return `${randomNum(100000000, 999999999)}`;
    case "NY": return `${randomNum(100, 999)} ${randomNum(100, 999)} ${randomNum(100, 999)}`;
    case "NC": return `${randomNum(100000000000, 999999999999)}`;
    case "ND": {
      const letters = `${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}`;
      return `${letters}-${randomNum(100000, 999999)}`;
    }
    case "OH": {
      const letters = `${String.fromCharCode(65 + randomNum(0, 25))}${String.fromCharCode(65 + randomNum(0, 25))}`;
      return `${letters}${randomNum(100000, 999999)}`;
    }
    case "OK": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100000000, 999999999)}`;
    }
    case "OR": return `${randomNum(1000000, 9999999)}`;
    case "PA": return `${randomNum(10000000, 99999999)}`;
    case "RI": return `${randomNum(1000000, 9999999)}`;
    case "SC": return `${randomNum(100000000, 999999999)}`;
    case "SD": return `${randomNum(100000000, 999999999)}`;
    case "TN": return `${randomNum(100000000, 999999999)}`;
    case "TX": return `${randomNum(10000000, 99999999)}`;
    case "UT": return `${randomNum(1000000000, 9999999999)}`;
    case "VT": return `${randomNum(10000000, 99999999)}`;
    case "VA": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(10, 99)}-${randomNum(10, 99)}-${randomNum(1000, 9999)}`;
    }
    case "WA": {
      const letters = Array.from({ length: 5 }, () => String.fromCharCode(65 + randomNum(0, 25))).join("");
      return `${letters}${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(100, 999)}${String.fromCharCode(65 + randomNum(0, 25))}${randomNum(0, 9)}`;
    }
    case "WV": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100000, 999999)}`;
    }
    case "WI": {
      const letter = String.fromCharCode(65 + randomNum(0, 25));
      return `${letter}${randomNum(100, 999)}-${randomNum(1000, 9999)}-${randomNum(1000, 9999)}-${randomNum(10, 99)}`;
    }
    case "WY": return `${randomNum(100000, 999999)}-${randomNum(100, 999)}`;
    default: return `${randomNum(10000000, 99999999)}`;
  }
}

// ===================== DATE CALCULATORS =====================

// Generate a random issue date between 2021 and current year
export function calculateIssueDate(stateCode?: string): string {
  const currentYear = new Date().getFullYear();
  const minYear = 2021;
  const maxYear = Math.min(currentYear, 2026);
  const year = randomNum(minYear, maxYear);
  const month = randomNum(1, 12);
  const day = randomNum(1, 28);
  const canadianStates = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];
  return canadianStates.includes(stateCode || "") ? `${year}${padZero(month)}${padZero(day)}` : `${padZero(month)}${padZero(day)}${year}`;
}

// Calculate expiry date based on issue date and state rules
// Most states have 4-8 year validity periods
export function calculateExpiryDate(issueDate: string, stateCode: string, dateOfBirth?: string): string {
  if (issueDate.length !== 8) return "";
  
  const isCanadianDate = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"].includes(stateCode);
  const issueMonth = parseInt(isCanadianDate ? issueDate.substring(4, 6) : issueDate.substring(0, 2));
  const issueDay = parseInt(isCanadianDate ? issueDate.substring(6, 8) : issueDate.substring(2, 4));
  const issueYear = parseInt(isCanadianDate ? issueDate.substring(0, 4) : issueDate.substring(4, 8));
  
  // State-specific validity periods (years)
  const validityPeriods: Record<string, number> = {
    AB: 5, AL: 4, AK: 5, AZ: 8, AR: 8, CA: 5, CO: 5, CT: 6, DE: 8, DC: 8, FL: 8,
    GA: 8, HI: 8, ID: 8, IL: 4, IN: 6, IA: 8, KS: 6, KY: 8, LA: 6, ME: 6,
    MD: 8, MA: 5, MI: 4, MN: 4, MS: 4, MO: 6, MT: 8, NE: 5, NV: 8, NH: 5,
    NJ: 4, NM: 4, NY: 8, NC: 8, ND: 6, OH: 4, OK: 4, OR: 8, PA: 4, RI: 5,
    SC: 10, SD: 5, TN: 8, TX: 8, UT: 5, VT: 4, VA: 8, WA: 6, WV: 8, WI: 8, WY: 4,
  };
  
  const years = validityPeriods[stateCode] || 5;
  
  // Some states expire on birthday - use DOB month/day if available
  if (dateOfBirth && dateOfBirth.length === 8 && ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT", "CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"].includes(stateCode)) {
    const dobMonth = isCanadianDate ? parseInt(dateOfBirth.substring(4, 6)) : parseInt(dateOfBirth.substring(0, 2));
    const dobDay = isCanadianDate ? parseInt(dateOfBirth.substring(6, 8)) : parseInt(dateOfBirth.substring(2, 4));
    let expiryYear = issueYear + years;
    if (isCanadianDate) return `${expiryYear}${padZero(dobMonth)}${padZero(dobDay)}`;
    return `${padZero(dobMonth)}${padZero(dobDay)}${expiryYear}`;
  }
  
  const expiryYear = issueYear + years;
  return `${padZero(issueMonth)}${padZero(issueDay)}${expiryYear}`;
}
