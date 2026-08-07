export const CARE_NEEDS = [
  { id: "hospitalisation", label: "Hospitalisation" },
  { id: "optique", label: "Optique" },
  { id: "dentaire", label: "Dentaire" },
  { id: "audition", label: "Audition" },
  { id: "medecines-douces", label: "Médecines douces" },
  { id: "soins-courants", label: "Soins courants" },
  { id: "je-ne-sais-pas", label: "Je ne sais pas" },
] as const;

export const COVERED_PERSONS = [
  { id: "moi", label: "Moi", needsSpouseDob: false },
  { id: "moi-conjoint", label: "Moi et mon conjoint", needsSpouseDob: true },
  {
    id: "moi-conjoint-enfants",
    label: "Moi, mon conjoint et enfant(s)",
    needsSpouseDob: true,
  },
] as const;

export const HEALTH_REGIMES = [
  { id: "general", label: "Régime général" },
  { id: "tns", label: "Travailleur non salarié" },
  { id: "agricole", label: "Régime agricole" },
  { id: "alsace-moselle", label: "Alsace-Moselle" },
] as const;

export const CIVILITIES = [
  { id: "mme", label: "Madame" },
  { id: "m", label: "Monsieur" },
] as const;

export type CareNeedId = (typeof CARE_NEEDS)[number]["id"];
export type CoveredPersonId = (typeof COVERED_PERSONS)[number]["id"];
export type HealthRegimeId = (typeof HEALTH_REGIMES)[number]["id"];
export type CivilityId = (typeof CIVILITIES)[number]["id"];

export type QuoteFormData = {
  careNeeds: CareNeedId[];
  coveredPersons: CoveredPersonId | "";
  spouseBirthDate: string;
  birthDate: string;
  /** Kept empty for lead payload compatibility — step removed. */
  familyStatus: string;
  postalCode: string;
  city: string;
  citiesOptions: string[];
  healthRegime: HealthRegimeId | "";
  alreadyInsured: "oui" | "non" | "";
  insurer: string;
  civility: CivilityId | "";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  whatsappAvailable: boolean;
  consent: boolean;
};

export const initialFormData: QuoteFormData = {
  careNeeds: [],
  coveredPersons: "",
  spouseBirthDate: "",
  birthDate: "",
  familyStatus: "",
  postalCode: "",
  city: "",
  citiesOptions: [],
  healthRegime: "",
  alreadyInsured: "",
  insurer: "",
  civility: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  whatsappAvailable: false,
  consent: false,
};

export type FormStepId =
  | "careNeeds"
  | "coveredPersons"
  | "birthDate"
  | "postalCode"
  | "healthRegime"
  | "alreadyInsured"
  | "analyzing"
  | "contact"
  | "confirmation";

export const FORM_STEPS: FormStepId[] = [
  "careNeeds",
  "coveredPersons",
  "birthDate",
  "postalCode",
  "healthRegime",
  "alreadyInsured",
  "analyzing",
  "contact",
  "confirmation",
];
