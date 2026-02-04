import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Wand2 } from "lucide-react";
import { 
  US_STATES, 
  EYE_COLORS, 
  HAIR_COLORS, 
  GENDER_OPTIONS,
  AAMVAData, 
  DEFAULT_AAMVA_DATA,
  generateRandomData 
} from "@/lib/aamvaData";

interface BarcodeFormProps {
  data: AAMVAData;
  onChange: (data: AAMVAData) => void;
}

export function BarcodeForm({ data, onChange }: BarcodeFormProps) {
  const updateField = (field: keyof AAMVAData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleRandomize = () => {
    const randomData = generateRandomData();
    onChange({ ...data, ...randomData });
  };

  const handleReset = () => {
    onChange(DEFAULT_AAMVA_DATA);
  };

  const generateDocumentDiscriminator = () => {
    const dd = Array.from({ length: 32 }, () => Math.floor(Math.random() * 10)).join("");
    updateField("documentDiscriminator", dd);
  };

  const generateInventoryControlNumber = () => {
    const icn = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
    updateField("inventoryControlNumber", icn);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-mono text-lg font-semibold">License Data</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRandomize} className="gap-2">
            <Shuffle className="h-4 w-4" />
            Random Data
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="state">State</Label>
              <Select value={data.state} onValueChange={(v) => updateField("state", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {US_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => updateField("firstName", e.target.value.toUpperCase())}
                placeholder="JOHN"
              />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={data.middleName}
                onChange={(e) => updateField("middleName", e.target.value.toUpperCase())}
                placeholder="MICHAEL"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => updateField("lastName", e.target.value.toUpperCase())}
                placeholder="DOE"
              />
            </div>

            <div>
              <Label htmlFor="nameSuffix">Suffix</Label>
              <Input
                id="nameSuffix"
                value={data.nameSuffix}
                onChange={(e) => updateField("nameSuffix", e.target.value.toUpperCase())}
                placeholder="JR, SR, III..."
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth (MMDDYYYY)</Label>
              <Input
                id="dateOfBirth"
                value={data.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="01011990"
                maxLength={8}
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={data.gender} onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((g) => (
                    <SelectItem key={g.code} value={g.code}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                value={data.streetAddress}
                onChange={(e) => updateField("streetAddress", e.target.value.toUpperCase())}
                placeholder="123 MAIN ST"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="streetAddress2">Street Address 2 (Optional)</Label>
              <Input
                id="streetAddress2"
                value={data.streetAddress2}
                onChange={(e) => updateField("streetAddress2", e.target.value.toUpperCase())}
                placeholder="APT 101"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => updateField("city", e.target.value.toUpperCase())}
                placeholder="LOS ANGELES"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code (9 digits)</Label>
              <Input
                id="postalCode"
                value={data.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 9))}
                placeholder="900010000"
                maxLength={9}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="physical" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eyeColor">Eye Color</Label>
              <Select value={data.eyeColor} onValueChange={(v) => updateField("eyeColor", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select eye color" />
                </SelectTrigger>
                <SelectContent>
                  {EYE_COLORS.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hairColor">Hair Color</Label>
              <Select value={data.hairColor} onValueChange={(v) => updateField("hairColor", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hair color" />
                </SelectTrigger>
                <SelectContent>
                  {HAIR_COLORS.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="heightFeet">Height (Feet)</Label>
              <Select value={data.heightFeet} onValueChange={(v) => updateField("heightFeet", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Feet" />
                </SelectTrigger>
                <SelectContent>
                  {[4, 5, 6, 7].map((f) => (
                    <SelectItem key={f} value={f.toString()}>
                      {f}'
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="heightInches">Height (Inches)</Label>
              <Select value={data.heightInches} onValueChange={(v) => updateField("heightInches", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Inches" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                      {i}"
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                value={data.weight}
                onChange={(e) => updateField("weight", e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="180"
                maxLength={3}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={data.licenseNumber}
                onChange={(e) => updateField("licenseNumber", e.target.value.toUpperCase())}
                placeholder="D1234567"
              />
            </div>

            <div>
              <Label htmlFor="issueDate">Issue Date (MMDDYYYY)</Label>
              <Input
                id="issueDate"
                value={data.issueDate}
                onChange={(e) => updateField("issueDate", e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="01012020"
                maxLength={8}
              />
            </div>

            <div>
              <Label htmlFor="expirationDate">Expiration Date (MMDDYYYY)</Label>
              <Input
                id="expirationDate"
                value={data.expirationDate}
                onChange={(e) => updateField("expirationDate", e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="01012030"
                maxLength={8}
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="documentDiscriminator">Document Discriminator</Label>
                  <Input
                    id="documentDiscriminator"
                    value={data.documentDiscriminator}
                    onChange={(e) => updateField("documentDiscriminator", e.target.value.slice(0, 32))}
                    placeholder="Auto-generated"
                    maxLength={32}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={generateDocumentDiscriminator}>
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="inventoryControlNumber">Inventory Control Number</Label>
                  <Input
                    id="inventoryControlNumber"
                    value={data.inventoryControlNumber}
                    onChange={(e) => updateField("inventoryControlNumber", e.target.value.slice(0, 20))}
                    placeholder="Auto-generated"
                    maxLength={20}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={generateInventoryControlNumber}>
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="complianceType">Compliance Type</Label>
              <Select value={data.complianceType} onValueChange={(v) => updateField("complianceType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Full Compliance (REAL ID)</SelectItem>
                  <SelectItem value="N">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
