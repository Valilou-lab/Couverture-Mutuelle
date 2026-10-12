"use client";

import { useState } from "react";
import { type QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { PartnersModal } from "./PartnersModal";
import type { FieldErrors } from "./validation";
import {
  CONSENT_OPTIN_TEXT,
  CONSENT_VALIDITY_TEXT,
} from "@/lib/consent";
import {
  SENIOR_ERROR,
  SENIOR_INFO,
  SENIOR_INPUT,
  SENIOR_LABEL,
  useSeniorForm,
} from "./seniorForm";

const DEFAULT_INPUT =
  "mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2";

const PARTNERS_MARKER = "ses partenaires";
const [consentOptinBeforePartners, consentOptinAfterPartners] =
  CONSENT_OPTIN_TEXT.split(PARTNERS_MARKER);

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  offersCount?: number | null;
  submitError?: string | null;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

export function StepContact({
  data,
  errors,
  disabled = false,
  offersCount = null,
  submitError = null,
  onPatch,
  onNext,
}: Props) {
  const [partnersOpen, setPartnersOpen] = useState(false);
  const senior = useSeniorForm();
  const labelClass = senior ? SENIOR_LABEL : "block text-sm font-medium";
  const inputClass = senior ? SENIOR_INPUT : DEFAULT_INPUT;
  const errorClass = senior ? SENIOR_ERROR : "mt-2 text-sm text-error";

  return (
    <div>
      <div
        className={
          senior
            ? SENIOR_INFO
            : "rounded-2xl bg-brand-soft/70 px-4 py-3.5 text-center sm:px-5 sm:py-4"
        }
      >
        <p
          className={
            senior
              ? "bonne-nouvelle-title text-[1.15rem] font-extrabold text-brand"
              : "bonne-nouvelle-title font-manrope text-base font-bold text-brand sm:text-lg"
          }
        >
          Bonne nouvelle{" "}
          <span aria-hidden="true" className="bonne-nouvelle-emoji">
            🎉
          </span>
        </p>
        <p
          className={
            senior
              ? "mt-1 leading-snug text-[#3b0764]"
              : "mt-1.5 text-sm leading-snug text-[#3b0764] sm:text-[0.9375rem]"
          }
        >
          Nous avons{" "}
          <strong className="offers-count-blink rounded-md bg-brand-muted/70 px-1 font-extrabold text-brand">
            plusieurs offres
          </strong>{" "}
          à vous communiquer.
        </p>
        <p
          className={
            senior
              ? "mt-1 text-[0.95rem] leading-snug text-zinc-600"
              : "mt-1.5 text-sm leading-snug text-zinc-600 sm:text-[0.9375rem]"
          }
        >
          Dernière étape pour recevoir vos nouveaux tarifs.
        </p>
      </div>

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
        <label htmlFor="phone" className={labelClass}>
          Téléphone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={senior ? "06 12 34 56 78" : undefined}
          value={data.phone}
          onChange={(event) => onPatch({ phone: event.target.value })}
          className={inputClass}
        />
        {errors.phone ? (
          <div className="mt-2 space-y-1" role="alert">
            <p className={senior ? "text-base font-medium text-error" : "text-sm text-error"}>
              {errors.phone}
            </p>
            {data.phone.trim() ? (
              <p className={senior ? "text-base text-error/80" : "text-sm text-error/80"}>
                Format attendu&nbsp;: 06&nbsp;XX&nbsp;XX&nbsp;XX&nbsp;XX
              </p>
            ) : null}
          </div>
        ) : null}

        <label
          htmlFor="whatsapp-available"
          className={`mt-3 flex cursor-pointer items-start gap-3 border-2 transition ${
            senior ? "rounded-[18px] px-4 py-3.5" : "rounded-2xl px-3.5 py-3.5 sm:px-4"
          } ${
            data.whatsappAvailable
              ? "border-[#25D366] bg-[#ecfdf3] shadow-sm"
              : "border-[#25D366]/45 bg-[#f0fdf4] hover:border-[#25D366] hover:bg-[#ecfdf3]"
          }`}
        >
          <input
            id="whatsapp-available"
            type="checkbox"
            checked={data.whatsappAvailable}
            onChange={(event) =>
              onPatch({ whatsappAvailable: event.target.checked })
            }
            className={`shrink-0 accent-[#25D366] ${
              senior ? "mt-0.5 h-6 w-6" : "mt-0.5 h-5 w-5"
            }`}
          />
          <span className="min-w-0">
            <span
              className={`inline-flex items-center gap-2 font-bold leading-snug text-[#14532d] ${
                senior ? "text-base" : "text-sm sm:text-[0.9375rem]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- brand asset */}
              <img
                src="/images/whatsapp-logo.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 shrink-0"
                draggable={false}
              />
              J’ai WhatsApp via ce numéro
            </span>
            <span
              className={`mt-1 block font-normal leading-snug text-[#3f6212]/85 ${
                senior ? "text-[0.9rem]" : "text-[0.6875rem]"
              }`}
            >
              Cela nous permet de savoir si nous pouvons vous contacter via
              WhatsApp. Ce canal reste facultatif.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className={labelClass}>
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode={senior ? "email" : undefined}
          placeholder={senior ? "prenom.nom@exemple.fr" : undefined}
          value={data.email}
          onChange={(event) => onPatch({ email: event.target.value })}
          className={inputClass}
        />
        {errors.email ? (
          <p className={errorClass} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div
        className={
          senior
            ? "mt-4 rounded-[18px] border-2 border-brand-muted bg-[#f7f4ff] p-4 text-[0.98rem] leading-relaxed text-foreground"
            : "mt-5 rounded-2xl border-2 border-[#c4b5fd] bg-surface px-4 py-3.5 text-sm leading-relaxed text-zinc-700"
        }
      >
        <div className="flex items-start gap-3">
          <input
            id="consent-opt-in"
            type="checkbox"
            checked={data.consent}
            onChange={(event) => onPatch({ consent: event.target.checked })}
            className={
              senior
                ? "mt-[3px] h-6 w-6 shrink-0 accent-brand"
                : "mt-1 h-4 w-4 shrink-0 accent-brand"
            }
          />
          <div className="min-w-0 space-y-2">
            <p>
              <label htmlFor="consent-opt-in" className="cursor-pointer">
                {consentOptinBeforePartners}
              </label>
              <button
                type="button"
                onClick={() => setPartnersOpen(true)}
                className="font-semibold text-brand underline underline-offset-2 hover:text-[#5b21b6]"
              >
                {PARTNERS_MARKER}
              </button>
              <label htmlFor="consent-opt-in" className="cursor-pointer">
                {consentOptinAfterPartners}
              </label>
            </p>
            <p>
              {CONSENT_VALIDITY_TEXT}{" "}
              <a
                href="/retirer-mon-consentement"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline underline-offset-2 hover:text-[#5b21b6]"
              >
                En savoir plus
              </a>
              .
            </p>
            <p>
              Mes données sont traitées conformément à la{" "}
              <a
                href="/politique-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline underline-offset-2 hover:text-[#5b21b6]"
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      {errors.consent ? (
        <p className={errorClass} role="alert">
          {errors.consent}
        </p>
      ) : null}
      {submitError ? (
        <p className={senior ? `${SENIOR_ERROR} mt-3` : "mt-3 text-sm text-error"} role="alert">
          {submitError}
        </p>
      ) : null}

      <FormNavigation
        onNext={onNext}
        nextLabel={disabled ? "Envoi en cours…" : "Valider ma demande"}
        disabled={disabled}
      />

      <PartnersModal
        open={partnersOpen}
        onClose={() => setPartnersOpen(false)}
      />
    </div>
  );
}
