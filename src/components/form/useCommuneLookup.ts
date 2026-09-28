"use client";

import { useEffect, useRef, useState } from "react";

type CommuneResponse = {
  nom: string;
};

export type CommuneLookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success" };

/**
 * geo.api.gouv.fr lookup — same behaviour as the standalone postal-code step.
 */
export function useCommuneLookup(
  postalCode: string,
  onCitiesLoaded: (cities: string[]) => void,
  onCity: (value: string) => void,
): CommuneLookupState {
  const [lookup, setLookup] = useState<CommuneLookupState>({ status: "idle" });
  const requestId = useRef(0);

  useEffect(() => {
    if (!/^\d{5}$/.test(postalCode)) {
      setLookup({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    const currentRequest = ++requestId.current;
    let cancelled = false;

    async function lookupCities() {
      setLookup({ status: "loading" });

      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom`,
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
  }, [onCitiesLoaded, onCity, postalCode]);

  return lookup;
}
