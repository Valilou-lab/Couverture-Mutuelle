"use client";

import { useEffect, useRef, useState } from "react";
import type { QuoteFormData } from "./types";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPostalCode: (value: string) => void;
  onCitiesLoaded: (cities: string[]) => void;
  onCity: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

type CommuneResponse = {
  nom: string;
};

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success" };

export function StepPostalCode({
  data,
  errors,
  disabled = false,
  onPostalCode,
  onCitiesLoaded,
  onCity,
  onBack,
  onNext,
}: Props) {
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });
  const requestId = useRef(0);

  useEffect(() => {
    if (!/^\d{5}$/.test(data.postalCode)) {
      return;
    }

    const controller = new AbortController();
    const currentRequest = ++requestId.current;
    let cancelled = false;

    async function lookupCities() {
      setLookup({ status: "loading" });

      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${data.postalCode}&fields=nom`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("lookup-failed");

        const communes = (await response.json()) as CommuneResponse[];
        if (cancelled || currentRequest !== requestId.current) return;

        const cities = Array.from(
          new Set(communes.map((item) => item.nom).filter(Boolean)),
        ).sort((a, b) => a.localeCompare(b, "fr"));

        onCitiesLoaded(cities);

        if (cities.length === 1) {
          onCity(cities[0]);
          setLookup({ status: "success" });
          return;
        }

        if (cities.length === 0) {
          onCity("");
          setLookup({
            status: "error",
            message: "Aucune ville trouvée pour ce code postal.",
          });
          return;
        }

        onCity("");
        setLookup({ status: "success" });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (cancelled || currentRequest !== requestId.current) return;
        onCitiesLoaded([]);
        onCity("");
        setLookup({
          status: "error",
          message:
            "Impossible de récupérer la ville pour le moment. Réessayez.",
        });
      }
    }

    void lookupCities();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [data.postalCode, onCitiesLoaded, onCity]);

  function handlePostalCodeChange(value: string) {
    const next = value.replace(/\D/g, "").slice(0, 5);
    onPostalCode(next);
    onCitiesLoaded([]);
    onCity("");
    setLookup({ status: "idle" });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quel est votre code postal ?
      </h2>
      <p className="mt-2 text-sm text-zinc-600 sm:text-base">
        Si plusieurs communes correspondent, choisissez la vôtre.
      </p>

      <input
        id="postalCode"
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
          <label htmlFor="city" className="block text-sm font-medium">
            Ville
          </label>
          <select
            id="city"
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

      <FormNavigation
        onBack={onBack}
        onNext={onNext}
        disabled={disabled}
      />
    </div>
  );
}
