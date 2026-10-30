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
    case "LA": return `0${randomNum(10000000, 99999999)}`;
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

type ExpirationAnchor = "issue-date" | "birthday" | "day-after-birthday" | "end-of-month" | "age-65";

interface ExpirationRule {
  anchor: ExpirationAnchor;
  years: number;
}

const EXPIRATION_RULES: Record<string, ExpirationRule> = {
  AL: { anchor: "issue-date", years: 4 }, AK: { anchor: "birthday", years: 5 }, AZ: { anchor: "age-65", years: 0 },
  AR: { anchor: "birthday", years: 8 }, CA: { anchor: "birthday", years: 5 }, CO: { anchor: "birthday", years: 5 },
  CT: { anchor: "birthday", years: 6 }, DE: { anchor: "birthday", years: 8 }, DC: { anchor: "birthday", years: 8 },
  FL: { anchor: "birthday", years: 8 }, GA: { anchor: "birthday", years: 8 }, HI: { anchor: "birthday", years: 8 },
  ID: { anchor: "birthday", years: 8 }, IL: { anchor: "birthday", years: 4 }, IN: { anchor: "birthday", years: 6 },
  IA: { anchor: "birthday", years: 5 }, KS: { anchor: "birthday", years: 6 }, KY: { anchor: "issue-date", years: 4 },
  LA: { anchor: "birthday", years: 6 }, ME: { anchor: "birthday", years: 6 }, MD: { anchor: "birthday", years: 8 },
  MA: { anchor: "birthday", years: 5 }, MI: { anchor: "birthday", years: 4 }, MN: { anchor: "birthday", years: 4 },
  MS: { anchor: "issue-date", years: 4 }, MO: { anchor: "birthday", years: 6 }, MT: { anchor: "birthday", years: 8 },
  NE: { anchor: "birthday", years: 5 }, NV: { anchor: "birthday", years: 8 }, NH: { anchor: "birthday", years: 5 },
  NJ: { anchor: "birthday", years: 4 }, NM: { anchor: "birthday", years: 4 }, NY: { anchor: "birthday", years: 8 },
  NC: { anchor: "birthday", years: 8 }, ND: { anchor: "birthday", years: 6 }, OH: { anchor: "birthday", years: 4 },
  OK: { anchor: "end-of-month", years: 4 }, OR: { anchor: "birthday", years: 8 }, PA: { anchor: "day-after-birthday", years: 4 },
  RI: { anchor: "birthday", years: 5 }, SC: { anchor: "birthday", years: 8 }, SD: { anchor: "birthday", years: 5 },
  TN: { anchor: "birthday", years: 8 }, TX: { anchor: "birthday", years: 8 }, UT: { anchor: "birthday", years: 5 },
  VT: { anchor: "birthday", years: 4 }, VA: { anchor: "birthday", years: 8 }, WA: { anchor: "birthday", years: 6 },
  WV: { anchor: "end-of-month", years: 5 }, WI: { anchor: "birthday", years: 8 }, WY: { anchor: "birthday", years: 5 },
};

const CANADIAN_CODES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

function formatCalculatedDate(date: Date, canadian: boolean): string {
  const year = date.getFullYear().toString();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  return canadian ? `${year}${month}${day}` : `${month}${day}${year}`;
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
  if (result.getMonth() !== date.getMonth()) result.setDate(0);
  return result;
}

// Calculate expiry date using each jurisdiction's supplied anchor and validity rule.
export function calculateExpiryDate(issueDate: string, stateCode: string, dateOfBirth?: string): string {
  if (issueDate.length !== 8) return "";

  const isCanadianDate = CANADIAN_CODES.includes(stateCode);
  const issueMonth = parseInt(isCanadianDate ? issueDate.substring(4, 6) : issueDate.substring(0, 2));
  const issueDay = parseInt(isCanadianDate ? issueDate.substring(6, 8) : issueDate.substring(2, 4));
  const issueYear = parseInt(isCanadianDate ? issueDate.substring(0, 4) : issueDate.substring(4, 8));

  const suppliedRule = EXPIRATION_RULES[stateCode];
  const rule = suppliedRule || (isCanadianDate ? { anchor: "birthday" as const, years: 5 } : { anchor: "issue-date" as const, years: 5 });
  const issue = new Date(issueYear, issueMonth - 1, issueDay);
  if (!dateOfBirth || dateOfBirth.length !== 8) {
    return formatCalculatedDate(addYears(issue, rule.years || 5), isCanadianDate);
  }

  const dobMonth = isCanadianDate ? parseInt(dateOfBirth.substring(4, 6)) : parseInt(dateOfBirth.substring(0, 2));
  const dobDay = isCanadianDate ? parseInt(dateOfBirth.substring(6, 8)) : parseInt(dateOfBirth.substring(2, 4));
  const dobYear = isCanadianDate ? parseInt(dateOfBirth.substring(0, 4)) : parseInt(dateOfBirth.substring(4, 8));

  if (rule.anchor === "issue-date") return formatCalculatedDate(addYears(issue, rule.years), isCanadianDate);

  if (rule.anchor === "age-65") {
    let targetYear = dobYear + 65;
    while (targetYear <= issueYear) targetYear += 5;
    return formatCalculatedDate(new Date(targetYear, dobMonth - 1, dobDay), isCanadianDate);
  }

  let target = new Date(issueYear + rule.years, dobMonth - 1, dobDay);
  if (rule.anchor === "end-of-month") target = new Date(issueYear + rule.years, dobMonth, 0);
  if (rule.anchor === "day-after-birthday") target.setDate(target.getDate() + 1);
  return formatCalculatedDate(target, isCanadianDate);
}
