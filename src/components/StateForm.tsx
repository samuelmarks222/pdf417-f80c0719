import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Shuffle, Calculator, Info } from "lucide-react";
import { 
  EYE_COLORS, 
  EYE_COLORS_ON_DL,
  HAIR_COLORS, 
  HAIR_COLORS_ON_DL,
  GENDER_OPTIONS,
  RACE_OPTIONS,
  NAME_SUFFIXES,
  DL_CLASSES,
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
      onChange({ 
        ...data, 
        stateCode, 
        revisionId: rev.id,
      });
    }
  };

  const handleRevisionChange = (revisionId: string) => {
    if (stateConfig) {
      const rev = stateConfig.revisions.find(r => r.id === revisionId);
      if (rev) {
        setRevision(rev);
        onChange({ ...data, revisionId });
      }
    }
  };

  const handleRandomize = () => {
    const randomData = generateRandomData(data.stateCode);
    onChange({ ...data, ...randomData });
  };

  const handleGenerateDD = () => {
    if (!data.firstName && !data.firstMiddleName) {
      alert("Please enter First Name before generating DD.");
      return;
    }
    if (!data.lastName) {
      alert("Please enter Last Name before generating DD.");
      return;
    }
    if (!data.licenseNumber) {
      alert("Please enter DL Number before generating DD.");
      return;
    }
    updateField("documentDiscriminator", generateDD(data.stateCode, data.issueDate));
  };

  const handleGenerateICN = () => {
    if (!data.firstName && !data.firstMiddleName) {
      alert("Please enter First Name before generating ICN.");
      return;
    }
    if (!data.lastName) {
      alert("Please enter Last Name before generating ICN.");
      return;
    }
    if (!data.licenseNumber) {
      alert("Please enter DL Number before generating ICN.");
      return;
    }
    updateField("inventoryControlNumber", generateICN(data.stateCode, data.licenseNumber, data.issueDate));
  };

  const handleCalcDLNumber = () => {
    updateField("licenseNumber", generateDLNumber(data.stateCode));
  };

  const handleCalcFirstName = () => {
    updateField("firstName", generateFirstName(data.gender));
  };

  const handleCalcMiddleName = () => {
    updateField("middleName", generateMiddleName(data.gender));
  };

  const handleCalcLastName = () => {
    updateField("lastName", generateLastName());
  };

  const handleCalcFirstMiddleName = () => {
    updateField("firstMiddleName", generateFirstMiddleName(data.gender));
  };

  const handleCalcIssueDate = () => {
    const issueDate = calculateIssueDate();
    onChange({ 
      ...data, 
      issueDate,
      expirationDate: calculateExpiryDate(issueDate, data.stateCode, data.dateOfBirth),
    });
  };

  const handleCalcExpiryDate = () => {
    if (data.issueDate.length === 8) {
      updateField("expirationDate", calculateExpiryDate(data.issueDate, data.stateCode, data.dateOfBirth));
    }
  };

  const fields = revision?.fields;

  return (
    <Card className="p-6 bg-card border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-mono text-2xl font-bold">{stateConfig?.name || "Select State"}</h2>
          {revision && (
            <p className="text-sm text-muted-foreground font-mono">
              Rev. {revision.revisionDate} ({revision.aamvaVersion}{revision.jurisdictionVersion})
              {revision.realIdCompliant && (
                <span className="ml-2 text-primary">★ REAL ID</span>
              )}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomize} className="gap-2">
          <Shuffle className="h-4 w-4" />
          Random Data
        </Button>
      </div>

      {/* State & Revision Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label>State</Label>
          <Select value={data.stateCode} onValueChange={handleStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {STATE_CONFIGS.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {stateConfig && stateConfig.revisions.length > 1 && (
          <div>
            <Label>Revision</Label>
            <Select value={data.revisionId} onValueChange={handleRevisionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select revision" />
              </SelectTrigger>
              <SelectContent>
                {stateConfig.revisions.map((rev) => (
                  <SelectItem key={rev.id} value={rev.id}>
                    {rev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="section-divider mb-6" />

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1: DL Number, Names */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label className="flex items-center gap-1">
              DL Number
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Generate state-specific DL number</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={handleCalcDLNumber}>
                <Calculator className="h-3 w-3" />
              </Button>
            </Label>
            <Input
              value={data.licenseNumber}
              onChange={(e) => updateField("licenseNumber", e.target.value.toUpperCase())}
              placeholder="D1234567"
            />
          </div>

          {fields?.hasFirstMiddleCombined ? (
            <>
              <div>
                <Label className="flex items-center gap-1">
                  Last name
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcLastName}>
                    <Calculator className="h-3 w-3" />
                  </Button>
                </Label>
                <Input
                  value={data.lastName}
                  onChange={(e) => updateField("lastName", e.target.value.toUpperCase())}
                  placeholder="DOE"
                />
              </div>
              <div className="col-span-2">
                <Label className="flex items-center gap-1">
                  First & Middle name
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcFirstMiddleName}>
                    <Calculator className="h-3 w-3" />
                  </Button>
                </Label>
                <Input
                  value={data.firstMiddleName}
                  onChange={(e) => updateField("firstMiddleName", e.target.value.toUpperCase())}
                  placeholder="JOHN,MICHAEL"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="flex items-center gap-1">
                  First name
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcFirstName}>
                    <Calculator className="h-3 w-3" />
                  </Button>
                </Label>
                <Input
                  value={data.firstName}
                  onChange={(e) => updateField("firstName", e.target.value.toUpperCase())}
                  placeholder="JOHN"
                />
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  Last name
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcLastName}>
                    <Calculator className="h-3 w-3" />
                  </Button>
                </Label>
                <Input
                  value={data.lastName}
                  onChange={(e) => updateField("lastName", e.target.value.toUpperCase())}
                  placeholder="DOE"
                />
              </div>
              {fields?.hasMiddleName && (
                <div>
                  <Label className="flex items-center gap-1">
                    Middle name
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcMiddleName}>
                      <Calculator className="h-3 w-3" />
                    </Button>
                  </Label>
                  <Input
                    value={data.middleName}
                    onChange={(e) => updateField("middleName", e.target.value.toUpperCase())}
                    placeholder="MICHAEL"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Row 2: Address */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Address</Label>
            <Input
              value={data.streetAddress}
              onChange={(e) => updateField("streetAddress", e.target.value.toUpperCase())}
              placeholder="123 MAIN ST"
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={data.city}
              onChange={(e) => updateField("city", e.target.value.toUpperCase())}
              placeholder="LOS ANGELES"
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              Zip code
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>9-digit ZIP code</TooltipContent>
              </Tooltip>
            </Label>
            <Input
              value={data.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="900010000"
              maxLength={9}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {fields?.hasDLClass && (
              <div>
                <Label>DL Class</Label>
                <Input
                  value={data.dlClass}
                  onChange={(e) => updateField("dlClass", e.target.value.toUpperCase())}
                  placeholder="e.g. C, D, M"
                  maxLength={5}
                />
              </div>
            )}
            <div>
              <Label>Sex</Label>
              <Select value={data.gender} onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger>
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
              <div>
                <Label>Donor</Label>
                <Select value={data.donor} onValueChange={(v) => updateField("donor", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">No</SelectItem>
                    <SelectItem value="Y">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Dates */}
        <div className="grid grid-cols-5 gap-4">
          <div>
            <Label className="flex items-center gap-1">
              Birth date
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>MMDDYYYY format</TooltipContent>
              </Tooltip>
            </Label>
            <Input
              value={data.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="01151970"
              maxLength={8}
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              Issue date
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Click calculator to set today's date</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcIssueDate}>
                <Calculator className="h-3 w-3" />
              </Button>
            </Label>
            <Input
              value={data.issueDate}
              onChange={(e) => updateField("issueDate", e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="08262021"
              maxLength={8}
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              Expiry date
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Auto-calculate from issue date + state validity period</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCalcExpiryDate}>
                <Calculator className="h-3 w-3" />
              </Button>
            </Label>
            <Input
              value={data.expirationDate}
              onChange={(e) => updateField("expirationDate", e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="01152026"
              maxLength={8}
            />
          </div>
          {fields?.hasDD && (
            <div>
              <Label className="flex items-center gap-1">
                DD
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Document Discriminator</TooltipContent>
                </Tooltip>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleGenerateDD}>
                  <Calculator className="h-3 w-3" />
                </Button>
              </Label>
              <Input
                value={data.documentDiscriminator}
                onChange={(e) => updateField("documentDiscriminator", e.target.value)}
                placeholder="Click calculator"
                className="text-xs"
              />
            </div>
          )}
          {fields?.hasICN && (
            <div>
              <Label className="flex items-center gap-1">
                ICN
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Inventory Control Number</TooltipContent>
                </Tooltip>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleGenerateICN}>
                  <Calculator className="h-3 w-3" />
                </Button>
              </Label>
              <Input
                value={data.inventoryControlNumber}
                onChange={(e) => updateField("inventoryControlNumber", e.target.value)}
                placeholder="Click calculator"
                className="text-xs"
              />
            </div>
          )}
        </div>

        {/* Row 4: Restrictions, Endorsement, Height, Weight */}
        <div className="grid grid-cols-4 gap-4">
          {fields?.hasRestrictions && (
            <div>
              <Label>Restrictions</Label>
              <Input
                value={data.restrictions}
                onChange={(e) => updateField("restrictions", e.target.value.toUpperCase())}
                placeholder="NONE"
              />
            </div>
          )}
          {fields?.hasEndorsement && (
            <div>
              <Label>Endorsement</Label>
              <Input
                value={data.endorsement}
                onChange={(e) => updateField("endorsement", e.target.value.toUpperCase())}
                placeholder="NONE"
              />
            </div>
          )}
          <div>
            <Label>Height (in.)</Label>
            <div className="relative">
              <Input
                value={data.height}
                onChange={(e) => updateField("height", e.target.value.replace(/\D/g, "").slice(0, 2))}
                placeholder="69"
                maxLength={2}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ≈ {inchesToCm(parseInt(data.height) || 0)} cm
              </span>
            </div>
          </div>
          {fields?.hasWeight && (
            <div>
              <Label>Weight (lb.)</Label>
              <div className="relative">
                <Input
                  value={data.weight}
                  onChange={(e) => updateField("weight", e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="169"
                  maxLength={3}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  ≈ {lbsToKg(parseInt(data.weight) || 0)} kg
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Eye/Hair Colors */}
        <div className="grid grid-cols-4 gap-4">
          {fields?.hasEyeColorOnDL && (
            <div>
              <Label>Eye (as on DL)</Label>
              <Select value={data.eyeColorOnDL} onValueChange={(v) => updateField("eyeColorOnDL", v)}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Eye (ANSI D-20)</Label>
              <Select value={data.eyeColor} onValueChange={(v) => updateField("eyeColor", v)}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Hair (as on DL)</Label>
              <Select value={data.hairColorOnDL} onValueChange={(v) => updateField("hairColorOnDL", v)}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Hair (ANSI D-20)</Label>
              <Select value={data.hairColor} onValueChange={(v) => updateField("hairColor", v)}>
                <SelectTrigger>
                  <SelectValue />
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

        {/* Row 6: Race, Name Suffix, Safe Driver (conditional) */}
        {(fields?.hasRace || fields?.hasNameSuffix || fields?.hasSafeDriver || fields?.hasRevisionDate) && (
          <div className="grid grid-cols-4 gap-4">
            {fields?.hasRace && (
              <div>
                <Label>Race (ANSI D-20)</Label>
                <Select value={data.race} onValueChange={(v) => updateField("race", v)}>
                  <SelectTrigger>
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
                <Label>Name Suffix</Label>
                <Select value={data.nameSuffix} onValueChange={(v) => updateField("nameSuffix", v)}>
                  <SelectTrigger>
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
                <Label>Revision date</Label>
                <Select value={data.revisionDate} onValueChange={(v) => updateField("revisionDate", v)}>
                  <SelectTrigger>
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
                <Label className="flex items-center gap-1">
                  Safe Driver
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Florida Safe Driver designation</TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={data.safeDriver} onValueChange={(v) => updateField("safeDriver", v)}>
                  <SelectTrigger>
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
      </div>
    </Card>
  );
}
