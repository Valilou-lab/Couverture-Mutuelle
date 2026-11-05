"use client";

import { useState } from "react";
import { type QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { PartnersModal } from "./PartnersModal";
import { validateStep, type FieldErrors } from "./validation";
import {
  IKI_CONSENT_OPTIN_TEXT,
  IKI_CONSENT_VALIDITY_TEXT,
  IKI_PARTNER_CONSENT_OPTIN_TEXT,
  IKI_PRIVACY_POLICY_LABEL,
  IKI_PRIVACY_POLICY_URL,
  type ConsentVariantId,
} from "@/lib/consent";
import {
  SENIOR_ERROR,
  SENIOR_INFO,
  SENIOR_LABEL,
  useFormInputClass,
  useSeniorForm,
} from "./seniorForm";

/** Visible CM classic checkbox label — display only (Vertikl proof unchanged). */
const CM_PARTNERS_MARKER = "ses partenaires";
const CM_CONSENT_LABEL =
  "Je demande à être contacté(e) par téléphone et e-mail par Couverture Mutuelle et ses partenaires pour recevoir des offres de mutuelle adaptées à ma demande, pendant 12 mois.";
const [cmConsentBeforePartners, cmConsentAfterPartners] =
  CM_CONSENT_LABEL.split(CM_PARTNERS_MARKER);

const IKI_PARTNERS_LINK_LABEL = "liste des partenaires";
const [ikiPartnerBeforeList, ikiPartnerAfterList] =
  IKI_PARTNER_CONSENT_OPTIN_TEXT.split(IKI_PARTNERS_LINK_LABEL);
const LINK_CLASS =
  "font-semibold text-brand underline underline-offset-2 hover:text-[#5b21b6]";
const CM_CONSENT_NOTE_LINK =
  "underline underline-offset-2 hover:text-brand";

const PHONE_STEP_LEAD =
  "Afin de recevoir vos devis de façon sécurisée, indiquez votre numéro de téléphone.";
const PHONE_STEP_FALLBACK =
  "Dernière étape : indiquez votre numéro de téléphone pour recevoir vos devis de façon sécurisée.";

function phoneStepTitle(firstName: string, phoneOnly: boolean): string {
  if (!phoneOnly) return "Bonne nouvelle";
  const name = firstName.trim();
  return name ? `Bonne nouvelle ${name} !` : "Bonne nouvelle !";
}

function phoneStepLead(firstName: string, phoneOnly: boolean): string {
  if (!phoneOnly) return "Dernière étape pour recevoir vos nouveaux tarifs.";
  return firstName.trim() ? PHONE_STEP_LEAD : PHONE_STEP_FALLBACK;
}

/** Bold the lead clause of each IKI opt-in (matches the mock). */
function IkiOptinLabel({
  htmlFor,
  text,
  boldUntil,
}: {
  htmlFor: string;
  text: string;
  boldUntil: string;
}) {
  const index = text.indexOf(boldUntil);
  if (index < 0) {
    return (
      <label htmlFor={htmlFor} className="cursor-pointer">
        {text}
      </label>
    );
  }
  const end = index + boldUntil.length;
  return (
    <label htmlFor={htmlFor} className="cursor-pointer">
      <strong className="font-semibold text-[var(--encre-900,#18181b)]">
        {text.slice(0, end)}
      </strong>
      {text.slice(end)}
    </label>
  );
}

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  submitError?: string | null;
  consentVariant?: ConsentVariantId;
  /** Main LP (/) + /tiktok: name/email already collected — phone + consent only. */
  phoneOnly?: boolean;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

export function StepContact({
  data,
  errors,
  disabled = false,
  submitError = null,
  consentVariant = "default",
  phoneOnly = false,
  onPatch,
  onNext,
}: Props) {
  const [partnersOpen, setPartnersOpen] = useState(false);
  const senior = useSeniorForm();
  const iki = consentVariant === "iki";
  const labelClass = senior ? SENIOR_LABEL : "block text-sm font-medium";
  const inputClass = useFormInputClass();
  const errorClass = senior ? SENIOR_ERROR : "mt-2 text-sm text-error";
  const canContinue =
    Object.keys(
      validateStep("contact", data, { contactPhoneOnly: phoneOnly }),
    ).length === 0;

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
          {phoneStepTitle(data.firstName, phoneOnly)}
        </p>
        <p
          className={
            senior
              ? "mt-1 text-[0.95rem] leading-snug text-zinc-600"
              : "mt-1.5 text-sm leading-snug text-zinc-600 sm:text-[0.9375rem]"
          }
        >
          {phoneStepLead(data.firstName, phoneOnly)}
        </p>
      </div>

      {phoneOnly ? null : (
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
      )}

      <div className={phoneOnly ? "mt-4" : "mt-4"}>
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

        <p
          className={
            senior
              ? "mt-2 text-[0.95rem] leading-snug text-[#3f76bc]"
              : "mt-2 text-sm leading-snug text-[#3f76bc]"
          }
        >
          Un code de confirmation vous sera ensuite envoyé par SMS afin de
          valider votre dossier.
        </p>

        {!senior ? (
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
        ) : null}
      </div>

      {phoneOnly ? null : (
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
      )}

      {iki ? (
        <div className="mt-4 rounded-[18px] border border-[var(--encre-200,#e4e4e7)] bg-[var(--encre-50,#fafafa)] p-4 text-[0.95rem] leading-relaxed text-[var(--encre-800,#27272a)]">
          <div className="flex items-start gap-3">
            <input
              id="consent-opt-in"
              type="checkbox"
              checked={data.consent}
              onChange={(event) => onPatch({ consent: event.target.checked })}
              className="mt-[3px] h-6 w-6 shrink-0 accent-brand"
            />
            <p className="min-w-0">
              <IkiOptinLabel
                htmlFor="consent-opt-in"
                text={IKI_CONSENT_OPTIN_TEXT}
                boldUntil="IKI Assurance"
              />
            </p>
          </div>

          <div
            className="my-3.5 border-t border-[var(--encre-200,#e4e4e7)]"
            aria-hidden="true"
          />

          <div className="flex items-start gap-3">
            <input
              id="partner-consent-opt-in"
              type="checkbox"
              checked={data.partnerConsent}
              onChange={(event) =>
                onPatch({ partnerConsent: event.target.checked })
              }
              className="mt-[3px] h-6 w-6 shrink-0 accent-brand"
            />
            <p className="min-w-0">
              <IkiOptinLabel
                htmlFor="partner-consent-opt-in"
                text={ikiPartnerBeforeList}
                boldUntil="assureur partenaire"
              />
              <button
                type="button"
                onClick={() => setPartnersOpen(true)}
                className="font-semibold text-[var(--violet-600,#5b21b6)] underline underline-offset-2 hover:text-[var(--violet-500,#7c3aed)]"
              >
                {IKI_PARTNERS_LINK_LABEL}
              </button>
              <label htmlFor="partner-consent-opt-in" className="cursor-pointer">
                {ikiPartnerAfterList}
              </label>
            </p>
          </div>

          <p className="mt-3.5 text-[0.78rem] leading-snug text-[var(--encre-500,#71717a)]">
            {IKI_CONSENT_VALIDITY_TEXT}{" "}
            <a
              href={IKI_PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--violet-600,#5b21b6)]"
            >
              Politique de confidentialité
            </a>
          </p>
          <p className="mt-1.5 text-[0.78rem] leading-snug text-[var(--encre-500,#71717a)]">
            <a
              href={IKI_PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--violet-600,#5b21b6)]"
            >
              {IKI_PRIVACY_POLICY_LABEL}
            </a>
          </p>
        </div>
      ) : (
        <div
          className={
            senior
              ? "mt-4 rounded-[18px] border-2 border-brand-muted bg-[#f7f4ff] p-4 text-[0.98rem] leading-snug text-foreground"
              : "mt-5 rounded-2xl border-2 border-[#c4b5fd] bg-surface px-4 py-3.5 text-sm leading-snug text-zinc-700"
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
            <div className="min-w-0">
              <p className="text-pretty">
                <label htmlFor="consent-opt-in" className="cursor-pointer">
                  {cmConsentBeforePartners}
                </label>
                <button
                  type="button"
                  onClick={() => setPartnersOpen(true)}
                  className={LINK_CLASS}
                >
                  {CM_PARTNERS_MARKER}
                </button>
                <label htmlFor="consent-opt-in" className="cursor-pointer">
                  {cmConsentAfterPartners}
                </label>
              </p>
              <p
                className={
                  senior
                    ? "mt-1.5 text-[0.8125rem] leading-snug text-zinc-500"
                    : "mt-1.5 text-[0.75rem] leading-snug text-zinc-500"
                }
              >
                Consentement retirable à tout moment.{" "}
                <a
                  href="/politique-de-confidentialite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CM_CONSENT_NOTE_LINK}
                >
                  Politique de confidentialité
                </a>
                {" · "}
                <a
                  href="/partenaires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CM_CONSENT_NOTE_LINK}
                >
                  Partenaires
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
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
        nextLabel={
          disabled
            ? "Envoi en cours…"
            : iki
              ? "Envoyer mon dossier"
              : "Valider ma demande"
        }
        disabled={disabled}
        canContinue={canContinue}
      />

      <PartnersModal
        open={partnersOpen}
        onClose={() => setPartnersOpen(false)}
      />
    </div>
  );
}
