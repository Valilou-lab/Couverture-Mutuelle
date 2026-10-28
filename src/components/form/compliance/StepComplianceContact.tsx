"use client";

import { type QuoteFormData } from "@/components/form/types";
import { FormNavigation } from "@/components/form/FormNavigation";
import type { FieldErrors } from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_INFO,
  SENIOR_INPUT,
  SENIOR_LABEL,
} from "@/components/form/seniorForm";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  submitError?: string | null;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

/**
 * Question 5/5 — email + phone only, then « Vérifier les offres ».
 * No name fields, no consent, no Vertikl submit.
 */
export function StepComplianceContact({
  data,
  errors,
  disabled = false,
  submitError = null,
  onPatch,
  onNext,
}: Props) {
  return (
    <div>
      <div className={SENIOR_INFO}>
        <p className="text-[1.15rem] font-extrabold leading-snug text-[#3b0764]">
          Plus qu’une étape pour vérifier les offres disponibles pour votre
          profil.
        </p>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-zinc-600">
          Renseignez votre e-mail et votre numéro de téléphone pour lancer la
          recherche.
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="compliance-email" className={SENIOR_LABEL}>
          E-mail
        </label>
        <input
          id="compliance-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="prenom.nom@exemple.fr"
          value={data.email}
          onChange={(event) => onPatch({ email: event.target.value })}
          className={SENIOR_INPUT}
        />
        {errors.email ? (
          <p className={SENIOR_ERROR} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        <label htmlFor="compliance-phone" className={SENIOR_LABEL}>
          Téléphone
        </label>
        <input
          id="compliance-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
          value={data.phone}
          onChange={(event) => onPatch({ phone: event.target.value })}
          className={SENIOR_INPUT}
        />
        {errors.phone ? (
          <div className="mt-2 space-y-1" role="alert">
            <p className="text-base font-medium text-error">{errors.phone}</p>
            {data.phone.trim() ? (
              <p className="text-base text-error/80">
                Format attendu&nbsp;: 06&nbsp;XX&nbsp;XX&nbsp;XX&nbsp;XX
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {submitError ? (
        <p className={`${SENIOR_ERROR} mt-3`} role="alert">
          {submitError}
        </p>
      ) : null}

      <FormNavigation
        onNext={onNext}
        nextLabel={disabled ? "Vérification…" : "Vérifier les offres"}
        disabled={disabled}
      />
    </div>
  );
}
