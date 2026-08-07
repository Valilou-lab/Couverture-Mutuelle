"use client";

import { useState } from "react";
import {
  CIVILITIES,
  type CivilityId,
  type QuoteFormData,
} from "./types";
import { FormNavigation } from "./FormNavigation";
import { PartnersModal } from "./PartnersModal";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  offersCount?: number | null;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepContact({
  data,
  errors,
  disabled = false,
  offersCount = null,
  onPatch,
  onBack,
  onNext,
}: Props) {
  const [partnersOpen, setPartnersOpen] = useState(false);

  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Vos coordonnées
      </h2>

      <div className="mt-4 rounded-2xl bg-brand-soft/70 px-4 py-3.5 text-center sm:mt-5 sm:px-5 sm:py-4">
        <p className="font-manrope text-base font-bold text-brand sm:text-lg">
          Bonne nouvelle{" "}
          <span aria-hidden="true">🎉</span>
        </p>
        <p className="mt-1.5 text-sm leading-snug text-[#3b0764] sm:text-[0.9375rem]">
          Nous avons trouvé{" "}
          <strong className="offers-count-blink font-extrabold text-brand tabular-nums">
            {offersCount ?? "…"} offres
          </strong>{" "}
          plus intéressantes
        </p>
        <p className="mt-1.5 text-sm leading-snug text-zinc-600 sm:text-[0.9375rem]">
          Dernière étape pour recevoir vos devis.
        </p>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Civilité</legend>
        <div className="mt-2 flex gap-2">
          {CIVILITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPatch({ civility: item.id as CivilityId })}
              className={`min-h-11 flex-1 rounded-full border-2 px-3 text-sm font-semibold transition duration-200 ${
                data.civility === item.id
                  ? "border-brand bg-brand text-white shadow-md"
                  : "border-brand/45 bg-[#ede9fe] text-[#3b0764] shadow-sm hover:border-brand hover:bg-[#ddd6fe]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {errors.civility ? (
          <p className="mt-2 text-sm text-error" role="alert">
            {errors.civility}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            Prénom
          </label>
          <input
            id="firstName"
            autoComplete="given-name"
            value={data.firstName}
            onChange={(event) => onPatch({ firstName: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
          />
          {errors.firstName ? (
            <p className="mt-2 text-sm text-error" role="alert">
              {errors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Nom
          </label>
          <input
            id="lastName"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(event) => onPatch({ lastName: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
          />
          {errors.lastName ? (
            <p className="mt-2 text-sm text-error" role="alert">
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="phone" className="block text-sm font-medium">
          Téléphone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
          value={data.phone}
          onChange={(event) => onPatch({ phone: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
        />
        {errors.phone ? (
          <p className="mt-2 text-sm text-error" role="alert">
            {errors.phone}
          </p>
        ) : null}

        <label
          htmlFor="whatsapp-available"
          className={`mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border-2 px-3.5 py-3.5 transition sm:px-4 ${
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
            className="mt-1 h-5 w-5 shrink-0 accent-[#25D366]"
          />
          <span className="min-w-0">
            <span className="inline-flex items-center gap-2 text-sm font-bold leading-snug text-[#14532d] sm:text-[0.9375rem]">
              {/* eslint-disable-next-line @next/next/no-img-element -- brand asset */}
              <img
                src="/images/whatsapp-logo.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 shrink-0"
                draggable={false}
              />
              Ce numéro est disponible sur WhatsApp
            </span>
            <span className="mt-1 block text-xs italic leading-snug text-[#166534]/80 sm:text-[0.8125rem]">
              Recevez également le suivi de votre demande sur WhatsApp
            </span>
          </span>
        </label>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@email.fr"
          value={data.email}
          onChange={(event) => onPatch({ email: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm leading-relaxed text-zinc-700">
        <div className="flex items-start gap-3">
          <input
            id="consent-opt-in"
            type="checkbox"
            checked={data.consent}
            onChange={(event) => onPatch({ consent: event.target.checked })}
            className="mt-1 h-4 w-4 shrink-0 accent-brand"
          />
          <div className="min-w-0 space-y-2">
            <p>
              <label htmlFor="consent-opt-in" className="cursor-pointer">
                J’accepte d’être contacté(e) par téléphone, SMS, whatsapp et
                email par Couverture Mutuelle et{" "}
              </label>
              <button
                type="button"
                onClick={() => setPartnersOpen(true)}
                className="font-semibold text-brand underline underline-offset-2 hover:text-[#5b21b6]"
              >
                ses partenaires
              </button>
              <label htmlFor="consent-opt-in" className="cursor-pointer">
                {" "}
                afin de recevoir des offres de complémentaire santé.
              </label>
            </p>
            <p>
              Mon consentement est valable 12 mois et peut être retiré à tout
              moment.{" "}
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
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.consent}
        </p>
      ) : null}

      <FormNavigation
        onBack={onBack}
        onNext={onNext}
        nextLabel="Valider ma demande"
        disabled={disabled}
      />

      <PartnersModal
        open={partnersOpen}
        onClose={() => setPartnersOpen(false)}
      />
    </div>
  );
}
