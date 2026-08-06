import type { QuoteFormData } from "@/components/form/types";
import type {
  CalculatorEstimateSnapshot,
  CalculatorLeadFields,
} from "@/lib/quote-lead";

/**
 * Complete lead payload for users from the savings calculator journey.
 * Ready for a future API — not sent yet.
 */
export type CompleteSavingsLead = {
  // From calculator
  birthDate: string;
  postalCode: string;
  city: string;
  currentMonthlyPremium: number | null;
  insurerTenure: CalculatorLeadFields["insurerTenure"];
  protectionLevel: CalculatorLeadFields["protectionLevel"];
  estimatedAnnualSaving: number | null;
  estimatedMonthlySaving: number | null;
  estimatedMonthlyPremium: number | null;
  estimatedAnnualSavingMin: number | null;
  estimatedAnnualSavingMax: number | null;
  savingsResultType: CalculatorLeadFields["savingsResultType"];

  // From SavingsQuoteForm
  careNeeds: QuoteFormData["careNeeds"];
  coveredPersons: QuoteFormData["coveredPersons"];
  spouseBirthDate: string;
  familyStatus: QuoteFormData["familyStatus"];
  healthRegime: QuoteFormData["healthRegime"];
  alreadyInsured: QuoteFormData["alreadyInsured"];
  insurer: string;
  civility: QuoteFormData["civility"];
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  consent: boolean;

  source: "savings-calculator";
};

export function buildCompleteSavingsLead(input: {
  calculatorLead: CalculatorLeadFields;
  estimate: CalculatorEstimateSnapshot | null;
  form: QuoteFormData;
}): CompleteSavingsLead {
  const { calculatorLead, estimate, form } = input;

  return {
    birthDate: calculatorLead.birthDate || form.birthDate,
    postalCode: calculatorLead.postalCode || form.postalCode,
    city: calculatorLead.city || form.city,
    currentMonthlyPremium: calculatorLead.currentMonthlyPremium,
    insurerTenure: calculatorLead.insurerTenure,
    protectionLevel: calculatorLead.protectionLevel,
    estimatedAnnualSaving: calculatorLead.estimatedAnnualSaving,
    estimatedMonthlySaving: calculatorLead.estimatedMonthlySaving,
    estimatedMonthlyPremium: calculatorLead.estimatedMonthlyPremium,
    estimatedAnnualSavingMin: estimate?.yearlySavingsMin ?? null,
    estimatedAnnualSavingMax: estimate?.yearlySavingsMax ?? null,
    savingsResultType: calculatorLead.savingsResultType,

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

    source: "savings-calculator",
  };
}
