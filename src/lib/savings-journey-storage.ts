import type {
  CalculatorAnswers,
  MutualTenureId,
  ProtectionLevelId,
} from "@/context/QuoteJourneyContext";
import type { CalculatorEstimateSnapshot } from "@/lib/quote-lead";

const STORAGE_KEY = "cm-savings-journey-v1";

export type SavingsJourneySnapshot = {
  calculator: CalculatorAnswers;
  estimate: CalculatorEstimateSnapshot;
};

export function saveSavingsJourneySnapshot(
  snapshot: SavingsJourneySnapshot,
): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function loadSavingsJourneySnapshot(): SavingsJourneySnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavingsJourneySnapshot;
    if (!parsed?.calculator || !parsed?.estimate) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSavingsJourneySnapshot(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isSavingsJourneyReady(snapshot: {
  calculator: CalculatorAnswers;
  estimate: CalculatorEstimateSnapshot | null;
}): boolean {
  return Boolean(
    snapshot.estimate &&
      snapshot.calculator.birthDate &&
      snapshot.calculator.postalCode &&
      snapshot.calculator.city &&
      snapshot.calculator.monthlyBudget &&
      snapshot.calculator.mutualTenure &&
      snapshot.calculator.protectionLevel,
  );
}

export type { MutualTenureId, ProtectionLevelId };
