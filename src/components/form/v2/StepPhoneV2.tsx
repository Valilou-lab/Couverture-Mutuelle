"use client";

import { useState } from "react";
import { type QuoteFormData } from "@/components/form/types";
import { FormNavigation } from "@/components/form/FormNavigation";
import type { FieldErrors } from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_LABEL,
  useFormInputClass,
} from "@/components/form/seniorForm";
import {
  getV2PhoneInputError,
  normalizeV2PhoneToE164,
} from "@/lib/v2/phone";
import { isV2PhoneComplete } from "./emailValidation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  submitError?: string | null;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

/**
 * Phone alone (after email) — then eligibility check.
 */
export function StepPhoneV2({
  data,
  errors,
  disabled = false,
  submitError = null,
  onPatch,
  onNext,
}: Props) {
  const inputClass = useFormInputClass();
  const inputErrorClass = `${inputClass} border-error focus:border-error focus:ring-error/20`;
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneOk = isV2PhoneComplete(data);
  const phoneErrorMessage =
    errors.phone ||
    (phoneTouched ? getV2PhoneInputError(data.phone) : null);
  const showPhoneError = Boolean(phoneErrorMessage);

  function handlePhoneBlur() {
    setPhoneTouched(true);
    const e164 = normalizeV2PhoneToE164(data.phone);
    if (e164 && e164 !== data.phone.trim()) {
      onPatch({ phone: e164 });
    }
  }

  function handleNext() {
    setPhoneTouched(true);
    if (!phoneOk) return;

    const e164 = normalizeV2PhoneToE164(data.phone);
    if (e164 && e164 !== data.phone.trim()) {
      onPatch({ phone: e164 });
    }
    onNext();
  }

  return (
    <div>
      <header className="text-center">
        <h2 className="text-balance font-poppins text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-brand sm:text-[1.55rem]">
          Dernière étape&nbsp;!
        </h2>
        <div className="mx-auto mt-3 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-left sm:px-4 sm:py-3.5">
          <p className="flex items-start gap-2.5 text-[0.875rem] font-medium leading-snug text-emerald-900 sm:text-[0.9rem]">
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.65rem] font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>
              C’est ensuite vous qui choisissez d’être contacté ou non pour vos
              devis.
            </span>
          </p>
        </div>
      </header>

      <div className="mt-4">
        <label htmlFor="v2-phone" className={SENIOR_LABEL}>
          Votre numéro de téléphone
        </label>
        <input
          id="v2-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
          value={data.phone}
          onChange={(event) => onPatch({ phone: event.target.value })}
          onBlur={handlePhoneBlur}
          aria-invalid={showPhoneError}
          className={showPhoneError ? inputErrorClass : inputClass}
        />
        {phoneErrorMessage ? (
          <p className={SENIOR_ERROR} role="alert">
            {phoneErrorMessage}
          </p>
        ) : (
          <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500 sm:text-sm">
            Pour valider votre demande et adapter vos devis.
          </p>
        )}
      </div>

      <aside
        className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-[#fffbeb] px-3 py-2 text-left sm:px-3.5 sm:py-2.5"
        aria-label="Vérification du téléphone mobile par code SMS"
      >
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-amber-700/80"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[1.125rem] w-[1.125rem]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2.5" />
            <path d="M10 18h4" />
            <path d="M9 7h4.5" />
            <path d="M9 10.5h6" />
          </svg>
        </span>
        <p className="min-w-0 text-[0.8125rem] font-semibold leading-snug text-amber-950/80 sm:text-sm">
          Vérification du téléphone mobile par code SMS.
        </p>
      </aside>

      {submitError ? (
        <p className={`${SENIOR_ERROR} mt-3`} role="alert">
          {submitError}
        </p>
      ) : null}

      <FormNavigation
        onNext={handleNext}
        nextLabel={disabled ? "Vérification…" : "Continuer"}
        disabled={disabled}
        canContinue={!disabled && phoneOk}
      />
    </div>
  );
}
