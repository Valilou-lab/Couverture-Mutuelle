"use client";

import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { formatBirthDateInput, type FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepBirthDate({
  data,
  errors,
  disabled = false,
  onChange,
  onBack,
  onNext,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quelle est votre date de naissance ?
      </h2>
      <p className="mt-2 text-sm text-zinc-600 sm:text-base">
        Format attendu : JJ/MM/AAAA
      </p>
      <input
        id="birthDate"
        inputMode="numeric"
        autoComplete="bday"
        placeholder="JJ/MM/AAAA"
        value={data.birthDate}
        disabled={disabled}
        onChange={(event) => onChange(formatBirthDateInput(event.target.value))}
        className="mt-5 min-h-14 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
      />
      {errors.birthDate ? (
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.birthDate}
        </p>
      ) : null}
      <FormNavigation onBack={onBack} onNext={onNext} disabled={disabled} />
    </div>
  );
}
