import type { QuoteFormData } from "@/components/form/types";
import {
  isValidEmailAddress,
  type FieldErrors,
} from "@/components/form/validation";
import { detectV2EmailDomainTypo } from "@/lib/v2/email-typos";
import {
  getV2PhoneInputError,
  isValidV2Phone,
} from "@/lib/v2/phone";

export const V2_EMAIL_INVALID_MESSAGE =
  "Veuillez saisir une adresse e-mail valide.";

export const V2_EMAIL_VERIFYING_MESSAGE = "Vérification de votre e-mail…";

export type V2EmailClientIssue =
  | { kind: "format"; message: string }
  | { kind: "typo"; message: string; suggestion: string };

/**
 * Levels 1–2 (client): strict format + known consumer-domain typos.
 * Level 3 (MX) is done via `/api/v2/validate-email`.
 */
export function getV2EmailClientIssue(
  value: string,
): V2EmailClientIssue | null {
  const email = value.trim();
  if (!email || /\s/.test(email) || !isValidEmailAddress(email)) {
    return { kind: "format", message: V2_EMAIL_INVALID_MESSAGE };
  }

  const typo = detectV2EmailDomainTypo(email);
  if (typo) {
    return {
      kind: "typo",
      message: `Vérifiez votre adresse e-mail. Vouliez-vous dire ${typo.suggestedEmail} ?`,
      suggestion: typo.suggestedEmail,
    };
  }

  return null;
}

export function getV2EmailInputError(value: string): string | null {
  return getV2EmailClientIssue(value)?.message ?? null;
}

export type V2EmailServerResult =
  | { ok: true }
  | { ok: false; message: string; suggestion?: string };

export async function validateV2EmailOnServer(
  email: string,
): Promise<V2EmailServerResult> {
  const response = await fetch("/api/v2/validate-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  let json: {
    ok?: boolean;
    message?: string;
    suggestion?: string;
  } | null = null;
  try {
    json = (await response.json()) as {
      ok?: boolean;
      message?: string;
      suggestion?: string;
    };
  } catch {
    json = null;
  }

  if (!response.ok || !json?.ok) {
    return {
      ok: false,
      message: json?.message?.trim() || V2_EMAIL_INVALID_MESSAGE,
      ...(typeof json?.suggestion === "string"
        ? { suggestion: json.suggestion }
        : {}),
    };
  }

  return { ok: true };
}

/** Email levels 1–2 + V2 phone (E.164 via libphonenumber). MX is async. */
export function validateV2EmailPhone(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  const emailIssue = getV2EmailClientIssue(data.email);
  if (emailIssue) errors.email = emailIssue.message;
  const phoneError = getV2PhoneInputError(data.phone);
  if (phoneError) errors.phone = phoneError;
  return errors;
}

export function isV2PhoneComplete(data: QuoteFormData): boolean {
  return isValidV2Phone(data.phone);
}

/** Local completeness only — CTA also waits for server MX OK in the step. */
export function isV2EmailPhoneComplete(data: QuoteFormData): boolean {
  return (
    !getV2EmailClientIssue(data.email) && isV2PhoneComplete(data)
  );
}
