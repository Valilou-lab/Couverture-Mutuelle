"use client";

import { type QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { validateStep, type FieldErrors } from "./validation";
import {
  SENIOR_ERROR,
  SENIOR_LABEL,
  useFormInputClass,
  useQuestionTitleClass,
  useSeniorForm,
} from "./seniorForm";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

/**
 * Main LP (/) + /tiktok redesign: collect name + email before analyzing.
 * Phone + consent stay on the final contact step.
 */
export function StepIdentity({
  data,
  errors,
  disabled = false,
  onPatch,
  onNext,
}: Props) {
  const senior = useSeniorForm();
  const titleClass = useQuestionTitleClass();
  const labelClass = senior ? SENIOR_LABEL : "block text-sm font-medium";
  const inputClass = useFormInputClass();
  const errorClass = senior ? SENIOR_ERROR : "mt-2 text-sm text-error";
  const canContinue = Object.keys(validateStep("identity", data)).length === 0;

  return (
    <div>
      <h2
        className={
          senior
            ? titleClass
            : "text-center text-xl font-normal tracking-tight text-black sm:text-2xl lg:text-[1.45rem]"
        }
      >
        Vos coordonnées
      </h2>

      <div
        className={
          senior
            ? "mt-4 grid grid-cols-2 gap-3"
            : "mt-5 grid grid-cols-2 gap-3 sm:gap-4"
        }
      >
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Prénom
          </label>
          <input
            id="firstName"
            autoComplete="given-name"
            value={data.firstName}
            disabled={disabled}
            onChange={(event) => onPatch({ firstName: event.target.value })}
            className={inputClass}
          />
          {errors.firstName ? (
            <p className={errorClass} role="alert">
              {errors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Nom
          </label>
          <input
            id="lastName"
            autoComplete="family-name"
            value={data.lastName}
            disabled={disabled}
            onChange={(event) => onPatch({ lastName: event.target.value })}
            className={inputClass}
          />
          {errors.lastName ? (
            <p className={errorClass} role="alert">
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className={labelClass}>
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={senior ? "prenom.nom@exemple.fr" : undefined}
          value={data.email}
          disabled={disabled}
          onChange={(event) => onPatch({ email: event.target.value })}
          className={inputClass}
        />
        {errors.email ? (
          <p className={errorClass} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <FormNavigation
        onNext={onNext}
        disabled={disabled}
        canContinue={canContinue}
        nextLabel="Continuer"
      />
    </div>
  );
}
