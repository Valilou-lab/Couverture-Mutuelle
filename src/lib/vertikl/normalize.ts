/**
 * Date / phone helpers for Vertikl payloads.
 */

/** JJ/MM/AAAA → yyyy-MM-dd. Returns null if invalid shape. */
export function frenchDateToIso(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = match[1];
  const month = match[2];
  const year = match[3];
  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
}

/** Vertikl DateTime: yyyy-MM-dd'T'HH:mm:ss (UTC components). */
export function formatVertiklDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export function addMonthsUtc(date: Date, months: number): Date {
  const next = new Date(date.getTime());
  const day = next.getUTCDate();
  next.setUTCMonth(next.getUTCMonth() + months);
  // Clamp overflow (e.g. Jan 31 + 1 month).
  if (next.getUTCDate() < day) {
    next.setUTCDate(0);
  }
  return next;
}

/**
 * Normalize FR phone to +33XXXXXXXXX.
 * Handles spaces, dots, dashes, 06/07…, +33…, 0033…
 * Returns null if the number cannot be normalized safely.
 */
export function toInternationalFrenchPhone(value: string): string | null {
  let digits = value.trim().replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("33") && digits.length === 11) {
    const national = digits.slice(2);
    if (!/^[1-9]\d{8}$/.test(national)) return null;
    return `+${digits}`;
  }

  if (
    digits.startsWith("0") &&
    digits.length === 10 &&
    /^0[1-9]\d{8}$/.test(digits)
  ) {
    return `+33${digits.slice(1)}`;
  }

  return null;
}
