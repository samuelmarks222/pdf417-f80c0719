import { AAMVAData, DEFAULT_AAMVA_DATA } from "@/lib/aamvaData";

const STORAGE_KEY = "pdf417.generator-form-data.v1";
const FORM_DATA_KEYS = Object.keys(DEFAULT_AAMVA_DATA) as (keyof AAMVAData)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function loadSavedGeneratorFormData(): AAMVAData | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === null) return null;

  const parsed: unknown = JSON.parse(saved);
  if (!isRecord(parsed) || typeof parsed.stateCode !== "string" || typeof parsed.revisionId !== "string") {
    throw new Error("Saved generator form data has an invalid shape.");
  }

  const restored = { ...DEFAULT_AAMVA_DATA };
  for (const key of FORM_DATA_KEYS) {
    const value = parsed[key];
    if (value === undefined) continue;
    if (typeof value !== "string") {
      throw new Error(`Saved generator field "${key}" is not valid.`);
    }
    restored[key] = value;
  }

  if (parsed.addressLine2 !== undefined) {
    if (typeof parsed.addressLine2 !== "string") {
      throw new Error('Saved generator field "addressLine2" is not valid.');
    }
    restored.addressLine2 = parsed.addressLine2;
  }

  return restored;
}

export function saveGeneratorFormData(data: AAMVAData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
