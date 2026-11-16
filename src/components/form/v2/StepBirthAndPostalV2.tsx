"use client";

import type { QuoteFormData } from "@/components/form/types";
import { FormNavigation } from "@/components/form/FormNavigation";
import {
  validateStep,
  type FieldErrors,
} from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_INPUT,
  SENIOR_LABEL,
  useFormInputClass,
  useQuestionTitleClass,
  useSeniorForm,
} from "@/components/form/seniorForm";
import { normalizePostalCode } from "@/lib/location-service";
import {
  formatV2BirthDateInput,
  getV2BirthDateInputError,
  isV2BirthDateCompleteAndValid,
} from "./birthDateInput";

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

/**
 * V2 birth + postal step — enhanced JJ/MM/AAAA mask + immediate day/month checks.
 * Isolated from production StepBirthAndPostal.
 */
export function StepBirthAndPostalV2({
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
  const questionTitleClass = useQuestionTitleClass();
  const formInputClass = useFormInputClass();
  const titleClass = senior
    ? questionTitleClass
    : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl";
  const labelClass = senior
    ? SENIOR_LABEL
    : "block text-sm font-medium text-foreground";
  const inputClass = senior ? formInputClass || SENIOR_INPUT : undefined;
  const errorClass = senior ? SENIOR_ERROR : "mt-2 text-sm text-error";

  const birthInputError = hideOwnBirthDate
    ? null
    : getV2BirthDateInputError(data.birthDate);

  const stepErrors: FieldErrors = { ...validateStep("birthAndPostal", data) };
  if (hideOwnBirthDate) delete stepErrors.birthDate;
  if (hidePostalCode) delete stepErrors.postalCode;

  const stepIncomplete =
    Object.keys(stepErrors).length > 0 ||
    Boolean(birthInputError) ||
    (!hideOwnBirthDate && !isV2BirthDateCompleteAndValid(data.birthDate));

  return (
    <div>
      <h2 className={titleClass}>
        Quelques informations pour trouver les offres adaptées
      </h2>

      <div className={senior ? "mt-4 space-y-4" : "mt-5 space-y-4"}>
        {hideOwnBirthDate ? null : (
          <div>
            <label htmlFor="v2-birthDate" className={labelClass}>
              Votre date de naissance
            </label>
            <input
              id="v2-birthDate"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="JJ/MM/AAAA"
              maxLength={10}
              value={data.birthDate}
              disabled={disabled}
              onChange={(event) =>
                onChangeBirthDate(
                  formatV2BirthDateInput(event.target.value, data.birthDate),
                )
              }
              className={
                senior
                  ? inputClass
                  : "mt-2 min-h-14 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 placeholder:text-zinc-300 focus:border-brand focus:ring-2"
              }
              aria-invalid={Boolean(errors.birthDate || birthInputError)}
            />
            {errors.birthDate ? (
              <p className={errorClass} role="alert">
                {errors.birthDate}
              </p>
            ) : birthInputError ? (
              <p className={errorClass} role="alert">
                {birthInputError}
              </p>
            ) : null}
          </div>
        )}

        {hidePostalCode ? null : (
          <div>
            <label htmlFor="v2-postalCode" className={labelClass}>
              Votre code postal
            </label>
            <input
              id="v2-postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder={senior ? "Ex. 13006" : "75001"}
              value={data.postalCode}
              disabled={disabled}
              onChange={(event) =>
                onPostalCode(normalizePostalCode(event.target.value))
              }
              className={
                senior
                  ? inputClass
                  : "mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2"
              }
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
        disabled={disabled || stepIncomplete}
      />
    </div>
  );
}
