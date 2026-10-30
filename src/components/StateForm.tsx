import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle, Calculator, Info, Check, Star } from "lucide-react";
import { 
  EYE_COLORS, 
  EYE_COLORS_ON_DL,
  HAIR_COLORS, 
  HAIR_COLORS_ON_DL,
  GENDER_OPTIONS,
  COMPLIANCE_TYPES,
  RACE_OPTIONS,
  NAME_SUFFIXES,
  AAMVAData, 
  generateRandomData,
  inchesToCm,
  lbsToKg,
} from "@/lib/aamvaData";
import { generateDD, generateICN } from "@/lib/documentGenerators";
import { STATE_CONFIGS, StateConfig, StateRevision, getStateConfig } from "@/lib/stateConfigs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  generateDLNumber,
  generateFirstName,
  generateMiddleName,
  generateLastName,
  generateFirstMiddleName,
  calculateIssueDate,
  calculateExpiryDate,
} from "@/lib/calculators";

interface StateFormProps {
  data: AAMVAData;
  onChange: (data: AAMVAData) => void;
}

export function StateForm({ data, onChange }: StateFormProps) {
  const [stateConfig, setStateConfig] = useState<StateConfig | null>(null);
  const [revision, setRevision] = useState<StateRevision | null>(null);

  useEffect(() => {
    const config = getStateConfig(data.stateCode);
    if (config) {
      setStateConfig(config);
      const rev = config.revisions.find(r => r.id === data.revisionId) || config.revisions[0];
      setRevision(rev);
      if (rev && rev.id !== data.revisionId) {
        onChange({ ...data, revisionId: rev.id });
      }
    }
  }, [data.stateCode]);

  const updateField = (field: keyof AAMVAData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleStateChange = (stateCode: string) => {
    const config = getStateConfig(stateCode);
    if (config) {
      const rev = config.revisions[0];
      const revDateClean = rev.revisionDate.replace(/\//g, "");
      const stateDefaults = stateCode === "AB" ? {
        firstName: "LARRY", middleName: "PETER", lastName: "TERRELL", firstMiddleName: "",
        streetAddress: "452 SCIMITAR BAY NW", city: "CALGARY", postalCode: "T3L 1S7",
        dateOfBirth: "19890819", issueDate: "20210114", expirationDate: "20260819",
        licenseNumber: "165785-754", dlClass: "5", gender: "1", height: "175", weight: "169",
        documentDiscriminator: "0571-54946", restrictions: "NONE", endorsement: "NONE",
        eyeColor: "BRO", hairColor: "BRO", hairColorOnDL: "BRO",
      } : generateRandomData(stateCode);
      onChange({ ...data, ...stateDefaults, stateCode, revisionId: rev.id, revisionDate: revDateClean });
    }
  };

  const handleRevisionChange = (revisionId: string) => {
    if (stateConfig) {
      const rev = stateConfig.revisions.find(r => r.id === revisionId);
      if (rev) {
        setRevision(rev);
        const revDateClean = rev.revisionDate.replace(/\//g, "");
        onChange({ ...data, revisionId, revisionDate: revDateClean });
      }
    }
  };

  const handleRandomize = () => {
    const randomData = generateRandomData(data.stateCode);
    onChange({ ...data, ...randomData });
  };

  const handleGenerateDD = () => {
    if (!data.licenseNumber) { alert("Please enter DL Number first."); return; }
    updateField("documentDiscriminator", generateDD(data.stateCode, data.issueDate, data.expirationDate));
  };

  const handleGenerateICN = () => {
    if (!data.licenseNumber) { alert("Please enter DL Number first."); return; }
    updateField("inventoryControlNumber", generateICN(data.stateCode, data.licenseNumber, data.issueDate));
  };

  const handleCalcDLNumber = () => updateField("licenseNumber", generateDLNumber(data.stateCode));
  const handleCalcFirstName = () => updateField("firstName", generateFirstName(data.gender));
  const handleCalcMiddleName = () => updateField("middleName", generateMiddleName(data.gender));
  const handleCalcLastName = () => updateField("lastName", generateLastName());
  const handleCalcFirstMiddleName = () => updateField("firstMiddleName", generateFirstMiddleName(data.gender));
  const handleCalcBirthDate = () => {
    const generated = generateRandomData(data.stateCode);
    if (generated.dateOfBirth) updateField("dateOfBirth", generated.dateOfBirth);
  };

  const handleCalcIssueDate = () => {
    const issueDate = calculateIssueDate(data.stateCode);
    onChange({ ...data, issueDate, expirationDate: calculateExpiryDate(issueDate, data.stateCode, data.dateOfBirth) });
  };

  const handleCalcExpiryDate = () => {
    if (data.issueDate.length === 8) {
      updateField("expirationDate", calculateExpiryDate(data.issueDate, data.stateCode, data.dateOfBirth));
    }
  };

  const fields = revision?.fields;
  const isCanadian = stateConfig?.country === "Canada";
  const formatAlbertaLicense = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    return digits.length > 6 ? `${digits.slice(0, 6)}-${digits.slice(6)}` : digits;
  };
  const formatAlbertaDD = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
  };

  const CalcIcon = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="inline-flex ml-1 text-muted-foreground hover:text-primary" type="button">
      <Calculator className="h-3.5 w-3.5" />
    </button>
  );

  const InfoIcon = ({ text }: { text: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground ml-0.5 inline" />
      </TooltipTrigger>
      <TooltipContent><p className="text-xs">{text}</p></TooltipContent>
    </Tooltip>
  );

  // Scanner badges matching pdf417.pro exactly
  const scanners = [
    { name: "Scandit", variant: "outline" as const },
    { name: "Show-Me ID", variant: "warning" as const },
    { name: "FIDScan", variant: "outline" as const },
    { name: "Veriscan", variant: "outline" as const },
    { name: "Uscan.pro", variant: "outline" as const },
  ];

  return (
    <div className="overflow-visible font-mono">
      <div className="bg-white px-4 pb-7 pt-7 text-center sm:px-6">
        {/* State & revision selector row */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <Select value={data.stateCode} onValueChange={handleStateChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {STATE_CONFIGS.filter((state) => !state.comingSoon).map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {stateConfig && stateConfig.revisions.length > 1 && (
            <Select value={data.revisionId} onValueChange={handleRevisionChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stateConfig.revisions.map((rev) => (
                  <SelectItem key={rev.id} value={rev.id}>{rev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={handleRandomize} className="gap-1.5 rounded-full bg-card text-xs">
            <Shuffle className="h-3.5 w-3.5" />
            Random
          </Button>
        </div>

        {/* State name heading */}
        <h2 className="text-3xl font-medium tracking-tight text-slate-800 sm:text-4xl">{stateConfig?.name || "Select State"}</h2>
        
        {/* Revision info with gold star */}
        {revision && revision.displayRevision !== false && revision.revisionDate && (
          <p className="mt-2 text-base text-slate-700">
            Rev. {revision.revisionDate} ({revision.aamvaVersion}{revision.jurisdictionVersion})
            {revision.realIdCompliant && (
              <span
                role="img"
                aria-label="REAL ID Compliant"
                title="REAL ID Compliant"
                className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white align-middle"
              >
                <Star className="h-3 w-3 fill-current" />
              </span>
            )}
          </p>
        )}

        {/* Scanner badges - exactly like pdf417.pro */}
        <div className="mt-3 mb-2 flex flex-wrap items-center justify-center gap-2">
          {scanners.map((s) => (
            <span
              key={s.name}
              className={
                s.variant === "warning"
                  ? "scanner-badge-orange"
                  : "scanner-badge-green"
              }
            >
              {s.name} <Check className="h-3 w-3" />
            </span>
          ))}
        </div>
      </div>

      {/* Form fields - matching pdf417.pro exact layout */}
      <div className="space-y-5 rounded-md border border-slate-300 bg-slate-50 p-4 sm:p-6 lg:p-7">
        
        {/* Row 1: DL Number | First name | Last name | Middle name */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs flex items-center">
              DL Number <InfoIcon text="State-specific format" /> <CalcIcon onClick={handleCalcDLNumber} />
            </Label>
            <Input
              value={data.licenseNumber}
              onChange={(e) => updateField("licenseNumber", data.stateCode === "AB" ? formatAlbertaLicense(e.target.value) : e.target.value.toUpperCase())}
              placeholder={data.stateCode === "AB" ? "165785-754" : "D1234567"}
              className="h-9 text-sm mt-1"
            />
          </div>
          {fields?.hasFirstMiddleCombined ? (
            <>
              <div>
                <Label className="text-xs flex items-center">
                  Last name <CalcIcon onClick={handleCalcLastName} />
                </Label>
                <Input value={data.lastName} onChange={(e) => updateField("lastName", e.target.value.toUpperCase())} placeholder="Doe" className="h-9 text-sm mt-1" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <Label className="text-xs flex items-center">
                  First & Middle name <CalcIcon onClick={handleCalcFirstMiddleName} />
                </Label>
                <Input
                  value={data.firstMiddleName}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    const [firstName = "", middleName = ""] = value.split(",", 2).map((part) => part.trim());
                    onChange({ ...data, firstMiddleName: value, firstName, middleName });
                  }}
                  placeholder="JOHN,MICHAEL"
                  className="h-9 text-sm mt-1"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-xs flex items-center">
                  First name <CalcIcon onClick={handleCalcFirstName} />
                </Label>
                <Input value={data.firstName} onChange={(e) => updateField("firstName", e.target.value.toUpperCase())} placeholder="John" className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs flex items-center">
                  Last name <CalcIcon onClick={handleCalcLastName} />
                </Label>
                <Input value={data.lastName} onChange={(e) => updateField("lastName", e.target.value.toUpperCase())} placeholder="Doe" className="h-9 text-sm mt-1" />
              </div>
              {fields?.hasMiddleName !== false && (
                <div>
                  <Label className="text-xs flex items-center">
                    Middle name <InfoIcon text="Optional" /> <CalcIcon onClick={handleCalcMiddleName} />
                  </Label>
                  <Input value={data.middleName} onChange={(e) => updateField("middleName", e.target.value.toUpperCase())} placeholder="" className="h-9 text-sm mt-1" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Row 2: Address | City | Zip code | DL Class | Sex | Donor */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-3">
            <Label className="text-xs">Address</Label>
            <Input value={data.streetAddress} onChange={(e) => updateField("streetAddress", e.target.value.toUpperCase())} placeholder="516 Anson Ct" className="h-9 text-sm mt-1" />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <Label className="text-xs">City</Label>
            <Input value={data.city} onChange={(e) => updateField("city", e.target.value.toUpperCase())} placeholder="Ronhert Park" className="h-9 text-sm mt-1" />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <Label className="text-xs">Zip code</Label>
            <Input value={data.postalCode} onChange={(e) => updateField("postalCode", isCanadian ? e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 7) : e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder={isCanadian ? "A1A 1A1" : "875420000"} maxLength={isCanadian ? 7 : 9} className="h-9 text-sm mt-1" />
          </div>
          {fields?.hasDLClass && (
            <div className="col-span-1 lg:col-span-1">
              <Label className="text-xs">DL Class</Label>
              <Input value={data.dlClass} onChange={(e) => updateField("dlClass", e.target.value.toUpperCase())} placeholder="C" maxLength={5} className="h-9 text-sm mt-1" />
            </div>
          )}
          <div className="col-span-1 lg:col-span-2">
            <Label className="text-xs">Sex</Label>
            <Select value={data.gender} onValueChange={(v) => updateField("gender", v)}>
              <SelectTrigger className="h-9 text-sm mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((g) => (
                  <SelectItem key={g.code} value={g.code}>{g.short}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {fields?.hasDonor && (
            <div className="col-span-1 lg:col-span-2">
              <Label className="text-xs">Donor (Y/N)</Label>
              <Select value={data.donor} onValueChange={(v) => updateField("donor", v)}>
                <SelectTrigger className="h-9 text-sm mt-1" aria-label="Donor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">No</SelectItem>
                  <SelectItem value="Y">Yes</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Select <strong>Yes</strong> for organ donor, <strong>No</strong> otherwise. The underlying value stored is Y or N.
              </p>
            </div>
          )}
          <div className="hidden">
            <Label className="text-xs">Compliance Type</Label>
            <Select value={data.complianceType} onValueChange={(v) => updateField("complianceType", v)}>
              <SelectTrigger className="h-9 text-sm mt-1" aria-label="Compliance Type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPLIANCE_TYPES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-[11px] text-muted-foreground">
              <strong>F</strong> = Fully Compliant (REAL ID). Encoded in the barcode as DDA.
            </p>
          </div>
        </div>

        {/* Row 3: Birth date | Issue date | Expiry date | DD | ICN */}
        <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${fields?.ddInDetailsRow ? "lg:grid-cols-3" : "lg:grid-cols-5"}`}>
          <div>
            <Label className="text-xs flex items-center">
              Birth date <InfoIcon text={`${fields?.dateFormat === "YYYYMMDD" ? "YYYYMMDD" : "MMDDYYYY"} format`} /> <CalcIcon onClick={handleCalcBirthDate} />
            </Label>
            <Input value={data.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder={fields?.dateFormat === "YYYYMMDD" ? "19890819" : "01151970"} maxLength={8} className="h-9 text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs flex items-center">
              Issue date <InfoIcon text={fields?.dateFormat === "YYYYMMDD" ? "YYYYMMDD" : "MMDDYYYY"} /> <CalcIcon onClick={handleCalcIssueDate} />
            </Label>
            <Input value={data.issueDate} onChange={(e) => updateField("issueDate", e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder={fields?.dateFormat === "YYYYMMDD" ? "20210114" : "08262021"} maxLength={8} className="h-9 text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs flex items-center">
              Expiry date <InfoIcon text={`${fields?.dateFormat === "YYYYMMDD" ? "YYYYMMDD" : "MMDDYYYY"}; auto-calculated`} /> <CalcIcon onClick={handleCalcExpiryDate} />
            </Label>
            <Input value={data.expirationDate} onChange={(e) => updateField("expirationDate", e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder={fields?.dateFormat === "YYYYMMDD" ? "20260708" : "01152026"} maxLength={8} className="h-9 text-sm mt-1" />
          </div>
          {fields?.hasDD && !fields?.ddInDetailsRow && (
            <div>
              <Label className="text-xs flex items-center">
                DD <InfoIcon text="Document Discriminator" /> <CalcIcon onClick={handleGenerateDD} />
              </Label>
              <Input value={data.documentDiscriminator} onChange={(e) => updateField("documentDiscriminator", data.stateCode === "AB" ? formatAlbertaDD(e.target.value) : e.target.value)} placeholder={data.stateCode === "AB" ? "0571-54946" : "Click calculator"} className="h-9 text-[11px] mt-1" />
            </div>
          )}
          {fields?.hasICN && (
            <div>
              <Label className="text-xs flex items-center">
                ICN <InfoIcon text="Inventory Control Number" /> <CalcIcon onClick={handleGenerateICN} />
              </Label>
              <Input value={data.inventoryControlNumber} onChange={(e) => updateField("inventoryControlNumber", e.target.value)} placeholder="Click calculator" className="h-9 text-[11px] mt-1" />
            </div>
          )}
        </div>

        {/* Row 4: Restrictions | Endorsement | Height | Weight */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fields?.hasDD && fields?.ddInDetailsRow && (
            <div>
              <Label className="text-xs flex items-center">DD <InfoIcon text="Document Discriminator" /> <CalcIcon onClick={handleGenerateDD} /></Label>
              <Input value={data.documentDiscriminator} onChange={(e) => updateField("documentDiscriminator", data.stateCode === "AB" ? formatAlbertaDD(e.target.value) : e.target.value)} placeholder="0571-54946" className="h-9 text-[11px] mt-1" />
            </div>
          )}
          {fields?.hasRestrictions && (
            <div>
              <Label className="text-xs">Restrictions</Label>
              <Input value={data.restrictions} onChange={(e) => updateField("restrictions", e.target.value.toUpperCase())} placeholder="NONE" className="h-9 text-sm mt-1" />
            </div>
          )}
          {fields?.hasEndorsement && (
            <div>
              <Label className="text-xs">Endorsement</Label>
              <Input value={data.endorsement} onChange={(e) => updateField("endorsement", e.target.value.toUpperCase())} placeholder="NONE" className="h-9 text-sm mt-1" />
            </div>
          )}
          <div>
            <Label className="text-xs">Height ({fields?.heightUnit === "cm" ? "cm" : "in."})</Label>
            <div className="relative">
              <Input value={data.height} onChange={(e) => updateField("height", e.target.value.replace(/\D/g, "").slice(0, fields?.heightUnit === "cm" ? 3 : 2))} placeholder={fields?.heightUnit === "cm" ? "175" : "69"} maxLength={fields?.heightUnit === "cm" ? 3 : 2} className="h-9 text-sm mt-1 pr-16" />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground mt-0.5">
                {fields?.heightUnit === "cm" ? "cm" : `≈ ${inchesToCm(parseInt(data.height) || 0)} cm`}
              </span>
            </div>
          </div>
          {fields?.hasWeight && !fields?.weightInAppearanceRow && (
            <div>
            <Label className="text-xs">Weight ({fields?.weightUnit === "kg" ? "kg." : "lb."})</Label>
              <div className="relative">
                <Input value={data.weight} onChange={(e) => updateField("weight", e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="169" maxLength={3} className="h-9 text-sm mt-1 pr-16" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground mt-0.5">
                  {fields?.weightUnit === "kg" ? "kg" : `≈ ${lbsToKg(parseInt(data.weight) || 0)} kg`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Eye/Hair Colors - 4 cols like pdf417.pro */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fields?.hasWeight && fields?.weightInAppearanceRow && (
            <div>
              <Label className="text-xs">Weight ({fields?.weightUnit === "kg" ? "kg." : "lb."})</Label>
              <div className="relative">
                <Input value={data.weight} onChange={(e) => updateField("weight", e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="169" maxLength={3} className="h-9 text-sm mt-1 pr-16" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground mt-0.5">≈ {lbsToKg(parseInt(data.weight) || 0)} kg</span>
              </div>
            </div>
          )}
          {fields?.hasEyeColorOnDL && (
            <div>
              <Label className="text-xs">Eye (as on DL)</Label>
              <Select value={data.eyeColorOnDL} onValueChange={(v) => updateField("eyeColorOnDL", v)}>
                <SelectTrigger className="h-9 text-xs mt-1">
                  <SelectValue placeholder="== Select ==" />
                </SelectTrigger>
                <SelectContent>
                  {EYE_COLORS_ON_DL.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {fields?.hasEyeColor && (
            <div>
              <Label className="text-xs">Eye (ANSI D-20)</Label>
              <Select value={data.eyeColor} onValueChange={(v) => updateField("eyeColor", v)}>
                <SelectTrigger className="h-9 text-xs mt-1">
                  <SelectValue placeholder="== Select ==" />
                </SelectTrigger>
                <SelectContent>
                  {EYE_COLORS.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {fields?.hasHairColorOnDL && (
            <div>
              <Label className="text-xs">Hair (as on DL)</Label>
              <Select value={data.hairColorOnDL} onValueChange={(v) => updateField("hairColorOnDL", v)}>
                <SelectTrigger className="h-9 text-xs mt-1">
                  <SelectValue placeholder="== Select ==" />
                </SelectTrigger>
                <SelectContent>
                  {HAIR_COLORS_ON_DL.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {fields?.hasHairColor && (
            <div>
              <Label className="text-xs">Hair (ANSI D-20)</Label>
              <Select value={data.hairColor} onValueChange={(v) => updateField("hairColor", v)}>
                <SelectTrigger className="h-9 text-xs mt-1">
                  <SelectValue placeholder="== Select ==" />
                </SelectTrigger>
                <SelectContent>
                  {HAIR_COLORS.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {fields?.hasAddressLine2 && (
            <div>
              <Label className="text-xs">Address (2nd line)</Label>
              <Input value={data.addressLine2 ?? ""} onChange={(e) => updateField("addressLine2", e.target.value.toUpperCase())} placeholder="Unit 4" className="h-9 text-sm mt-1" />
            </div>
          )}
        </div>

        {/* Row 6: Race, Name Suffix, Revision Date, Safe Driver (conditional) */}
        {(fields?.hasRace || fields?.hasNameSuffix || fields?.hasSafeDriver || fields?.hasRevisionDate) && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fields?.hasRace && (
              <div>
                <Label className="text-xs">Race (ANSI D-20)</Label>
                <Select value={data.race} onValueChange={(v) => updateField("race", v)}>
                  <SelectTrigger className="h-9 text-xs mt-1">
                    <SelectValue placeholder="== Select ==" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACE_OPTIONS.map((r) => (
                      <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {fields?.hasNameSuffix && (
              <div>
                <Label className="text-xs">Name Suffix</Label>
                <Select value={data.nameSuffix} onValueChange={(v) => updateField("nameSuffix", v)}>
                  <SelectTrigger className="h-9 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NAME_SUFFIXES.map((s) => (
                      <SelectItem key={s.code || "none"} value={s.code}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {fields?.hasRevisionDate && fields.revisionDates && (
              <div>
                <Label className="text-xs">Revision date</Label>
                <Select value={data.revisionDate} onValueChange={(v) => updateField("revisionDate", v)}>
                  <SelectTrigger className="h-9 text-xs mt-1">
                    <SelectValue placeholder="== Select ==" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.revisionDates.map((rd) => (
                      <SelectItem key={rd} value={rd}>{rd}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {fields?.hasSafeDriver && (
              <div>
                <Label className="text-xs">Safe Driver</Label>
                <Select value={data.safeDriver} onValueChange={(v) => updateField("safeDriver", v)}>
                  <SelectTrigger className="h-9 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Create button - centered like pdf417.pro */}
        <div className="flex justify-center pt-4 pb-2">
          <Button className="h-11 rounded-full px-10 text-sm font-semibold shadow-md shadow-primary/20">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
