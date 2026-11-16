"use client";

import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { validateStep, type FieldErrors } from "./validation";
import { normalizePostalCode } from "@/lib/location-service";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPostalCode: (value: string) => void;
  onNext: () => void;
};

/** Standalone postal step — kept for when COMBINE_BIRTH_AND_POSTAL_STEP is off. */
export function StepPostalCode({
  data,
  errors,
  disabled = false,
  onPostalCode,
  onNext,
}: Props) {
  const canContinue =
    Object.keys(validateStep("postalCode", data)).length === 0;

  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quel est votre code postal ?
      </h2>
      <p className="mt-2 text-center text-sm text-zinc-600 sm:text-base">
        Indiquez le code postal à 5 chiffres de votre résidence.
      </p>

      <input
        id="postalCodeStandalone"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={5}
        placeholder="75001"
        aria-label="Code postal"
        value={data.postalCode}
        onChange={(event) =>
          onPostalCode(normalizePostalCode(event.target.value))
        }
        className="mt-5 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2"
      />
      {errors.postalCode ? (
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.postalCode}
        </p>
      ) : null}

      <FormNavigation
        onNext={onNext}
        disabled={disabled}
        canContinue={canContinue}
      />
    </div>
  );
}
