import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle, Calculator, Info, Check } from "lucide-react";
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
      onChange({ ...data, stateCode, revisionId: rev.id, revisionDate: revDateClean });
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
    updateField("documentDiscriminator", generateDD(data.stateCode, data.issueDate));
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

  const handleCalcIssueDate = () => {
    const issueDate = calculateIssueDate();
    onChange({ ...data, issueDate, expirationDate: calculateExpiryDate(issueDate, data.stateCode, data.dateOfBirth) });
  };

  const handleCalcExpiryDate = () => {
    if (data.issueDate.length === 8) {
      updateField("expirationDate", calculateExpiryDate(data.issueDate, data.stateCode, data.dateOfBirth));
    }
  };

  const fields = revision?.fields;

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
    <div className="border border-border rounded-lg bg-card">
      {/* Header section - centered like pdf417.pro */}
      <div className="text-center pt-6 pb-2 px-6">
        {/* State & revision selector row */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Select value={data.stateCode} onValueChange={handleStateChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {STATE_CONFIGS.map((state) => (
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
          <Button variant="outline" size="sm" onClick={handleRandomize} className="gap-1.5 text-xs">
            <Shuffle className="h-3.5 w-3.5" />
            Random
          </Button>
        </div>

        {/* State name heading */}
        <h2 className="text-3xl font-bold tracking-tight">{stateConfig?.name || "Select State"}</h2>
        
        {/* Revision info with gold star */}
        {revision && (
          <p className="text-sm text-muted-foreground mt-1">
            Rev. {revision.revisionDate} ({revision.aamvaVersion}{revision.jurisdictionVersion})
            {revision.realIdCompliant && (
              <span className="ml-2 inline-block">
                <img 
                  src="https://www.keesingtechnologies.com/wp-content/uploads/2020/11/realid-gold-star-circle.svg" 
                  alt="REAL ID Compliant" 
                  className="inline h-5 w-5"
                />
              </span>
            )}
          </p>
        )}

        {/* Scanner badges - exactly like pdf417.pro */}
        <div className="flex items-center justify-center gap-2 mt-3 mb-2">
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
      <div className="px-6 pb-6 space-y-3">
        
        {/* Row 1: DL Number | First name | Last name | Middle name */}
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label className="text-xs flex items-center">
              DL Number <InfoIcon text="State-specific format" /> <CalcIcon onClick={handleCalcDLNumber} />
            </Label>
            <Input
              value={data.licenseNumber}
              onChange={(e) => updateField("licenseNumber", e.target.value.toUpperCase())}
              placeholder="D1234567"
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
              <div className="col-span-2">
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
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3">
            <Label className="text-xs">Address</Label>
            <Input value={data.streetAddress} onChange={(e) => updateField("streetAddress", e.target.value.toUpperCase())} placeholder="516 Anson Ct" className="h-9 text-sm mt-1" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">City</Label>
            <Input value={data.city} onChange={(e) => updateField("city", e.target.value.toUpperCase())} placeholder="Ronhert Park" className="h-9 text-sm mt-1" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Zip code</Label>
            <Input value={data.postalCode} onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="875420000" maxLength={9} className="h-9 text-sm mt-1" />
          </div>
          {fields?.hasDLClass && (
            <div className="col-span-1">
              <Label className="text-xs">DL Class</Label>
              <Input value={data.dlClass} onChange={(e) => updateField("dlClass", e.target.value.toUpperCase())} placeholder="C" maxLength={5} className="h-9 text-sm mt-1" />
            </div>
          )}
          <div className="col-span-2">
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
            <div className="col-span-2">
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
        </div>

        {/* Row 3: Birth date | Issue date | Expiry date | DD | ICN */}
        <div className="grid grid-cols-5 gap-3">
          <div>
            <Label className="text-xs flex items-center">
              Birth date <InfoIcon text="MMDDYYYY format" /> <CalcIcon onClick={() => {}} />
            </Label>
            <Input value={data.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="01151970" maxLength={8} className="h-9 text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs flex items-center">
              Issue date <InfoIcon text="MMDDYYYY" /> <CalcIcon onClick={handleCalcIssueDate} />
            </Label>
            <Input value={data.issueDate} onChange={(e) => updateField("issueDate", e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="08262021" maxLength={8} className="h-9 text-sm mt-1" />
          </div>
          <div>
            <Label className="text-xs flex items-center">
              Expiry date <InfoIcon text="Auto-calculate from issue date" /> <CalcIcon onClick={handleCalcExpiryDate} />
            </Label>
            <Input value={data.expirationDate} onChange={(e) => updateField("expirationDate", e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="01152026" maxLength={8} className="h-9 text-sm mt-1" />
          </div>
          {fields?.hasDD && (
            <div>
              <Label className="text-xs flex items-center">
                DD <InfoIcon text="Document Discriminator" /> <CalcIcon onClick={handleGenerateDD} />
              </Label>
              <Input value={data.documentDiscriminator} onChange={(e) => updateField("documentDiscriminator", e.target.value)} placeholder="Click calculator" className="h-9 text-[11px] mt-1" />
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
        <div className="grid grid-cols-4 gap-3">
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
            <Label className="text-xs">Height (in.)</Label>
            <div className="relative">
              <Input value={data.height} onChange={(e) => updateField("height", e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="69" maxLength={2} className="h-9 text-sm mt-1 pr-16" />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground mt-0.5">
                ≈ {inchesToCm(parseInt(data.height) || 0)} cm
              </span>
            </div>
          </div>
          {fields?.hasWeight && (
            <div>
              <Label className="text-xs">Weight (lb.)</Label>
              <div className="relative">
                <Input value={data.weight} onChange={(e) => updateField("weight", e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="169" maxLength={3} className="h-9 text-sm mt-1 pr-16" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground mt-0.5">
                  ≈ {lbsToKg(parseInt(data.weight) || 0)} kg
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Eye/Hair Colors - 4 cols like pdf417.pro */}
        <div className="grid grid-cols-4 gap-3">
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
        </div>

        {/* Row 6: Race, Name Suffix, Revision Date, Safe Driver (conditional) */}
        {(fields?.hasRace || fields?.hasNameSuffix || fields?.hasSafeDriver || fields?.hasRevisionDate) && (
          <div className="grid grid-cols-4 gap-3">
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
          <Button className="px-10 h-10 text-sm font-semibold">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
