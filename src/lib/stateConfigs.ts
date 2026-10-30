// Complete US States with AAMVA versions and revisions
// Revision dates and version codes sourced from pdf417.pro reference

export interface StateRevision {
  id: string;
  name: string;
  year: string;
  revisionDate: string;
  aamvaVersion: string;
  jurisdictionVersion: string;
  realIdCompliant: boolean;
  fields: StateFieldConfig;
}

export interface StateFieldConfig {
  hasMiddleName: boolean;
  hasFirstMiddleCombined: boolean;
  hasDLClass: boolean;
  hasDonor: boolean;
  hasDD: boolean;
  hasICN: boolean;
  hasRestrictions: boolean;
  hasEndorsement: boolean;
  hasWeight: boolean;
  hasEyeColor: boolean;
  hasEyeColorOnDL: boolean;
  hasHairColor: boolean;
  hasHairColorOnDL: boolean;
  hasRace: boolean;
  hasNameSuffix: boolean;
  hasSafeDriver: boolean;
  hasRevisionDate: boolean;
  hasAddressLine2?: boolean;
  heightUnit?: "in" | "cm";
  weightUnit?: "lb" | "kg";
  revisionDates?: string[];
}

export interface StateConfig {
  code: string;
  name: string;
  iin: string;
  country?: "USA" | "Canada";
  revisions: StateRevision[];
}

const defaultFields: StateFieldConfig = {
  hasMiddleName: true,
  hasFirstMiddleCombined: false,
  hasDLClass: true,
  hasDonor: true,
  hasDD: true,
  hasICN: true,
  hasRestrictions: true,
  hasEndorsement: true,
  hasWeight: true,
  hasEyeColor: true,
  hasEyeColorOnDL: false,
  hasHairColor: false,
  hasHairColorOnDL: false,
  hasRace: false,
  hasNameSuffix: false,
  hasSafeDriver: false,
  hasRevisionDate: false,
};

export const STATE_CONFIGS: StateConfig[] = [
  {
    code: "AL",
    name: "Alabama",
    iin: "636033",
    revisions: [
      {
        id: "AL_2014",
        name: "Alabama (Rev. 11/01/2014)",
        year: "2014",
        revisionDate: "11/01/2014",
        aamvaVersion: "04",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "AL_2022",
        name: "Alabama (Rev. 26/04/2022)",
        year: "2022",
        revisionDate: "04/26/2022",
        aamvaVersion: "04",
        jurisdictionVersion: "03",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "AK",
    name: "Alaska",
    iin: "636059",
    revisions: [
      {
        id: "AK",
        name: "Alaska",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "AZ",
    name: "Arizona",
    iin: "636026",
    revisions: [
      {
        id: "AZ_2014",
        name: "Arizona (Rev. 02/14/2014)",
        year: "2014",
        revisionDate: "02/14/2014",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields, hasHairColor: true },
      },
    ],
  },
  {
    code: "AR",
    name: "Arkansas",
    iin: "636021",
    revisions: [
      {
        id: "AR",
        name: "Arkansas (Rev. 03/01/2018)",
        year: "2018",
        revisionDate: "03/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "CA",
    name: "California",
    iin: "636014",
    revisions: [
      {
        id: "CA_2017",
        name: "California (Rev. 08/29/2017)",
        year: "2017",
        revisionDate: "08/29/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { 
          ...defaultFields, 
          hasEyeColorOnDL: true, 
          hasHairColor: true, 
          hasHairColorOnDL: true,
        },
      },
      {
        id: "CA_2024",
        name: "California (Rev. 2024)",
        year: "2024",
        revisionDate: "01/01/2024",
        aamvaVersion: "10",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { 
          ...defaultFields, 
          hasEyeColorOnDL: true, 
          hasHairColor: true, 
          hasHairColorOnDL: true,
        },
      },
    ],
  },
  {
    code: "CO",
    name: "Colorado",
    iin: "636020",
    revisions: [
      {
        id: "CO_2015",
        name: "Colorado (Rev. 10/30/2015)",
        year: "2015",
        revisionDate: "10/30/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields, hasHairColor: true },
      },
      {
        id: "CO_2022",
        name: "Colorado (Rev. 02/28/2022)",
        year: "2022",
        revisionDate: "02/28/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { ...defaultFields, hasHairColor: true },
      },
    ],
  },
  {
    code: "CT",
    name: "Connecticut",
    iin: "636006",
    revisions: [
      {
        id: "CT",
        name: "Connecticut (Rev. 02/10/2017)",
        year: "2017",
        revisionDate: "02/10/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "DE",
    name: "Delaware",
    iin: "636011",
    revisions: [
      {
        id: "DE",
        name: "Delaware (Rev. 08/02/2017)",
        year: "2017",
        revisionDate: "08/02/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "DC",
    name: "Washington DC",
    iin: "636043",
    revisions: [
      {
        id: "DC",
        name: "Washington DC",
        year: "2017",
        revisionDate: "01/01/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "FL",
    name: "Florida",
    iin: "636010",
    revisions: [
      {
        id: "FL",
        name: "Florida (Rev. 03/16/2017 & 05/01/2019 & 03/01/2020)",
        year: "2017",
        revisionDate: "03/16/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { 
          ...defaultFields, 
          hasSafeDriver: true, 
          hasRevisionDate: true,
          revisionDates: ["03/16/2017", "05/01/2019", "03/01/2020"],
        },
      },
    ],
  },
  {
    code: "GA",
    name: "Georgia",
    iin: "636055",
    revisions: [
      {
        id: "GA_2015",
        name: "Georgia (Rev. 07/01/2015)",
        year: "2015",
        revisionDate: "07/01/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "GA_2019",
        name: "Georgia (Rev. 01/02/2019)",
        year: "2019",
        revisionDate: "01/02/2019",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "HI",
    name: "Hawaii",
    iin: "636047",
    revisions: [
      {
        id: "HI",
        name: "Hawaii",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "ID",
    name: "Idaho",
    iin: "636050",
    revisions: [
      {
        id: "ID_2016",
        name: "Idaho (Rev. 09/05/2016)",
        year: "2016",
        revisionDate: "09/05/2016",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "ID_2023",
        name: "Idaho (Rev. 01/31/2023)",
        year: "2023",
        revisionDate: "01/31/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "09",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "IL",
    name: "Illinois",
    iin: "636035",
    revisions: [
      {
        id: "IL",
        name: "Illinois (Rev. 09/17/2015)",
        year: "2015",
        revisionDate: "09/17/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "IN",
    name: "Indiana",
    iin: "636037",
    revisions: [
      {
        id: "IN",
        name: "Indiana (Rev. 07/24/2018)",
        year: "2018",
        revisionDate: "07/24/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "IA",
    name: "Iowa",
    iin: "636018",
    revisions: [
      {
        id: "IA",
        name: "Iowa (Rev. 06/29/2017)",
        year: "2017",
        revisionDate: "06/29/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "KS",
    name: "Kansas",
    iin: "636022",
    revisions: [
      {
        id: "KS",
        name: "Kansas (Rev. 02/24/2017)",
        year: "2017",
        revisionDate: "02/24/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "KY",
    name: "Kentucky",
    iin: "636046",
    revisions: [
      {
        id: "KY_2012",
        name: "Kentucky (Rev. 03/16/2012)",
        year: "2012",
        revisionDate: "03/16/2012",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "KY_2018",
        name: "Kentucky (Rev. 08/31/2018)",
        year: "2018",
        revisionDate: "08/31/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "LA",
    name: "Louisiana",
    iin: "636007",
    revisions: [
      {
        id: "LA",
        name: "Louisiana (Rev. 02/10/2015)",
        year: "2015",
        revisionDate: "02/10/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "ME",
    name: "Maine",
    iin: "636041",
    revisions: [
      {
        id: "ME",
        name: "Maine (Rev. 01/04/2019)",
        year: "2019",
        revisionDate: "01/04/2019",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MD",
    name: "Maryland",
    iin: "636003",
    revisions: [
      {
        id: "MD_2016",
        name: "Maryland (Rev. 06/20/2016 & 08/26/2019)",
        year: "2016",
        revisionDate: "06/20/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MD_2021",
        name: "Maryland (Rev. 12/05/2021)",
        year: "2021",
        revisionDate: "12/05/2021",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MA",
    name: "Massachusetts",
    iin: "636002",
    revisions: [
      {
        id: "MA",
        name: "Massachusetts (Rev. 02/22/2016)",
        year: "2016",
        revisionDate: "02/22/2016",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MI",
    name: "Michigan",
    iin: "636032",
    revisions: [
      {
        id: "MI_2011",
        name: "Michigan (Rev. 01/21/2011 & 08/16/2021)",
        year: "2011",
        revisionDate: "01/21/2011",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MI_2024",
        name: "Michigan (Rev. 01/02/2024)",
        year: "2024",
        revisionDate: "01/02/2024",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MN",
    name: "Minnesota",
    iin: "636038",
    revisions: [
      {
        id: "MN",
        name: "Minnesota (Rev. 10/23/2017)",
        year: "2017",
        revisionDate: "10/23/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MS",
    name: "Mississippi",
    iin: "636051",
    revisions: [
      {
        id: "MS_2016",
        name: "Mississippi (Rev. 02/22/2016 & 05/14/2021)",
        year: "2016",
        revisionDate: "02/22/2016",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MS_2023",
        name: "Mississippi (Rev. 09/15/2023)",
        year: "2023",
        revisionDate: "09/15/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MO",
    name: "Missouri",
    iin: "636030",
    revisions: [
      {
        id: "MO",
        name: "Missouri (Rev. 01/27/2020)",
        year: "2020",
        revisionDate: "01/27/2020",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "MT",
    name: "Montana",
    iin: "636008",
    revisions: [
      {
        id: "MT",
        name: "Montana (Rev. 10/07/2015)",
        year: "2015",
        revisionDate: "10/07/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "NE",
    name: "Nebraska",
    iin: "636054",
    revisions: [
      {
        id: "NE",
        name: "Nebraska (Rev. 04/05/2021)",
        year: "2021",
        revisionDate: "04/05/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "NV",
    name: "Nevada",
    iin: "636049",
    revisions: [
      {
        id: "NV",
        name: "Nevada (Rev. 05/24/2021)",
        year: "2021",
        revisionDate: "05/24/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "NH",
    name: "New Hampshire",
    iin: "636039",
    revisions: [
      {
        id: "NH",
        name: "New Hampshire (Rev. 08/30/2024)",
        year: "2024",
        revisionDate: "08/30/2024",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "NJ",
    name: "New Jersey",
    iin: "636036",
    revisions: [
      {
        id: "NJ",
        name: "New Jersey (Rev. 01/08/2020)",
        year: "2020",
        revisionDate: "01/08/2020",
        aamvaVersion: "04",
        jurisdictionVersion: "02",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "NM",
    name: "New Mexico",
    iin: "636009",
    revisions: [
      {
        id: "NM",
        name: "New Mexico (Rev. 08/23/2019)",
        year: "2019",
        revisionDate: "08/23/2019",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "NY",
    name: "New York",
    iin: "636001",
    revisions: [
      {
        id: "NY_2017",
        name: "New York (Rev. 09/28/2017)",
        year: "2017",
        revisionDate: "09/28/2017",
        aamvaVersion: "03",
        jurisdictionVersion: "03",
        realIdCompliant: false,
        fields: { 
          ...defaultFields, 
          hasMiddleName: false,
          hasFirstMiddleCombined: true,
          hasICN: false,
          hasWeight: false,
          hasHairColor: false,
        },
      },
      {
        id: "NY_2022",
        name: "New York (Rev. 03/07/2022)",
        year: "2022",
        revisionDate: "03/07/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "04",
        realIdCompliant: true,
        fields: { 
          ...defaultFields, 
          hasMiddleName: false,
          hasFirstMiddleCombined: true,
          hasICN: false,
          hasWeight: false,
          hasHairColor: false,
        },
      },
    ],
  },
  {
    code: "NC",
    name: "North Carolina",
    iin: "636004",
    revisions: [
      {
        id: "NC",
        name: "North Carolina (Rev. 10/24/2014)",
        year: "2014",
        revisionDate: "10/24/2014",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "ND",
    name: "North Dakota",
    iin: "636034",
    revisions: [
      {
        id: "ND",
        name: "North Dakota (Rev. 03/10/2023)",
        year: "2023",
        revisionDate: "03/10/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "OH",
    name: "Ohio",
    iin: "636023",
    revisions: [
      {
        id: "OH",
        name: "Ohio (Rev. 07/01/2018)",
        year: "2018",
        revisionDate: "07/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "OK",
    name: "Oklahoma",
    iin: "636058",
    revisions: [
      {
        id: "OK",
        name: "Oklahoma (Rev. 01/13/2020)",
        year: "2020",
        revisionDate: "01/13/2020",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "OR",
    name: "Oregon",
    iin: "636029",
    revisions: [
      {
        id: "OR",
        name: "Oregon (Rev. 07/09/2018)",
        year: "2018",
        revisionDate: "07/09/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "PA",
    name: "Pennsylvania",
    iin: "636025",
    revisions: [
      {
        id: "PA_2016",
        name: "Pennsylvania (Rev. 06/07/2016)",
        year: "2016",
        revisionDate: "06/07/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "PA_2022",
        name: "Pennsylvania (Rev. 03/25/2022)",
        year: "2022",
        revisionDate: "03/25/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "RI",
    name: "Rhode Island",
    iin: "636052",
    revisions: [
      {
        id: "RI_2016",
        name: "Rhode Island (Rev. 01/26/2016)",
        year: "2016",
        revisionDate: "01/26/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "RI_2022",
        name: "Rhode Island (Rev. 03/01/2022)",
        year: "2022",
        revisionDate: "03/01/2022",
        aamvaVersion: "08",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "SC",
    name: "South Carolina",
    iin: "636005",
    revisions: [
      {
        id: "SC",
        name: "South Carolina (Rev. 01/01/2018)",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "SD",
    name: "South Dakota",
    iin: "636042",
    revisions: [
      {
        id: "SD",
        name: "South Dakota (Rev. 06/29/2017)",
        year: "2017",
        revisionDate: "06/29/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "TN",
    name: "Tennessee",
    iin: "636053",
    revisions: [
      {
        id: "TN",
        name: "Tennessee (Rev. 12/02/2011)",
        year: "2011",
        revisionDate: "12/02/2011",
        aamvaVersion: "06",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "TX",
    name: "Texas",
    iin: "636015",
    revisions: [
      {
        id: "TX_2016",
        name: "Texas (Rev. 10/10/2016)",
        year: "2016",
        revisionDate: "10/10/2016",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: false,
        fields: { 
          ...defaultFields, 
          hasHairColor: true,
          hasRace: true,
          hasNameSuffix: true,
        },
      },
      {
        id: "TX_2020",
        name: "Texas (Rev. 02/23/2020)",
        year: "2020",
        revisionDate: "02/23/2020",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { 
          ...defaultFields, 
          hasHairColor: true,
          hasRace: true,
          hasNameSuffix: true,
        },
      },
    ],
  },
  {
    code: "UT",
    name: "Utah",
    iin: "636040",
    revisions: [
      {
        id: "UT_2016",
        name: "Utah (Rev. 04/15/2016)",
        year: "2016",
        revisionDate: "04/15/2016",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "UT_2021",
        name: "Utah (Rev. 06/01/2021)",
        year: "2021",
        revisionDate: "06/01/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "VT",
    name: "Vermont",
    iin: "636024",
    revisions: [
      {
        id: "VT",
        name: "Vermont (Rev. 10/16/2018)",
        year: "2018",
        revisionDate: "10/16/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "02",
        realIdCompliant: false,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "VA",
    name: "Virginia",
    iin: "636000",
    revisions: [
      {
        id: "VA",
        name: "Virginia (Rev. 12/10/2008)",
        year: "2008",
        revisionDate: "12/10/2008",
        aamvaVersion: "03",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "WA",
    name: "Washington",
    iin: "636045",
    revisions: [
      {
        id: "WA",
        name: "Washington",
        year: "2019",
        revisionDate: "01/01/2019",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "WV",
    name: "West Virginia",
    iin: "636061",
    revisions: [
      {
        id: "WV",
        name: "West Virginia (Rev. 06/04/2019)",
        year: "2019",
        revisionDate: "06/04/2019",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "WI",
    name: "Wisconsin",
    iin: "636031",
    revisions: [
      {
        id: "WI_2015",
        name: "Wisconsin (Rev. 09/01/2015)",
        year: "2015",
        revisionDate: "09/01/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "01",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "WI_2023",
        name: "Wisconsin (Rev. 06/01/2023)",
        year: "2023",
        revisionDate: "06/01/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  {
    code: "WY",
    name: "Wyoming",
    iin: "636060",
    revisions: [
      {
        id: "WY",
        name: "Wyoming (Rev. 11/14/2018)",
        year: "2018",
        revisionDate: "11/14/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
  },
  // Canadian jurisdiction references. These use the same generator pipeline,
  // but keep the province/territory-specific field layouts shown in the UI.
  {
    code: "AB",
    name: "Alberta",
    iin: "600001",
    country: "Canada",
    revisions: [{ id: "AB", name: "Alberta", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasAddressLine2: true, hasHairColor: true, hasHairColorOnDL: true, heightUnit: "cm", weightUnit: "lb" } }],
  },
  {
    code: "BC",
    name: "British Columbia",
    iin: "600002",
    country: "Canada",
    revisions: [{ id: "BC", name: "British Columbia", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasAddressLine2: true, hasHairColor: true, hasHairColorOnDL: true, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "MB",
    name: "Manitoba",
    iin: "600003",
    country: "Canada",
    revisions: [{ id: "MB", name: "Manitoba", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasWeight: false, hasICN: true, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "NB",
    name: "New Brunswick",
    iin: "600004",
    country: "Canada",
    revisions: [{ id: "NB", name: "New Brunswick", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "NL",
    name: "Newfoundland and Labrador",
    iin: "600005",
    country: "Canada",
    revisions: [{ id: "NL", name: "Newfoundland and Labrador", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "NS",
    name: "Nova Scotia",
    iin: "600006",
    country: "Canada",
    revisions: [{ id: "NS", name: "Nova Scotia", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "NT",
    name: "Northwest Territories",
    iin: "600007",
    country: "Canada",
    revisions: [{ id: "NT", name: "Northwest Territories", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "NU",
    name: "Nunavut",
    iin: "600008",
    country: "Canada",
    revisions: [{ id: "NU", name: "Nunavut", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "ON",
    name: "Ontario",
    iin: "600009",
    country: "Canada",
    revisions: [{ id: "ON", name: "Ontario", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasMiddleName: false, hasFirstMiddleCombined: true, hasDonor: false, hasWeight: false, hasICN: true, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "PE",
    name: "Prince Edward Island",
    iin: "600010",
    country: "Canada",
    revisions: [{ id: "PE", name: "Prince Edward Island", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "QC",
    name: "Quebec",
    iin: "600011",
    country: "Canada",
    revisions: [{ id: "QC", name: "Quebec", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: true, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "SK",
    name: "Saskatchewan",
    iin: "600012",
    country: "Canada",
    revisions: [{ id: "SK", name: "Saskatchewan", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: false, heightUnit: "cm", weightUnit: "kg" } }],
  },
  {
    code: "YT",
    name: "Yukon",
    iin: "600013",
    country: "Canada",
    revisions: [{ id: "YT", name: "Yukon", year: "2025", revisionDate: "01/01/2025", aamvaVersion: "10", jurisdictionVersion: "00", realIdCompliant: false, fields: { ...defaultFields, hasDonor: false, hasICN: false, hasWeight: true, heightUnit: "cm", weightUnit: "kg" } }],
  },
];

// Helper to get state config by code
export function getStateConfig(code: string): StateConfig | undefined {
  return STATE_CONFIGS.find(s => s.code === code);
}

// Helper to get revision by ID
export function getRevision(revisionId: string): { state: StateConfig; revision: StateRevision } | undefined {
  for (const state of STATE_CONFIGS) {
    const revision = state.revisions.find(r => r.id === revisionId);
    if (revision) {
      return { state, revision };
    }
  }
  return undefined;
}
