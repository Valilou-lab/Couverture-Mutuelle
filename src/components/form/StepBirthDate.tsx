"use client";

import { useEffect, useRef } from "react";
import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import {
  formatBirthDateInput,
  getBirthDateAgeError,
  isValidBirthDate,
  needsSpouseBirthDate,
  type FieldErrors,
} from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  /** When true, own DOB is already known (ex. calculateur) and not shown. */
  hideOwnBirthDate?: boolean;
  onChangeBirthDate: (value: string) => void;
  onChangeSpouseBirthDate: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function hasAnsweredOwnBirthDate(value: string): boolean {
  return value.length === 10 && isValidBirthDate(value);
}

export function StepBirthDate({
  data,
  errors,
  disabled = false,
  hideOwnBirthDate = false,
  onChangeBirthDate,
  onChangeSpouseBirthDate,
  onBack,
  onNext,
}: Props) {
  const spouseInputRef = useRef<HTMLInputElement>(null);
  const wasSpouseVisible = useRef(false);
  const showSpouseOption = needsSpouseBirthDate(data);
  const showOwn = !hideOwnBirthDate;
  const ownAnswered = hideOwnBirthDate || hasAnsweredOwnBirthDate(data.birthDate);
  const showSpouseField =
    showSpouseOption && (ownAnswered || Boolean(data.spouseBirthDate));

  useEffect(() => {
    const justAppeared = showSpouseField && !wasSpouseVisible.current;
    wasSpouseVisible.current = showSpouseField;
    if (!justAppeared || disabled) return;
    const id = window.requestAnimationFrame(() => {
      spouseInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [showSpouseField, disabled]);

  const title = showSpouseField
    ? showOwn
      ? "Vos dates de naissance"
      : "Date de naissance de votre conjoint"
    : "Votre date de naissance";

  const ownAgeError = showOwn ? getBirthDateAgeError(data.birthDate) : null;

  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {showOwn ? (
          <div>
            {showSpouseOption ? (
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-foreground"
              >
                Votre date de naissance
              </label>
            ) : null}
            <input
              id="birthDate"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="JJ/MM/AAAA"
              value={data.birthDate}
              disabled={disabled}
              onChange={(event) =>
                onChangeBirthDate(formatBirthDateInput(event.target.value))
              }
              className={`min-h-14 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 placeholder:text-zinc-300 focus:ring-2 ${
                showSpouseOption ? "mt-2" : ""
              }`}
            />
            {errors.birthDate ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {errors.birthDate}
              </p>
            ) : ownAnswered && ownAgeError ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {ownAgeError}
              </p>
            ) : null}
          </div>
        ) : null}

        {showSpouseField ? (
          <div className="animate-[form-step-in_280ms_ease-out]">
            <label
              htmlFor="spouseBirthDate"
              className="block text-sm font-medium text-foreground"
            >
              Date de naissance de votre conjoint
            </label>
            <input
              ref={spouseInputRef}
              id="spouseBirthDate"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="JJ/MM/AAAA"
              value={data.spouseBirthDate}
              disabled={disabled}
              onChange={(event) =>
                onChangeSpouseBirthDate(
                  formatBirthDateInput(event.target.value),
                )
              }
              className="mt-2 min-h-14 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 placeholder:text-zinc-300 focus:ring-2"
            />
            {errors.spouseBirthDate ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {errors.spouseBirthDate}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <FormNavigation onBack={onBack} onNext={onNext} disabled={disabled} />
    </div>
  );
}
