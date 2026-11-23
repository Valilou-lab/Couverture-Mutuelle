export type EligiblePartner = {
  id: string;
  name: string;
  /** Vertikl buyer UUID when eligibility comes from precheck. */
  vertiklBuyerId?: string;
};

export type EligibilityStatus =
  | "reserved"
  | "no_eligible_partner"
  | "technical_error";

export type EligibilityResponse = {
  eligible: boolean;
  status?: EligibilityStatus;
  partners: EligiblePartner[];
  /** Opaque server proof — required later by `/api/v2/leads`. Null when none. */
  eligibilityToken: string | null;
  expiresAt?: string;
  precheckId?: string;
  reason?: string;
};

/** Criteria sent to `/api/v2/eligibility` — no commercial rules in the front. */
export type EligibilityRequestPayload = {
  firstName: string;
  lastName: string;
  healthInsuranceGoal: string;
  coveredPersons: string;
  professionalStatus: string;
  alreadyInsured: string;
  birthDate: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
};

export type EligibilityClientResult = {
  status: EligibilityStatus;
  partners: EligiblePartner[];
  eligibilityToken: string | null;
  expiresAt?: string;
  reason?: string;
};

export type V2StepId =
  | "careNeeds"
  | "age"
  | "currentMutualTariff"
  | "coveredPersons"
  | "professionalStatus"
  | "birthAndPostal"
  | "identity"
  | "email"
  | "phone"
  | "searching"
  | "eligiblePartners"
  | "phoneVerify"
  | "confirmation";

export type V2FormVariantOptions = {
  /** `/tranches-age` — age first; DOB synthesized as 15/06/YYYY for Vertikl. */
  askAgeInsteadOfBirthDate?: boolean;
  /** `/reste-a-charge` — care priorities first (acquire extra `priority_care`). */
  askCareNeedsFirst?: boolean;
};

/** Default `/devis` questions (progress bar) — email then phone, separate. */
export const V2_QUESTION_STEPS: V2StepId[] = [
  "currentMutualTariff",
  "coveredPersons",
  "professionalStatus",
  "birthAndPostal",
  "identity",
  "email",
  "phone",
];

/** Phone → SMS verify (mobile) → buyer precheck → partners → confirmation. */
export const V2_FLOW_STEPS: V2StepId[] = [
  ...V2_QUESTION_STEPS,
  "phoneVerify",
  "searching",
  "eligiblePartners",
  "confirmation",
];

/**
 * Question order for a LP variant. Technical tail (OTP → precheck → consent
 * → acquire) is always identical; only marketing-first steps differ.
 */
export function getV2QuestionSteps(
  options: V2FormVariantOptions = {},
): V2StepId[] {
  const steps: V2StepId[] = [];
  if (options.askCareNeedsFirst) steps.push("careNeeds");
  if (options.askAgeInsteadOfBirthDate) steps.push("age");
  steps.push(
    "currentMutualTariff",
    "coveredPersons",
    "professionalStatus",
    "birthAndPostal",
    "identity",
    "email",
    "phone",
  );
  return steps;
}

export function getV2FlowSteps(
  options: V2FormVariantOptions = {},
): V2StepId[] {
  return [
    ...getV2QuestionSteps(options),
    "phoneVerify",
    "searching",
    "eligiblePartners",
    "confirmation",
  ];
}

/** Minimum time on the searching screen even if eligibility is instant. */
export const ELIGIBILITY_MIN_LOADING_MS = 4000;

/**
 * True from question 2 through the end of the V2 flow.
 * Used by `/devis` to drop the hero title and free space for form reassurance.
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
