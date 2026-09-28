import type { FormStepId } from "./types";

/**
 * Temporary switch for the care-priorities question
 * (« Qu’est-ce qui compte le plus pour vous dans votre mutuelle ? »).
 *
 * Set to `true` to show the step again. Do not delete StepCareNeeds.
 */
export const SHOW_CARE_PRIORITIES_STEP = false;

/**
 * The yes/no “already insured” question is derived from the tariff step.
 * Keep StepAlreadyInsured — set to `true` to show it again.
 */
export const SHOW_ALREADY_INSURED_STEP = false;

/** Own date of birth + postal code on one screen. Spouse DOB stays later. */
export const COMBINE_BIRTH_AND_POSTAL_STEP = true;

/**
 * Spouse date of birth (after “Moi et mon conjoint”).
 * Keep StepBirthDate spouse UI — set to `true` to ask it again.
 */
export const SHOW_SPOUSE_BIRTH_DATE_STEP = false;

export function isHiddenFormStep(step: FormStepId): boolean {
  if (step === "careNeeds" && !SHOW_CARE_PRIORITIES_STEP) return true;
  return false;
}
