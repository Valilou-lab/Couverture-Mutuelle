"use client";

import {
  CIVILITIES,
  type CivilityId,
  type QuoteFormData,
} from "./types";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepContact({
  data,
  errors,
  disabled = false,
  onPatch,
  onBack,
  onNext,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Vos coordonnées
      </h2>
      <p className="mt-2 text-sm text-zinc-600 sm:text-base">
        Bonne nouvelle,{" "}
        <span className="font-bold text-fuchsia-600">vous êtes éligible</span> à
        une meilleure offre de mutuelle et de meilleures garanties.
        <br />
        Afin de finaliser votre dossier, remplissez vos coordonnées.
      </p>

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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm leading-relaxed text-zinc-700">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(event) => onPatch({ consent: event.target.checked })}
          className="mt-1 h-4 w-4 accent-brand"
        />
        <span>
          J’accepte d’être recontacté(e) par un conseiller Couverture Mutuelle
          au sujet de ma demande de devis. Mes données ne seront pas réutilisées
          à des fins commerciales tierces.
        </span>
      </label>
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
    </div>
  );
}
