export type EligiblePartner = {
  id: string;
  name: string;
};

export type EligibilityResponse = {
  eligible: boolean;
  partners: EligiblePartner[];
};

export type ComplianceStepId =
  | "currentMutualTariff"
  | "coveredPersons"
  | "professionalStatus"
  | "birthAndPostal"
  | "contact"
  | "searching"
  | "eligiblePartners"
  | "phoneVerify"
  | "confirmation";

/** Questions 1–5 (progress bar). Loading + post-eligibility hide the bar. */
export const COMPLIANCE_QUESTION_STEPS: ComplianceStepId[] = [
  "currentMutualTariff",
  "coveredPersons",
  "professionalStatus",
  "birthAndPostal",
  "contact",
];

export const COMPLIANCE_FLOW_STEPS: ComplianceStepId[] = [
  ...COMPLIANCE_QUESTION_STEPS,
  "searching",
  "eligiblePartners",
  "phoneVerify",
  "confirmation",
];

/** Minimum time on the searching screen even if /api/eligibility is instant. */
export const ELIGIBILITY_MIN_LOADING_MS = 4000;
