import { FALLBACKS } from "./constants";

export function padZero(num: number, len: number = 2): string {
  return num.toString().padStart(len, "0");
}

export function sanitizeText(value: string, maxLen = 128): string {
  return (value || "")
    .replace(/[\r\n\x1e]/g, " ")
    .trim()
    .substring(0, maxLen);
}

export function sanitizeUpper(value: string, maxLen = 128): string {
  return sanitizeText(value, maxLen).toUpperCase();
}

export function sanitizeDigits(value: string, maxLen: number): string {
  return (value || "").replace(/\D/g, "").substring(0, maxLen);
}

export function ensureDateMMDDYYYY(value: string, fallback: string): string {
  const cleaned = sanitizeDigits(value, 8);
  return cleaned.length === 8 ? cleaned : fallback;
}

export function formatHeightInches(value: string): string {
  const inches = parseInt(sanitizeDigits(value, 3), 10);
  const normalized = Number.isNaN(inches) ? FALLBACKS.HEIGHT_INCHES : inches;
  return `${padZero(normalized, 3)} in`;
}

export function formatWeight(value: string): string {
  const cleaned = sanitizeDigits(value, 3);
  return cleaned ? cleaned.padStart(3, "0") : "";
}

export function normalizeStateCode(value: string): string {
  const cleaned = sanitizeUpper(value, 2).replace(/[^A-Z]/g, "");
  return cleaned.length === 2 ? cleaned : FALLBACKS.STATE;
}

export function normalizePostalCode(value: string): string {
  const cleaned = sanitizeDigits(value, 9);
  if (cleaned.length >= 5) return cleaned;
  return FALLBACKS.POSTAL_CODE;
}

export function normalizeAlphanumeric(value: string, minLen: number, maxLen: number, fallbackLength: number): string {
  const cleaned = (value || "").replace(/[^A-Z0-9]/gi, "").toUpperCase().substring(0, maxLen);
  if (cleaned.length >= minLen) return cleaned;
  return randomAlphanumeric(fallbackLength);
}

export function randomAlphanumeric(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
