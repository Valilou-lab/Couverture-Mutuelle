/**
 * Server-side postal-code → city names.
 * Prefer geo.api.gouv.fr; fall back to api-adresse when geo is unreachable
 * (DNS / network / outage). Never call this from the browser — use /api/communes.
 */

type GeoCommune = { nom?: string };

type AdresseFeature = {
  properties?: {
    postcode?: string;
    city?: string;
    name?: string;
  };
};

function uniqueSortedCities(names: string[]): string[] {
  return Array.from(new Set(names.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}

async function fetchFromGeoApi(postalCode: string): Promise<string[] | null> {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(postalCode)}&fields=nom`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86_400 },
      },
    );
    if (!response.ok) return null;
    const communes = (await response.json()) as GeoCommune[];
    if (!Array.isArray(communes)) return null;
    return uniqueSortedCities(communes.map((item) => item.nom ?? ""));
  } catch {
    return null;
  }
}

async function fetchFromAdresseApi(postalCode: string): Promise<string[] | null> {
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(postalCode)}&type=municipality&limit=20`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86_400 },
      },
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as { features?: AdresseFeature[] };
    const features = Array.isArray(payload.features) ? payload.features : [];
    const cities = features
      .filter((feature) => feature.properties?.postcode === postalCode)
      .map(
        (feature) =>
          feature.properties?.city?.trim() ||
          feature.properties?.name?.trim() ||
          "",
      );
    return uniqueSortedCities(cities);
  } catch {
    return null;
  }
}

/** Returns city names for a 5-digit French postal code, or throws on total failure. */
export async function lookupCommunesByPostalCode(
  postalCode: string,
): Promise<string[]> {
  const fromGeo = await fetchFromGeoApi(postalCode);
  if (fromGeo !== null) return fromGeo;

  const fromAdresse = await fetchFromAdresseApi(postalCode);
  if (fromAdresse !== null) return fromAdresse;

  throw new Error("commune-lookup-failed");
}
