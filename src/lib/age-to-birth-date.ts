import { MAX_ELIGIBLE_AGE, MIN_ELIGIBLE_AGE } from "@/lib/savings-engine";

/** Vertikl still requires a full JJ/MM/AAAA — day/month are fixed. */
export const VERTIKL_DEFAULT_BIRTH_DAY = "15";
export const VERTIKL_DEFAULT_BIRTH_MONTH = "06";

const SYNTHETIC_BIRTH_DATE = new RegExp(
  `^${VERTIKL_DEFAULT_BIRTH_DAY}/${VERTIKL_DEFAULT_BIRTH_MONTH}/(\\d{4})$`,
);

/** 66 ans en 2026 → `15/06/1960`. Only the year tracks the declared age. */
export function birthDateFromDeclaredAge(
  age: number,
  now: Date = new Date(),
): string {
  const year = now.getFullYear() - age;
  return `${VERTIKL_DEFAULT_BIRTH_DAY}/${VERTIKL_DEFAULT_BIRTH_MONTH}/${year}`;
}

export function declaredAgeFromBirthDate(
  birthDate: string,
  now: Date = new Date(),
): number | null {
  const match = SYNTHETIC_BIRTH_DATE.exec(birthDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  if (!Number.isInteger(year)) return null;
  return now.getFullYear() - year;
}

export function isSyntheticAgeBirthDate(value: string): boolean {
  return SYNTHETIC_BIRTH_DATE.test(value.trim());
}

export function getDeclaredAgeError(age: number): string | null {
  if (!Number.isInteger(age)) {
    return "Indiquez votre âge.";
  }
  if (age < MIN_ELIGIBLE_AGE) {
    return `Vous devez avoir au moins ${MIN_ELIGIBLE_AGE} ans.`;
  }
  if (age > MAX_ELIGIBLE_AGE) {
    return `L’âge maximum accepté est de ${MAX_ELIGIBLE_AGE} ans.`;
  }
  return null;
}

export function parseDeclaredAgeInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, "").slice(0, 3);
  if (!digits) return null;
  const age = Number(digits);
  if (!Number.isInteger(age) || age <= 0) return null;
  return age;
}
