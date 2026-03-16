// AAMVA CDS (Card Design Standard) PDF417 Barcode Encoder
// Rebuilt with deterministic subfile/header builders for scanner reliability

import { getStateConfig } from "./stateConfigs";
import { AamvaEncodeInput, buildDlSubfile, buildHeader } from "./aamva/builders";

export function encodeAAMVA(
  data: AamvaEncodeInput,
  iin: string,
  aamvaVersionStr: string,
  jurisdictionVersionStr: string,
): string {
  const stateConfig = getStateConfig(data.stateCode);
  const fullStateName = stateConfig ? stateConfig.name : data.stateCode;

  const dlSubfile = buildDlSubfile({ data, fullStateName });

  const header = buildHeader({
    iin,
    aamvaVersion: aamvaVersionStr,
    jurisdictionVersion: jurisdictionVersionStr,
    dlSubfileLength: dlSubfile.length,
  });

  return header + dlSubfile;
}
