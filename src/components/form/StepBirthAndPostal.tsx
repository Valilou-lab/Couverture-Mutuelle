"use client";

import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { useCommuneLookup } from "./useCommuneLookup";
import {
  formatBirthDateInput,
  getBirthDateAgeError,
  type FieldErrors,
} from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  hideOwnBirthDate?: boolean;
  hidePostalCode?: boolean;
  onChangeBirthDate: (value: string) => void;
  onPostalCode: (value: string) => void;
  onCitiesLoaded: (cities: string[]) => void;
  onCity: (value: string) => void;
  onNext: () => void;
};

export function StepBirthAndPostal({
  data,
  errors,
  disabled = false,
  hideOwnBirthDate = false,
  hidePostalCode = false,
  onChangeBirthDate,
  onPostalCode,
  onCitiesLoaded,
  onCity,
  onNext,
}: Props) {
  const lookup = useCommuneLookup(
    hidePostalCode ? "" : data.postalCode,
    onCitiesLoaded,
    onCity,
  );

  const ownAgeError = hideOwnBirthDate
    ? null
    : getBirthDateAgeError(data.birthDate);

  function handlePostalCodeChange(value: string) {
    const next = value.replace(/\D/g, "").slice(0, 5);
    onPostalCode(next);
    onCitiesLoaded([]);
    onCity("");
  }

  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quelques informations pour trouver les offres adaptées
      </h2>

      <div className="mt-5 space-y-4">
        {hideOwnBirthDate ? null : (
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-foreground"
            >
              Votre date de naissance
            </label>
            <input
              id="birthDate"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="JJ/MM/AAAA"
              value={data.birthDate}
              disabled={disabled}
              onChange={(event) =>
                onChangeBirthDate(formatBirthDateInput(event.target.value))
              }
              className="mt-2 min-h-14 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 placeholder:text-zinc-300 focus:border-brand focus:ring-2"
            />
            {errors.birthDate ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {errors.birthDate}
              </p>
            ) : data.birthDate.length === 10 && ownAgeError ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {ownAgeError}
              </p>
            ) : null}
          </div>
        )}

        {hidePostalCode ? null : (
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-foreground"
            >
              Votre code postal
            </label>
            <input
              id="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="75001"
              value={data.postalCode}
              disabled={disabled}
              onChange={(event) => handlePostalCodeChange(event.target.value)}
              className="mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2"
            />
            {errors.postalCode ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {errors.postalCode}
              </p>
            ) : null}

            {lookup.status === "loading" ? (
              <p className="mt-3 text-sm text-zinc-500">Recherche de la ville…</p>
            ) : null}

            {lookup.status === "error" ? (
              <p className="mt-3 text-sm text-error" role="alert">
                {lookup.message}
              </p>
            ) : null}

            {data.citiesOptions.length > 1 ? (
              <div className="mt-3">
                <label htmlFor="city" className="block text-sm font-medium">
                  Ville
                </label>
                <select
                  id="city"
                  value={data.city}
                  disabled={disabled}
                  onChange={(event) => onCity(event.target.value)}
                  className="mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2"
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
              <p className="mt-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-foreground">
                Ville détectée : <strong>{data.city}</strong>
              </p>
            ) : null}

            {errors.city ? (
              <p className="mt-2 text-sm text-error" role="alert">
                {errors.city}
              </p>
            ) : null}
          </div>
        )}
      </div>

      <FormNavigation onNext={onNext} disabled={disabled} />
    </div>
  );
}
