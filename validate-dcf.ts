import { encodeAAMVA } from "./src/lib/aamvaEncoder";
import { AamvaEncodeInput } from "./src/lib/aamva/builders";
import { getStateConfig } from "./src/lib/stateConfigs";

const sample: AamvaEncodeInput = {
  stateCode: "CA",
  firstName: "JOHN",
  middleName: "", 
  lastName: "DOE",
  firstMiddleName: "",
  nameSuffix: "",
  streetAddress: "123 MAIN ST",
  city: "LOS ANGELES",
  postalCode: "900010000",
  dateOfBirth: "01151970",
  gender: "1",
  eyeColor: "BRO",
  hairColor: "BRO",
  height: "69",
  weight: "169",
  race: "",
  licenseNumber: "D1234567",
  dlClass: "C",
  issueDate: "08262021",
  expirationDate: "01152026",
  documentDiscriminator: "08/26/2021ABC123/EFGH/45",
  inventoryControlNumber: "12345A67890123456",
  restrictions: "NONE",
  endorsement: "NONE",
  donor: "N",
  revisionDate: "08262021",
};

const revision = getStateConfig("CA")?.revisions[0];
if (!revision) {
  throw new Error("CA revision not found");
}

const encoded = encodeAAMVA(sample, "636000", revision.aamvaVersion, revision.jurisdictionVersion);
console.log(encoded);
