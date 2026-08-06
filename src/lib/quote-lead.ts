import type { QuoteFormData } from "@/components/form/types";
import type {
  SavingsProtectionLevelId,
  SavingsResultType,
  SavingsTenureId,
} from "@/lib/savings-engine";

/**
 * Calculator-sourced fields ready for a future lead API.
 * Not sent anywhere yet — continuity / payload preview only.
 */
export type CalculatorLeadFields = {
  birthDate: string;
  postalCode: string;
  city: string;
  currentMonthlyPremium: number | null;
  insurerTenure: SavingsTenureId | "";
  protectionLevel: SavingsProtectionLevelId | "";
  estimatedAnnualSaving: number | null;
  estimatedMonthlySaving: number | null;
  estimatedMonthlyPremium: number | null;
  savingsResultType: SavingsResultType | "";
};

export type CalculatorEstimateSnapshot = {
  savingsResultType: SavingsResultType;
  estimatedAnnualSaving: number;
  estimatedMonthlySaving: number;
  estimatedMonthlyPremium: number;
  yearlySavingsMin: number | null;
  yearlySavingsMax: number | null;
  title: string;
  message: string;
  ctaLabel: string;
  reasons: string[];
  benefits: string[];
  disclaimer: string;
};

export function buildCalculatorLeadFields(input: {
  birthDate: string;
  postalCode: string;
  city: string;
  monthlyBudget: string;
  mutualTenure: SavingsTenureId | "";
  protectionLevel: SavingsProtectionLevelId | "";
  estimate: CalculatorEstimateSnapshot | null;
}): CalculatorLeadFields {
  const premium = Number(input.monthlyBudget);
  return {
    birthDate: input.birthDate,
    postalCode: input.postalCode,
    city: input.city,
    currentMonthlyPremium: Number.isFinite(premium) ? premium : null,
    insurerTenure: input.mutualTenure,
    protectionLevel: input.protectionLevel,
    estimatedAnnualSaving: input.estimate?.estimatedAnnualSaving ?? null,
    estimatedMonthlySaving: input.estimate?.estimatedMonthlySaving ?? null,
    estimatedMonthlyPremium: input.estimate?.estimatedMonthlyPremium ?? null,
    savingsResultType: input.estimate?.savingsResultType ?? "",
  };
}

/**
 * Merges form answers + calculator lead fields for a future API payload.
 * Does not send anything.
 */
export function buildQuoteLeadPreview(
  form: QuoteFormData,
  calculatorLead: CalculatorLeadFields,
) {
  return {
    ...calculatorLead,
    birthDate: calculatorLead.birthDate || form.birthDate,
    postalCode: calculatorLead.postalCode || form.postalCode,
    city: calculatorLead.city || form.city,
    careNeeds: form.careNeeds,
    coveredPersons: form.coveredPersons,
    spouseBirthDate: form.spouseBirthDate,
    familyStatus: form.familyStatus,
    healthRegime: form.healthRegime,
    alreadyInsured: form.alreadyInsured,
    insurer: form.insurer,
    civility: form.civility,
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    email: form.email,
    consent: form.consent,
  };
}
