"use client";

import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import {
  formatBirthDateInput,
  getBirthDateAgeError,
  validateStep,
  type FieldErrors,
} from "./validation";
import {
  SENIOR_ERROR,
  SENIOR_LABEL,
  useFormInputClass,
  useQuestionTitleClass,
  useSeniorForm,
} from "./seniorForm";
import { normalizePostalCode } from "@/lib/location-service";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  hideOwnBirthDate?: boolean;
  hidePostalCode?: boolean;
  onChangeBirthDate: (value: string) => void;
  onPostalCode: (value: string) => void;
  onNext: () => void;
};

export function StepBirthAndPostal({
  data,
  errors,
  disabled = false,
  hideOwnBirthDate = false,
  hidePostalCode = false,
  onChangeBirthDate,
  onPostalCode,
  onNext,
}: Props) {
  const senior = useSeniorForm();
  const seniorTitleClass = useQuestionTitleClass();
  const titleClass = senior
    ? seniorTitleClass
    : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl";
  const labelClass = senior
    ? SENIOR_LABEL
    : "block text-sm font-medium text-foreground";
  const inputClass = useFormInputClass();
  const errorClass = senior ? SENIOR_ERROR : "mt-2 text-sm text-error";

  const ownAgeError = hideOwnBirthDate
    ? null
    : getBirthDateAgeError(data.birthDate);

  const stepErrors: FieldErrors = { ...validateStep("birthAndPostal", data) };
  if (hideOwnBirthDate) delete stepErrors.birthDate;
  if (hidePostalCode) {
    delete stepErrors.postalCode;
  }
  const canContinue =
    Object.keys(stepErrors).length === 0 &&
    (hideOwnBirthDate || !ownAgeError);

  return (
    <div>
      <h2 className={titleClass}>
        Quelques informations pour trouver les offres adaptées
      </h2>

      <div className={senior ? "mt-4 space-y-4" : "mt-5 space-y-4"}>
        {hideOwnBirthDate ? null : (
          <div>
            <label htmlFor="birthDate" className={labelClass}>
              Votre date de naissance
            </label>
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
              className={inputClass}
            />
            {errors.birthDate ? (
              <p className={errorClass} role="alert">
                {errors.birthDate}
              </p>
            ) : data.birthDate.length === 10 && ownAgeError ? (
              <p className={errorClass} role="alert">
                {ownAgeError}
              </p>
            ) : null}
          </div>
        )}

        {hidePostalCode ? null : (
          <div>
            <label htmlFor="postalCode" className={labelClass}>
              Votre code postal
            </label>
            <input
              id="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder={senior ? "Ex. 13006" : "75001"}
              value={data.postalCode}
              disabled={disabled}
              onChange={(event) =>
                onPostalCode(normalizePostalCode(event.target.value))
              }
              className={inputClass}
            />
            {errors.postalCode ? (
              <p className={errorClass} role="alert">
                {errors.postalCode}
              </p>
            ) : null}
          </div>
        )}
      </div>

      <FormNavigation
        onNext={onNext}
        disabled={disabled}
        canContinue={canContinue}
      />
    </div>
  );
}
