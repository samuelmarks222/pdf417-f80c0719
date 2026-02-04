// Complete US States with AAMVA versions and revisions

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
  hasFirstMiddleCombined: boolean; // NY style: "First & Middle name"
  hasDLClass: boolean;
  hasDonor: boolean;
  hasDD: boolean;
  hasICN: boolean;
  hasRestrictions: boolean;
  hasEndorsement: boolean;
  hasWeight: boolean;
  hasEyeColor: boolean;
  hasEyeColorOnDL: boolean; // California has both "as on DL" and "ANSI D-20"
  hasHairColor: boolean;
  hasHairColorOnDL: boolean;
  hasRace: boolean;
  hasNameSuffix: boolean;
  hasSafeDriver: boolean; // Florida
  hasRevisionDate: boolean; // Florida has revision date selector
  revisionDates?: string[]; // For Florida-style revision selector
}

export interface StateConfig {
  code: string;
  name: string;
  iin: string;
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
        name: "Alabama (2014)",
        year: "2014",
        revisionDate: "01/01/2014",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "AL_2022",
        name: "Alabama (2022)",
        year: "2022",
        revisionDate: "01/01/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "01",
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
        name: "Arizona (2014)",
        year: "2014",
        revisionDate: "01/01/2014",
        aamvaVersion: "08",
        jurisdictionVersion: "02",
        realIdCompliant: true,
        fields: { ...defaultFields, hasHairColor: true },
      },
      {
        id: "AZ_2023",
        name: "Arizona (2023)",
        year: "2023",
        revisionDate: "01/01/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "05",
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
        name: "Arkansas",
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
    code: "CA",
    name: "California",
    iin: "636014",
    revisions: [
      {
        id: "CA_2017",
        name: "California (2017)",
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
        name: "California (2024)",
        year: "2024",
        revisionDate: "01/01/2024",
        aamvaVersion: "10",
        jurisdictionVersion: "03",
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
        name: "Colorado (2015)",
        year: "2015",
        revisionDate: "01/01/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields, hasHairColor: true },
      },
      {
        id: "CO_2022",
        name: "Colorado (2022)",
        year: "2022",
        revisionDate: "01/01/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "Connecticut",
        year: "2017",
        revisionDate: "01/01/2017",
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
        name: "Delaware",
        year: "2018",
        revisionDate: "01/01/2018",
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
        name: "Florida",
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
        name: "Georgia (2015)",
        year: "2015",
        revisionDate: "01/01/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "GA_2019",
        name: "Georgia (2019)",
        year: "2019",
        revisionDate: "01/01/2019",
        aamvaVersion: "09",
        jurisdictionVersion: "01",
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
        name: "Idaho (2016)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "ID_2023",
        name: "Idaho (2023)",
        year: "2023",
        revisionDate: "01/01/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "Illinois",
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
    code: "IN",
    name: "Indiana",
    iin: "636037",
    revisions: [
      {
        id: "IN",
        name: "Indiana",
        year: "2017",
        revisionDate: "01/01/2017",
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
        id: "IA_2011",
        name: "Iowa (2011)",
        year: "2011",
        revisionDate: "01/01/2011",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "IA_2017",
        name: "Iowa (2017)",
        year: "2017",
        revisionDate: "01/01/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "01",
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
        name: "Kansas",
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
    code: "KY",
    name: "Kentucky",
    iin: "636046",
    revisions: [
      {
        id: "KY_2012",
        name: "Kentucky (2012)",
        year: "2012",
        revisionDate: "01/01/2012",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "KY_2018",
        name: "Kentucky (2018)",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "01",
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
        name: "Louisiana",
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
    code: "ME",
    name: "Maine",
    iin: "636041",
    revisions: [
      {
        id: "ME",
        name: "Maine",
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
    code: "MD",
    name: "Maryland",
    iin: "636003",
    revisions: [
      {
        id: "MD_2016",
        name: "Maryland (2016 & 2019)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MD_2021",
        name: "Maryland (2021)",
        year: "2021",
        revisionDate: "01/01/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "Massachusetts",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
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
        name: "Michigan (2011, 2021)",
        year: "2011",
        revisionDate: "01/01/2011",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MI_2024",
        name: "Michigan (2024)",
        year: "2024",
        revisionDate: "01/01/2024",
        aamvaVersion: "10",
        jurisdictionVersion: "03",
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
        name: "Minnesota",
        year: "2018",
        revisionDate: "01/01/2018",
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
        name: "Mississippi (2016, 2021)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MS_2023",
        name: "Mississippi (2023)",
        year: "2023",
        revisionDate: "01/01/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        id: "MO_2012",
        name: "Missouri (2012)",
        year: "2012",
        revisionDate: "01/01/2012",
        aamvaVersion: "07",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "MO_2020",
        name: "Missouri (2020)",
        year: "2020",
        revisionDate: "01/01/2020",
        aamvaVersion: "10",
        jurisdictionVersion: "01",
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
        name: "Montana",
        year: "2017",
        revisionDate: "01/01/2017",
        aamvaVersion: "09",
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
        id: "NE_2017",
        name: "Nebraska (2017)",
        year: "2017",
        revisionDate: "01/01/2017",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "NE_2021",
        name: "Nebraska (2021)",
        year: "2021",
        revisionDate: "01/01/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "01",
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
        id: "NV_2008",
        name: "Nevada (2008)",
        year: "2008",
        revisionDate: "01/01/2008",
        aamvaVersion: "06",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "NV_2021",
        name: "Nevada (2021)",
        year: "2021",
        revisionDate: "01/01/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        id: "NH_2016",
        name: "New Hampshire (2016)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "NH_2024",
        name: "New Hampshire (2024)",
        year: "2024",
        revisionDate: "01/01/2024",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        id: "NJ_2020",
        name: "New Jersey (2020)",
        year: "2020",
        revisionDate: "01/01/2020",
        aamvaVersion: "10",
        jurisdictionVersion: "00",
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
        name: "New Mexico",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
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
        name: "New York (2017)",
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
        name: "New York (2022)",
        year: "2022",
        revisionDate: "01/01/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "05",
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
        name: "North Carolina",
        year: "2017",
        revisionDate: "01/01/2017",
        aamvaVersion: "09",
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
        id: "ND_2008",
        name: "North Dakota (2008)",
        year: "2008",
        revisionDate: "01/01/2008",
        aamvaVersion: "06",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "ND_2023",
        name: "North Dakota (2023)",
        year: "2023",
        revisionDate: "01/01/2023",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "Ohio",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
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
        name: "Oklahoma",
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
    code: "OR",
    name: "Oregon",
    iin: "636029",
    revisions: [
      {
        id: "OR",
        name: "Oregon",
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
    code: "PA",
    name: "Pennsylvania",
    iin: "636025",
    revisions: [
      {
        id: "PA_2016",
        name: "Pennsylvania (2016)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "PA_2022",
        name: "Pennsylvania (2022)",
        year: "2022",
        revisionDate: "01/01/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "Rhode Island (2016)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "RI_2022",
        name: "Rhode Island (2022)",
        year: "2022",
        revisionDate: "01/01/2022",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "South Carolina",
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
        name: "South Dakota",
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
    code: "TN",
    name: "Tennessee",
    iin: "636053",
    revisions: [
      {
        id: "TN",
        name: "Tennessee",
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
    code: "TX",
    name: "Texas",
    iin: "636015",
    revisions: [
      {
        id: "TX_2016",
        name: "Texas (2016)",
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
        name: "Texas (2022)",
        year: "2020",
        revisionDate: "01/01/2020",
        aamvaVersion: "10",
        jurisdictionVersion: "02",
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
        name: "Utah (2016)",
        year: "2016",
        revisionDate: "01/01/2016",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "UT_2021",
        name: "Utah (2021)",
        year: "2021",
        revisionDate: "01/01/2021",
        aamvaVersion: "10",
        jurisdictionVersion: "01",
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
        name: "Vermont",
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
    code: "VA",
    name: "Virginia",
    iin: "636000",
    revisions: [
      {
        id: "VA",
        name: "Virginia",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
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
        id: "WA_2019",
        name: "Washington (2019)",
        year: "2019",
        revisionDate: "01/01/2019",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "WA_2025",
        name: "Washington (2025)",
        year: "2025",
        revisionDate: "01/01/2025",
        aamvaVersion: "10",
        jurisdictionVersion: "03",
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
        name: "West Virginia",
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
    code: "WI",
    name: "Wisconsin",
    iin: "636031",
    revisions: [
      {
        id: "WI_2015",
        name: "Wisconsin (2015)",
        year: "2015",
        revisionDate: "01/01/2015",
        aamvaVersion: "08",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
      {
        id: "WI_2023",
        name: "Wisconsin (2023)",
        year: "2023",
        revisionDate: "01/01/2023",
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
        name: "Wyoming",
        year: "2018",
        revisionDate: "01/01/2018",
        aamvaVersion: "09",
        jurisdictionVersion: "00",
        realIdCompliant: true,
        fields: { ...defaultFields },
      },
    ],
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
