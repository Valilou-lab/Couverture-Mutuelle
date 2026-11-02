import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

/**
 * V2 `/devis` phone clean → normalize (E.164) → validate.
 * Default country FR when no international prefix is present.
 * Does not replace Vertikl/Twilio `toInternationalFrenchPhone` yet.
 */

export const V2_PHONE_INVALID_MESSAGE =
  "Veuillez saisir un numéro de téléphone valide.";

export const V2_PHONE_REQUIRED_MESSAGE =
  "Indiquez votre numéro de téléphone.";

const DEFAULT_COUNTRY: CountryCode = "FR";

/**
 * Tolerate WhatsApp / mobile paste noise: regular spaces, NBSP, NNBSP,
 * dashes, dots, parentheses. Keep a single leading `+`. Map leading `00` → `+`.
 */
export function cleanV2PhoneInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  let value = trimmed.replace(/^00(?=\d)/, "+");
  const wantsPlus = value.startsWith("+");

  value = value.replace(/[^\d+]/g, "");
  value = value.replace(/\+/g, "");
  return wantsPlus ? `+${value}` : value;
}

/**
 * Parse + validate, then return E.164 (`+33781833756`) or null.
 * National FR numbers without prefix are interpreted as French.
 */
export function normalizeV2PhoneToE164(raw: string): string | null {
  const cleaned = cleanV2PhoneInput(raw);
  if (!cleaned) return null;

  const parsed = parsePhoneNumberFromString(cleaned, DEFAULT_COUNTRY);
  if (!parsed || !parsed.isValid()) return null;

  return parsed.format("E.164");
}

export function isValidV2Phone(raw: string): boolean {
  return normalizeV2PhoneToE164(raw) !== null;
}

/** Digits only (no +) — useful for “looks complete enough” UX heuristics. */
export function v2PhoneDigitCount(raw: string): number {
  return cleanV2PhoneInput(raw).replace(/\D/g, "").length;
}

/**
 * Error after blur / submit. Empty → required. Invalid → generic message.
 * Incomplete short inputs can pass `allowIncomplete` to skip the error.
 */
export function getV2PhoneInputError(
  raw: string,
  options?: { allowIncomplete?: boolean },
): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return V2_PHONE_REQUIRED_MESSAGE;

  if (options?.allowIncomplete) {
    // National FR is 10 digits; international varies — wait until 8+ digits.
    if (v2PhoneDigitCount(trimmed) < 8) return null;
  }

  if (!isValidV2Phone(trimmed)) return V2_PHONE_INVALID_MESSAGE;
  return null;
}
