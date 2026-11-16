"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCitiesByPostalCode } from "@/lib/location-service";

export type CommuneLookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success" };

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

/**
 * Postal → city lookup via same-origin /api/communes.
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
        const cities = await fetchCitiesByPostalCode(
          postalCode,
          controller.signal,
        );
        if (cancelled || currentRequest !== requestId.current) return;

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
        if (isAbortError(error)) return;
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
