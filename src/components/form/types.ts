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
  {
    id: "moi-enfants",
    label: "Moi et enfant(s)",
    needsSpouseDob: false,
  },
  { id: "moi-conjoint", label: "Moi et mon conjoint", needsSpouseDob: true },
  {
    id: "moi-conjoint-enfants",
    label: "Moi, mon conjoint et enfant(s)",
    needsSpouseDob: true,
  },
] as const;

export const PROFESSIONAL_STATUSES = [
  { id: "retired", label: "Retraité" },
  { id: "employee", label: "Salarié" },
  { id: "not_working", label: "Sans activité professionnelle" },
  { id: "other", label: "Autre" },
] as const;

/** Kept for Vertikl `cost_health` / savings flows — no longer asked on the primary LP. */
export const CURRENT_MUTUAL_TARIFFS = [
  { id: "under_60", label: "Moins de 60 €" },
  { id: "60_90", label: "60 à 90 €" },
  { id: "90_120", label: "90 à 120 €" },
  { id: "over_120", label: "Plus de 120 €" },
  { id: "unknown", label: "Je ne sais pas" },
  { id: "no_insurance", label: "Je n’ai pas de mutuelle" },
] as const;

/** First question on the primary conversion form (`health_insurance_goal`). */
export const HEALTH_INSURANCE_GOALS = [
  { id: "pay_less", label: "Payer moins cher" },
  { id: "better_reimbursement", label: "Être mieux remboursé(e)" },
  { id: "adapt_coverage", label: "Adapter mes garanties à mes besoins" },
  { id: "compare_before_increase", label: "Comparer avant la prochaine hausse" },
  { id: "unknown", label: "Je ne sais pas" },
] as const;

export const CIVILITIES = [
  { id: "mme", label: "Madame" },
  { id: "m", label: "Monsieur" },
] as const;

export type CareNeedId = (typeof CARE_NEEDS)[number]["id"];
export type CoveredPersonId = (typeof COVERED_PERSONS)[number]["id"];
export type ProfessionalStatusId = (typeof PROFESSIONAL_STATUSES)[number]["id"];

export function isProfessionalStatusId(
  value: string,
): value is ProfessionalStatusId {
  return PROFESSIONAL_STATUSES.some((item) => item.id === value);
}

export type CurrentMutualTariffId =
  (typeof CURRENT_MUTUAL_TARIFFS)[number]["id"];

export function isCurrentMutualTariffId(
  value: string,
): value is CurrentMutualTariffId {
  return CURRENT_MUTUAL_TARIFFS.some((item) => item.id === value);
}

export type HealthInsuranceGoalId =
  (typeof HEALTH_INSURANCE_GOALS)[number]["id"];

export function isHealthInsuranceGoalId(
  value: string,
): value is HealthInsuranceGoalId {
  return HEALTH_INSURANCE_GOALS.some((item) => item.id === value);
}

/**
 * Derived from the legacy tariff step (`no_insurance` → non).
 * On the primary LP, the goal step sets alreadyInsured to "oui" instead.
 */
export function deriveAlreadyInsured(
  tariff: CurrentMutualTariffId | "",
): "oui" | "non" | "" {
  if (!tariff) return "";
  return tariff === "no_insurance" ? "non" : "oui";
}

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
  professionalStatus: ProfessionalStatusId | "";
  /** Optional legacy tariff — still mapped to Vertikl `cost_health` when present. */
  currentMutualTariff: CurrentMutualTariffId | "";
  /** Primary LP first-step answer → Vertikl `health_insurance_goal`. */
  healthInsuranceGoal: HealthInsuranceGoalId | "";
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
  professionalStatus: "",
  currentMutualTariff: "",
  healthInsuranceGoal: "",
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
  | "currentMutualTariff"
  | "coveredPersons"
  | "professionalStatus"
  | "birthAndPostal"
  | "birthDate"
  | "postalCode"
  | "careNeeds"
  | "alreadyInsured"
  | "analyzing"
  | "contact"
  | "confirmation";

export const FORM_STEPS: FormStepId[] = [
  "currentMutualTariff",
  "coveredPersons",
  "professionalStatus",
  "birthAndPostal",
  "birthDate",
  "postalCode",
  "careNeeds",
  "alreadyInsured",
  "analyzing",
  "contact",
  "confirmation",
];
