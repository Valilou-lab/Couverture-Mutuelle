"use client";

import { useQuoteJourney } from "@/context/QuoteJourneyContext";
import {
  isValidFrenchPostalCode,
  normalizePostalCode,
} from "@/lib/location-service";

type Props = {
  questionNumber?: number;
};

export function CalculatorLocationFields({ questionNumber = 2 }: Props) {
  const { calculator, setCalculator } = useQuoteJourney();
  const postalCode = calculator.postalCode;
  const showInvalidHint =
    postalCode.length === 5 && !isValidFrenchPostalCode(postalCode);

  function handlePostalCodeChange(value: string) {
    setCalculator({ postalCode: normalizePostalCode(value), city: "" });
  }

  return (
    <div>
      <p className="text-center font-manrope text-base font-semibold text-[#3b0764] sm:text-lg">
        {questionNumber}. Où habitez-vous&nbsp;?
      </p>

      <input
        id="calculator-postalCode"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="75001"
        maxLength={5}
        aria-label="Code postal"
        value={postalCode}
        onChange={(event) => handlePostalCodeChange(event.target.value)}
        aria-invalid={showInvalidHint}
        aria-describedby={
          showInvalidHint ? "calculator-postalCode-error" : undefined
        }
        className={`mt-3 min-h-14 w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-foreground outline-none ring-brand/30 placeholder:text-brand-muted focus:ring-2 ${
          showInvalidHint ? "border-error/50" : "border-border"
        }`}
      />

      {showInvalidHint ? (
        <p
          id="calculator-postalCode-error"
          className="mt-2 text-xs text-error"
          role="alert"
        >
          Saisissez un code postal français valide (5 chiffres).
        </p>
      ) : null}
    </div>
  );
}
