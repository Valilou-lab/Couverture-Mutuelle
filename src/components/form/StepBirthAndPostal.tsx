"use client";

import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import { useCommuneLookup } from "./useCommuneLookup";
import {
  formatBirthDateInput,
  getBirthDateAgeError,
  type FieldErrors,
} from "./validation";
import {
  SENIOR_ERROR,
  SENIOR_INPUT,
  SENIOR_LABEL,
  SENIOR_QUESTION_TITLE,
  useSeniorForm,
} from "./seniorForm";

const DEFAULT_INPUT =
  "mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2";

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
  const senior = useSeniorForm();
  const titleClass = senior
    ? SENIOR_QUESTION_TITLE
    : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl";
  const labelClass = senior
    ? SENIOR_LABEL
    : "block text-sm font-medium text-foreground";
  const inputClass = senior ? SENIOR_INPUT : DEFAULT_INPUT;
  const errorClass = senior ? SENIOR_ERROR : "mt-2 text-sm text-error";
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
      <h2 className={titleClass}>
        Quelques informations pour trouver les offres adaptées
      </h2>

      <div className={senior ? "mt-4 space-y-4" : "mt-5 space-y-4"}>
        {hideOwnBirthDate ? null : (
          <div>
            <label
              htmlFor="birthDate"
              className={labelClass}
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
              className={
                senior
                  ? inputClass
                  : "mt-2 min-h-14 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 placeholder:text-zinc-300 focus:border-brand focus:ring-2"
              }
            />
            {errors.birthDate ? (
              <p className={errorClass} role="alert">
                {errors.birthDate}
              </p>
            ) : data.birthDate.length === 10 && ownAgeError ? (
              <p className={errorClass} role="alert">
                {ownAgeError}
              </p>
            ) : null}
          </div>
        )}

        {hidePostalCode ? null : (
          <div>
            <label
              htmlFor="postalCode"
              className={labelClass}
            >
              Votre code postal
            </label>
            <input
              id="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder={senior ? "Ex. 13006" : "75001"}
              value={data.postalCode}
              disabled={disabled}
              onChange={(event) => handlePostalCodeChange(event.target.value)}
              className={inputClass}
            />
            {errors.postalCode ? (
              <p className={errorClass} role="alert">
                {errors.postalCode}
              </p>
            ) : null}

            {lookup.status === "loading" ? (
              <p
                className={`mt-3 text-zinc-500 ${senior ? "text-base" : "text-sm"}`}
              >
                Recherche de la ville…</p>
            ) : null}

            {lookup.status === "error" ? (
              <p
                className={senior ? `${SENIOR_ERROR} mt-3` : "mt-3 text-sm text-error"}
                role="alert"
              >
                {lookup.message}
              </p>
            ) : null}

            {data.citiesOptions.length > 1 ? (
              <div className="mt-3">
                <label
                  htmlFor="city"
                  className={senior ? SENIOR_LABEL : "block text-sm font-medium"}
                >
                  Ville
                </label>
                <select
                  id="city"
                  value={data.city}
                  disabled={disabled}
                  onChange={(event) => onCity(event.target.value)}
                  className={inputClass}
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
              <p
                className={
                  senior
                    ? "mt-3 rounded-[14px] bg-brand-soft px-4 py-3 text-base text-foreground"
                    : "mt-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-foreground"
                }
              >
                Ville détectée : <strong>{data.city}</strong>
              </p>
            ) : null}

            {errors.city ? (
              <p className={errorClass} role="alert">
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
