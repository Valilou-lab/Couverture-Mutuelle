"use client";

import { FormNavigation } from "@/components/form/FormNavigation";
import type { QuoteFormData } from "@/components/form/types";
import type { FieldErrors } from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_LABEL,
  useFormInputClass,
} from "@/components/form/seniorForm";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

export function validateV2IdentityNames(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!data.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  return errors;
}

/**
 * V2 — prénom / nom avant e-mail, puis téléphone.
 */
export function StepIdentityV2({
  data,
  errors,
  disabled = false,
  onPatch,
  onNext,
}: Props) {
  const inputClass = useFormInputClass();
  const canContinue =
    Boolean(data.firstName.trim()) && Boolean(data.lastName.trim());

  return (
    <div>
      <h2 className="text-balance text-center font-poppins text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-brand sm:text-[1.55rem]">
        Comment vous appelez-vous&nbsp;?
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="v2-firstName" className={SENIOR_LABEL}>
            Prénom
          </label>
          <input
            id="v2-firstName"
            autoComplete="given-name"
            value={data.firstName}
            disabled={disabled}
            onChange={(event) => onPatch({ firstName: event.target.value })}
            className={inputClass}
          />
          {errors.firstName ? (
            <p className={SENIOR_ERROR} role="alert">
              {errors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="v2-lastName" className={SENIOR_LABEL}>
            Nom
          </label>
          <input
            id="v2-lastName"
            autoComplete="family-name"
            value={data.lastName}
            disabled={disabled}
            onChange={(event) => onPatch({ lastName: event.target.value })}
            className={inputClass}
          />
          {errors.lastName ? (
            <p className={SENIOR_ERROR} role="alert">
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <FormNavigation
        onNext={onNext}
        nextLabel="Continuer"
        disabled={disabled || !canContinue}
        canContinue={!disabled && canContinue}
      />
    </div>
  );
}
