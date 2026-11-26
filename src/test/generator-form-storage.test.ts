import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_AAMVA_DATA } from "@/lib/aamvaData";
import { loadSavedGeneratorFormData, saveGeneratorFormData } from "@/lib/generatorFormStorage";

afterEach(() => {
  localStorage.clear();
});

describe("generator form storage", () => {
  it("returns null when no form has been saved", () => {
    expect(loadSavedGeneratorFormData()).toBeNull();
  });

  it("restores edited fields and optional address details", () => {
    const formData = {
      ...DEFAULT_AAMVA_DATA,
      stateCode: "AL",
      revisionId: "AL_2022",
      firstName: "ALICE",
      addressLine2: "APT 4",
    };

    saveGeneratorFormData(formData);

    expect(loadSavedGeneratorFormData()).toEqual(formData);
  });
});
