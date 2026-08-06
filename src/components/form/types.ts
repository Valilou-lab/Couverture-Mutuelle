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

export const FAMILY_STATUSES = [
  { id: "marie", label: "Marié(e)" },
  { id: "celibataire", label: "Célibataire" },
  { id: "divorce", label: "Divorcé(e)" },
  { id: "veuf", label: "Veuf(ve)" },
] as const;

export const HEALTH_REGIMES = [
  { id: "general", label: "Régime général" },
  { id: "tns", label: "Travailleur non salarié" },
  { id: "agricole", label: "Régime agricole" },
  { id: "alsace-moselle", label: "Alsace-Moselle" },
] as const;

/** Assureurs du formulaire — logos dans /public/images/logoassurance */
export const INSURERS = [
  {
    name: "Harmonie Mutuelle",
    logo: "/images/logoassurance/harmonie-mutuelle.jpg",
  },
  { name: "MGEN", logo: "/images/logoassurance/mgen.png" },
  {
    name: "Malakoff Humanis",
    logo: "/images/logoassurance/malakoff-humanis.png",
  },
  { name: "AG2R La Mondiale", logo: "/images/logoassurance/ag2r.png" },
  { name: "Groupama", logo: "/images/logoassurance/groupama.webp" },
  { name: "AXA", logo: "/images/logoassurance/axa.webp" },
  { name: "Allianz", logo: "/images/logoassurance/allianz.png" },
  { name: "Swiss Life", logo: "/images/logoassurance/swisslife.png" },
  { name: "April", logo: "/images/logoassurance/april.png" },
  { name: "Generali", logo: "/images/logoassurance/generali.webp" },
  { name: "Aésio Mutuelle", logo: "/images/logoassurance/aesio.png" },
  { name: "Apivia", logo: "/images/logoassurance/apivia.png" },
  { name: "Autres", logo: null },
  { name: "Je ne sais pas", logo: null },
] as const;

export const CIVILITIES = [
  { id: "mme", label: "Madame" },
  { id: "m", label: "Monsieur" },
] as const;

export type CareNeedId = (typeof CARE_NEEDS)[number]["id"];
export type CoveredPersonId = (typeof COVERED_PERSONS)[number]["id"];
export type FamilyStatusId = (typeof FAMILY_STATUSES)[number]["id"];
export type HealthRegimeId = (typeof HEALTH_REGIMES)[number]["id"];
export type CivilityId = (typeof CIVILITIES)[number]["id"];

export type QuoteFormData = {
  careNeeds: CareNeedId[];
  coveredPersons: CoveredPersonId | "";
  spouseBirthDate: string;
  birthDate: string;
  familyStatus: FamilyStatusId | "";
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
  consent: false,
};

export type FormStepId =
  | "careNeeds"
  | "coveredPersons"
  | "birthDate"
  | "familyStatus"
  | "postalCode"
  | "healthRegime"
  | "alreadyInsured"
  | "insurer"
  | "analyzing"
  | "contact"
  | "confirmation";

export const FORM_STEPS: FormStepId[] = [
  "careNeeds",
  "coveredPersons",
  "birthDate",
  "familyStatus",
  "postalCode",
  "healthRegime",
  "alreadyInsured",
  "insurer",
  "analyzing",
  "contact",
  "confirmation",
];
