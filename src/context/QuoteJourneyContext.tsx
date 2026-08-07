"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isValidBirthDate } from "@/components/form/validation";
import {
  isEligibleBirthDate,
  type SavingsEngineResult,
} from "@/lib/savings-engine";
import {
  buildCalculatorLeadFields,
  type CalculatorEstimateSnapshot,
  type CalculatorLeadFields,
} from "@/lib/quote-lead";
import type { CompleteSavingsLead } from "@/lib/savings-lead";

export const MUTUAL_TENURES = [
  { id: "moins-2-ans", label: "Moins de 2 ans" },
  { id: "2-5-ans", label: "Entre 2 et 5 ans" },
  { id: "plus-5-ans", label: "Plus de 5 ans" },
] as const;

export const PROTECTION_LEVELS = [
  {
    id: "essentiel",
    label: "Essentiel",
    description: "Remboursements de base, idéal pour maîtriser son budget.",
    shortDescription: "Remboursements de base, budget maîtrisé.",
    icon: "shield",
  },
  {
    id: "confort",
    label: "Confort",
    description: "Bon équilibre entre tarif et remboursements.",
    shortDescription: "Bon équilibre tarif / remboursements.",
    icon: "heart",
  },
  {
    id: "premium",
    label: "Premium",
    description:
      "Excellente couverture pour les soins courants, l’optique et le dentaire.",
    shortDescription: "Soins courants, optique et dentaire.",
    icon: "star",
  },
  {
    id: "serenite-plus",
    label: "Sérénité +",
    description:
      "Protection maximale avec les remboursements les plus élevés.",
    shortDescription: "Protection maximale, remboursements élevés.",
    icon: "crown",
  },
] as const;

export type MutualTenureId = (typeof MUTUAL_TENURES)[number]["id"];
export type ProtectionLevelId = (typeof PROTECTION_LEVELS)[number]["id"];
export type ProtectionIconId = (typeof PROTECTION_LEVELS)[number]["icon"];

/** Réponses du calculateur — disponibles partout via useQuoteJourney() */
export type CalculatorAnswers = {
  birthDate: string;
  postalCode: string;
  city: string;
  monthlyBudget: string;
  mutualTenure: MutualTenureId | "";
  protectionLevel: ProtectionLevelId | "";
};

export const initialCalculatorAnswers: CalculatorAnswers = {
  birthDate: "",
  postalCode: "",
  city: "",
  monthlyBudget: "",
  mutualTenure: "",
  protectionLevel: "",
};

export const MONTHLY_BUDGET_MIN = 20;
export const MONTHLY_BUDGET_MAX = 300;

export function isValidMonthlyBudget(value: string): boolean {
  if (!/^\d+$/.test(value.trim())) return false;
  const amount = Number(value);
  return amount >= MONTHLY_BUDGET_MIN && amount <= MONTHLY_BUDGET_MAX;
}

function toEstimateSnapshot(
  result: SavingsEngineResult,
): CalculatorEstimateSnapshot {
  return {
    savingsResultType: result.resultType,
    estimatedAnnualSaving: result.yearlySavings,
    estimatedMonthlySaving: result.monthlySavings,
    estimatedMonthlyPremium: result.estimatedMonthlyPremium,
    yearlySavingsMin: result.yearlySavingsMin,
    yearlySavingsMax: result.yearlySavingsMax,
    title: result.title,
    message: result.message,
    ctaLabel: result.ctaLabel,
    reasons: result.reasons,
    benefits: result.benefits,
    disclaimer: result.disclaimer,
  };
}

type QuoteJourneyContextValue = {
  calculator: CalculatorAnswers;
  setCalculator: (partial: Partial<CalculatorAnswers>) => void;
  resetCalculator: () => void;
  estimate: CalculatorEstimateSnapshot | null;
  setEstimateFromEngine: (result: SavingsEngineResult) => void;
  restoreEstimateSnapshot: (snapshot: CalculatorEstimateSnapshot) => void;
  clearEstimate: () => void;
  /** API-ready calculator fields (not sent yet). */
  calculatorLeadFields: CalculatorLeadFields;
  hasBirthDateFromCalculator: boolean;
  hasLocationFromCalculator: boolean;
  isCalculatorComplete: boolean;
  /** Bumped when CTA asks the main #devis form to focus (legacy). */
  formFocusToken: number;
  requestQuoteFormFocus: () => void;
  /** Bumped when CTA opens the savings-dedicated quote form. */
  savingsQuoteFocusToken: number;
  requestSavingsQuoteFocus: () => void;
  /** Final merged lead from calculator + SavingsQuoteForm (not sent yet). */
  completeSavingsLead: CompleteSavingsLead | null;
  setCompleteSavingsLead: (lead: CompleteSavingsLead | null) => void;
};

const QuoteJourneyContext = createContext<QuoteJourneyContextValue | null>(
  null,
);

export function QuoteJourneyProvider({ children }: { children: ReactNode }) {
  const [calculator, setCalculatorState] = useState<CalculatorAnswers>(
    initialCalculatorAnswers,
  );
  const [estimate, setEstimate] = useState<CalculatorEstimateSnapshot | null>(
    null,
  );
  const [formFocusToken, setFormFocusToken] = useState(0);
  const [savingsQuoteFocusToken, setSavingsQuoteFocusToken] = useState(0);
  const [completeSavingsLead, setCompleteSavingsLeadState] =
    useState<CompleteSavingsLead | null>(null);

  const setCalculator = useCallback((partial: Partial<CalculatorAnswers>) => {
    setCalculatorState((current) => ({ ...current, ...partial }));
  }, []);

  const resetCalculator = useCallback(() => {
    setCalculatorState(initialCalculatorAnswers);
    setEstimate(null);
    setCompleteSavingsLeadState(null);
  }, []);

  const setEstimateFromEngine = useCallback((result: SavingsEngineResult) => {
    setEstimate(toEstimateSnapshot(result));
  }, []);

  const restoreEstimateSnapshot = useCallback(
    (snapshot: CalculatorEstimateSnapshot) => {
      setEstimate(snapshot);
    },
    [],
  );

  const clearEstimate = useCallback(() => {
    setEstimate(null);
  }, []);

  const requestQuoteFormFocus = useCallback(() => {
    setFormFocusToken((token) => token + 1);
  }, []);

  const requestSavingsQuoteFocus = useCallback(() => {
    setSavingsQuoteFocusToken((token) => token + 1);
  }, []);

  const setCompleteSavingsLead = useCallback(
    (lead: CompleteSavingsLead | null) => {
      setCompleteSavingsLeadState(lead);
    },
    [],
  );

  const hasBirthDateFromCalculator =
    isValidBirthDate(calculator.birthDate) &&
    isEligibleBirthDate(calculator.birthDate);

  const hasLocationFromCalculator =
    /^\d{5}$/.test(calculator.postalCode) && Boolean(calculator.city.trim());

  const isCalculatorComplete =
    hasBirthDateFromCalculator &&
    isValidMonthlyBudget(calculator.monthlyBudget) &&
    Boolean(calculator.mutualTenure) &&
    Boolean(calculator.protectionLevel);

  const calculatorLeadFields = useMemo(
    () =>
      buildCalculatorLeadFields({
        birthDate: calculator.birthDate,
        postalCode: calculator.postalCode,
        city: calculator.city,
        monthlyBudget: calculator.monthlyBudget,
        mutualTenure: calculator.mutualTenure,
        protectionLevel: calculator.protectionLevel,
        estimate,
      }),
    [calculator, estimate],
  );

  const value = useMemo(
    () => ({
      calculator,
      setCalculator,
      resetCalculator,
      estimate,
      setEstimateFromEngine,
      restoreEstimateSnapshot,
      clearEstimate,
      calculatorLeadFields,
      hasBirthDateFromCalculator,
      hasLocationFromCalculator,
      isCalculatorComplete,
      formFocusToken,
      requestQuoteFormFocus,
      savingsQuoteFocusToken,
      requestSavingsQuoteFocus,
      completeSavingsLead,
      setCompleteSavingsLead,
    }),
    [
      calculator,
      setCalculator,
      resetCalculator,
      estimate,
      setEstimateFromEngine,
      restoreEstimateSnapshot,
      clearEstimate,
      calculatorLeadFields,
      hasBirthDateFromCalculator,
      hasLocationFromCalculator,
      isCalculatorComplete,
      formFocusToken,
      requestQuoteFormFocus,
      savingsQuoteFocusToken,
      requestSavingsQuoteFocus,
      completeSavingsLead,
      setCompleteSavingsLead,
    ],
  );

  return (
    <QuoteJourneyContext.Provider value={value}>
      {children}
    </QuoteJourneyContext.Provider>
  );
}

export function useQuoteJourney() {
  const context = useContext(QuoteJourneyContext);
  if (!context) {
    throw new Error(
      "useQuoteJourney must be used within QuoteJourneyProvider",
    );
  }
  return context;
}
