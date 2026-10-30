import { getBirthDateAgeError } from "@/components/form/validation";

/**
 * V2-only JJ/MM/AAAA mask.
 * Digits only; inserts `/` after day and month (incl. trailing `/` while typing).
 * Pass previous value so Backspace on a trailing `/` also removes the digit before it.
 */
export function formatV2BirthDateInput(raw: string, previous = ""): string {
  const prevDigits = previous.replace(/\D/g, "");
  let digits = raw.replace(/\D/g, "").slice(0, 8);

  // Deleting a separator: also drop the digit that precedes it.
  if (
    digits.length === prevDigits.length &&
    raw.length < previous.length &&
    digits.length > 0
  ) {
    digits = digits.slice(0, -1);
  }

  if (digits.length === 0) return "";
  if (digits.length <= 2) {
    return digits.length === 2 ? `${digits}/` : digits;
  }
  if (digits.length <= 4) {
    const day = digits.slice(0, 2);
    const month = digits.slice(2);
    return month.length === 2 ? `${day}/${month}/` : `${day}/${month}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function toCompleteBirthDate(digits: string): string {
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

/**
 * Immediate feedback while typing + full calendar/age rules when complete.
 * Returns null when empty or still incomplete with valid day/month so far.
 */
export function getV2BirthDateInputError(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return null;

  if (digits.length >= 2) {
    const day = Number(digits.slice(0, 2));
    if (!Number.isFinite(day) || day < 1 || day > 31) {
      return "Jour invalide. Saisissez un jour entre 01 et 31.";
    }
  }

  if (digits.length >= 4) {
    const month = Number(digits.slice(2, 4));
    if (!Number.isFinite(month) || month < 1 || month > 12) {
      return "Mois invalide. Saisissez un mois entre 01 et 12.";
    }
  }

  if (digits.length < 8) return null;

  // Reuse Main calendar + future/age rules (isValidBirthDate + âge éligible).
  return getBirthDateAgeError(toCompleteBirthDate(digits));
}

export function isV2BirthDateCompleteAndValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 8 && getV2BirthDateInputError(value) === null;
}
