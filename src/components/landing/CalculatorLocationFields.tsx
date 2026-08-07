"use client";

import { useEffect, useRef, useState } from "react";
import { useQuoteJourney } from "@/context/QuoteJourneyContext";
import {
  fetchCitiesByPostalCode,
  isCompletePostalCode,
  normalizePostalCode,
  resolveCitySelection,
  type CityLookupResult,
} from "@/lib/location-service";

type Props = {
  questionNumber?: number;
};

export function CalculatorLocationFields({ questionNumber = 2 }: Props) {
  const { calculator, setCalculator } = useQuoteJourney();
  const [cities, setCities] = useState<string[]>([]);
  const [lookup, setLookup] = useState<CityLookupResult>({ status: "idle" });
  const requestId = useRef(0);

  const postalCode = calculator.postalCode;
  const city = calculator.city;
  const cityRef = useRef(city);
  cityRef.current = city;

  useEffect(() => {
    if (!isCompletePostalCode(postalCode)) {
      return;
    }

    const controller = new AbortController();
    const currentRequest = ++requestId.current;

    async function runLookup() {
      setLookup({ status: "loading" });
      setCities([]);

      try {
        const found = await fetchCitiesByPostalCode(
          postalCode,
          controller.signal,
        );
        if (currentRequest !== requestId.current) return;

        const resolved = resolveCitySelection(found);
        const preserved =
          cityRef.current && found.includes(cityRef.current)
            ? cityRef.current
            : resolved.city;

        setCities(found);
        setCalculator({ city: preserved });
        setLookup(resolved.result);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (currentRequest !== requestId.current) return;
        setCities([]);
        setCalculator({ city: "" });
        setLookup({
          status: "error",
          message:
            "Impossible de récupérer la ville pour le moment. Réessayez.",
        });
      }
    }

    void runLookup();

    return () => {
      controller.abort();
    };
  }, [postalCode, setCalculator]);

  function handlePostalCodeChange(value: string) {
    const next = normalizePostalCode(value);
    setCalculator({ postalCode: next, city: "" });
    setCities([]);
    setLookup({ status: "idle" });
  }

  const showCitySelect = lookup.status === "success" && cities.length > 1;
  const showSingleCity =
    (lookup.status === "success" && cities.length === 1) ||
    (Boolean(city) && cities.length <= 1 && isCompletePostalCode(postalCode));
  const lookupError =
    lookup.status === "empty" || lookup.status === "error"
      ? lookup.message
      : null;

  return (
    <div>
      <p className="text-center font-manrope text-base font-semibold text-[#3b0764] sm:text-lg">
        {questionNumber}. Où habitez-vous&nbsp;?
      </p>

      <input
        id="calculator-postalCode"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="75001"
        maxLength={5}
        aria-label="Code postal"
        value={postalCode}
        onChange={(event) => handlePostalCodeChange(event.target.value)}
        aria-invalid={Boolean(lookupError)}
        aria-describedby={
          lookupError ? "calculator-postalCode-error" : undefined
        }
        className={`mt-3 min-h-14 w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-foreground outline-none ring-brand/30 placeholder:text-brand-muted focus:ring-2 ${
          lookupError ? "border-error/50" : "border-border"
        }`}
      />

      {lookup.status === "loading" ? (
        <p className="mt-2 text-xs text-zinc-500">Recherche de la ville…</p>
      ) : null}

      {lookupError ? (
        <p
          id="calculator-postalCode-error"
          className="mt-2 text-xs text-error"
          role="alert"
        >
          {lookupError}
        </p>
      ) : null}

      {showSingleCity && city ? (
        <p className="mt-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-foreground">
          Ville détectée&nbsp;: <strong>{city}</strong>
        </p>
      ) : null}

      {showCitySelect ? (
        <div className="mt-3">
          <label
            htmlFor="calculator-city"
            className="block text-sm font-medium text-zinc-700"
          >
            Commune
          </label>
          <select
            id="calculator-city"
            value={city}
            onChange={(event) => setCalculator({ city: event.target.value })}
            className="mt-2 min-h-14 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base text-foreground outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Sélectionnez votre commune</option>
            {cities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
