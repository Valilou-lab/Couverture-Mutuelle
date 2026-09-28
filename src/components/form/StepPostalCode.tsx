"use client";

import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { useCommuneLookup } from "./useCommuneLookup";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPostalCode: (value: string) => void;
  onCitiesLoaded: (cities: string[]) => void;
  onCity: (value: string) => void;
  onNext: () => void;
};

/** Standalone postal step — kept for when COMBINE_BIRTH_AND_POSTAL_STEP is off. */
export function StepPostalCode({
  data,
  errors,
  disabled = false,
  onPostalCode,
  onCitiesLoaded,
  onCity,
  onNext,
}: Props) {
  const lookup = useCommuneLookup(data.postalCode, onCitiesLoaded, onCity);

  function handlePostalCodeChange(value: string) {
    const next = value.replace(/\D/g, "").slice(0, 5);
    onPostalCode(next);
    onCitiesLoaded([]);
    onCity("");
  }

  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quel est votre code postal ?
      </h2>
      <p className="mt-2 text-center text-sm text-zinc-600 sm:text-base">
        Si plusieurs communes correspondent, choisissez la vôtre.
      </p>

      <input
        id="postalCodeStandalone"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={5}
        placeholder="75001"
        aria-label="Code postal"
        value={data.postalCode}
        onChange={(event) => handlePostalCodeChange(event.target.value)}
        className="mt-5 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
      />
      {errors.postalCode ? (
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.postalCode}
        </p>
      ) : null}

      {lookup.status === "loading" ? (
        <p className="mt-4 text-sm text-zinc-500">Recherche de la ville…</p>
      ) : null}

      {lookup.status === "error" ? (
        <p className="mt-4 text-sm text-error" role="alert">
          {lookup.message}
        </p>
      ) : null}

      {data.citiesOptions.length > 1 ? (
        <div className="mt-4">
          <label htmlFor="cityStandalone" className="block text-sm font-medium">
            Ville
          </label>
          <select
            id="cityStandalone"
            value={data.city}
            onChange={(event) => onCity(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Sélectionnez votre ville</option>
            {data.citiesOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {data.citiesOptions.length === 1 && data.city ? (
        <p className="mt-4 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-foreground">
          Ville détectée : <strong>{data.city}</strong>
        </p>
      ) : null}

      {errors.city ? (
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.city}
        </p>
      ) : null}

      <FormNavigation onNext={onNext} disabled={disabled} />
    </div>
  );
}
