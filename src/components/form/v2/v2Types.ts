export type EligiblePartner = {
  id: string;
  name: string;
};

export type EligibilityResponse = {
  eligible: boolean;
  partners: EligiblePartner[];
  /** Opaque server proof — required later by `/api/v2/leads`. */
  eligibilityToken: string;
};

/** Criteria sent to `/api/v2/eligibility` — no commercial rules in the front. */
export type EligibilityRequestPayload = {
  healthInsuranceGoal: string;
  coveredPersons: string;
  professionalStatus: string;
  birthDate: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
};

export type EligibilityClientResult = {
  partners: EligiblePartner[];
  eligibilityToken: string;
};

export type V2StepId =
  | "currentMutualTariff"
  | "coveredPersons"
  | "professionalStatus"
  | "birthAndPostal"
  | "contact"
  | "searching"
  | "eligiblePartners"
  | "phoneVerify"
  | "confirmation";

/** Questions 1–5 (progress bar). */
export const V2_QUESTION_STEPS: V2StepId[] = [
  "currentMutualTariff",
  "coveredPersons",
  "professionalStatus",
  "birthAndPostal",
  "contact",
];

export const V2_FLOW_STEPS: V2StepId[] = [
  ...V2_QUESTION_STEPS,
  "searching",
  "eligiblePartners",
  "phoneVerify",
  "confirmation",
];

/** Minimum time on the searching screen even if eligibility is instant. */
export const ELIGIBILITY_MIN_LOADING_MS = 4000;

/**
 * True from question 2 through the end of the V2 flow.
 * Used by `/devis` to hide landing content below the form.
 */
export function isV2FormFocusStep(
  step: V2StepId,
  questionNumber: number | null,
): boolean {
  if (
    step === "searching" ||
    step === "eligiblePartners" ||
    step === "phoneVerify" ||
    step === "confirmation"
  ) {
    return true;
  }
  return questionNumber != null && questionNumber >= 2;
}
