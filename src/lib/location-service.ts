/**
 * Location helpers for postal-code → city lookup.
 * Pure TypeScript — no React / JSX.
 * Browser callers hit same-origin /api/communes (server proxies geo + fallback).
 */

export type CityLookupResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty"; message: string }
  | { status: "error"; message: string }
  | { status: "success"; cities: string[] };

/** Keep digits only, max 5 characters. */
export function normalizePostalCode(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 5);
}

export function isCompletePostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Fetches commune names for a French postal code.
 * Call only when `isCompletePostalCode(postalCode)` is true.
 */
export async function fetchCitiesByPostalCode(
  postalCode: string,
  signal?: AbortSignal,
): Promise<string[]> {
  if (!isCompletePostalCode(postalCode)) {
    return [];
  }

  const url = `/api/communes?codePostal=${encodeURIComponent(postalCode)}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("location-lookup-failed");
  }

  const payload = (await response.json()) as { cities?: unknown };
  if (!Array.isArray(payload.cities)) {
    throw new Error("location-lookup-failed");
  }

  return payload.cities.filter(
    (city): city is string => typeof city === "string" && city.length > 0,
  );
}

export function resolveCitySelection(cities: string[]): {
  city: string;
  result: CityLookupResult;
} {
  if (cities.length === 0) {
    return {
      city: "",
      result: {
        status: "empty",
        message: "Aucune ville trouvée pour ce code postal.",
      },
    };
  }

  if (cities.length === 1) {
    return {
      city: cities[0],
      result: { status: "success", cities },
    };
  }

  return {
    city: "",
    result: { status: "success", cities },
  };
}
