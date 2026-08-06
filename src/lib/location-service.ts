/**
 * Location helpers for postal-code → city lookup.
 * Pure TypeScript — no React / JSX.
 */

export type CityLookupResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty"; message: string }
  | { status: "error"; message: string }
  | { status: "success"; cities: string[] };

type CommuneResponse = {
  nom: string;
};

const GEO_API_BASE = "https://geo.api.gouv.fr/communes";

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

  const url = `${GEO_API_BASE}?codePostal=${encodeURIComponent(postalCode)}&fields=nom`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("location-lookup-failed");
  }

  const communes = (await response.json()) as CommuneResponse[];
  return Array.from(
    new Set(communes.map((item) => item.nom).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
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
