"use client";

import { useEffect, useState } from "react";
import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import {
  declaredAgeFromBirthDate,
  getDeclaredAgeError,
  parseDeclaredAgeInput,
} from "@/lib/age-to-birth-date";
import type { FieldErrors } from "./validation";
import {
  SENIOR_ERROR,
  useFormInputClass,
  useQuestionTitleClass,
  useSeniorForm,
} from "./seniorForm";

const QUESTION = "Quel âge avez-vous ?";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onConfirm: (age: number) => void;
};

export function StepAge({
  data,
  errors,
  disabled = false,
  onConfirm,
}: Props) {
  const senior = useSeniorForm();
  const questionTitleClass = useQuestionTitleClass();
  const inputClass = useFormInputClass();
  const [rawAge, setRawAge] = useState(() => {
    const fromDate = declaredAgeFromBirthDate(data.birthDate);
    return fromDate != null ? String(fromDate) : "";
  });

  useEffect(() => {
    const fromDate = declaredAgeFromBirthDate(data.birthDate);
    if (fromDate != null) setRawAge(String(fromDate));
  }, [data.birthDate]);

  const parsed = parseDeclaredAgeInput(rawAge);
  const ageError = parsed == null ? null : getDeclaredAgeError(parsed);
  const canContinue = parsed != null && ageError == null;

  const titleClass = senior
    ? questionTitleClass
    : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl";

  return (
    <div>
      <h2 className={titleClass}>{QUESTION}</h2>
      <div className={senior ? "mt-4" : "mt-5"}>
        <label htmlFor="declared-age" className="sr-only">
          {QUESTION}
        </label>
        <input
          id="declared-age"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Âge"
          value={rawAge}
          disabled={disabled}
          onChange={(event) =>
            setRawAge(event.target.value.replace(/\D/g, "").slice(0, 3))
          }
          className={inputClass}
          aria-invalid={Boolean(errors.birthDate || ageError)}
        />
        {errors.birthDate ? (
          <p className={senior ? SENIOR_ERROR : "mt-2 text-sm text-error"} role="alert">
            {errors.birthDate}
          </p>
        ) : ageError ? (
          <p className={senior ? SENIOR_ERROR : "mt-2 text-sm text-error"} role="alert">
            {ageError}
          </p>
        ) : null}
      </div>
      <FormNavigation
        onNext={() => {
          if (parsed == null || ageError) return;
          onConfirm(parsed);
        }}
        disabled={disabled}
        canContinue={canContinue}
      />
    </div>
  );
}
