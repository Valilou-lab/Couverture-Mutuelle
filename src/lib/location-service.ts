/**
 * Postal-code helpers — format / French validity only.
 * No remote city lookup (removed for latency & reliability).
 */

/** Keep digits only, max 5 characters. */
export function normalizePostalCode(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 5);
}

export function isCompletePostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Offline check that a 5-digit code matches French postal ranges
 * (métropole 01–95, Corse 20xxx, DOM-TOM 971–978 / 984–989).
 * Does not call any external API.
 */
export function isValidFrenchPostalCode(postalCode: string): boolean {
  if (!isCompletePostalCode(postalCode)) return false;

  // Corse (2A / 2B) — 20000 + 201xx / 202xx
  if (postalCode.startsWith("20")) {
    return postalCode === "20000" || /^20[12]\d{2}$/.test(postalCode);
  }

  // DOM-TOM
  if (postalCode.startsWith("97") || postalCode.startsWith("98")) {
    return /^(?:97[1-8]|98[4-9])\d{2}$/.test(postalCode);
  }

  const dept = Number.parseInt(postalCode.slice(0, 2), 10);
  // Départements métropolitains 01–19 et 21–95 (20 = Corse, 96 inexistant)
  return dept >= 1 && dept <= 95 && dept !== 20;
}
