/**
 * V2 OTP adapter — reuses Main Twilio endpoints (no second Verify system):
 * - POST `/api/verify/start`
 * - POST `/api/verify/check`
 * Cookie proof `cm_phone_verified` is set by `/api/verify/check`.
 */

import { normalizeV2PhoneToE164 } from "@/lib/v2/phone";

export type OtpStartResult = {
  ok: true;
};

export type OtpVerifyResult = {
  ok: true;
  /** Canonical E.164 stored in the proof cookie — reuse for eligibility/leads. */
  phoneE164: string;
};

export class OtpClientError extends Error {
  readonly code: string;

  constructor(message: string, code = "OTP_FAILED") {
    super(message);
    this.name = "OtpClientError";
    this.code = code;
  }
}

/** Same-origin credentialed fetch so Set-Cookie / Cookie round-trip works. */
const CREDENTIALED: RequestCredentials = "include";

export async function startPhoneOtp(phone: string): Promise<OtpStartResult> {
  const phoneE164 = normalizeV2PhoneToE164(phone) || phone.trim();
  const response = await fetch("/api/verify/start", {
    method: "POST",
    credentials: CREDENTIALED,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: phoneE164 }),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
  } | null;

  if (!response.ok || payload?.success !== true) {
    if (payload?.error === "RATE_LIMITED") {
      throw new OtpClientError(
        "Veuillez patienter quelques secondes avant de renvoyer un code.",
        "RATE_LIMITED",
      );
    }
    if (payload?.error === "INVALID_PHONE") {
      throw new OtpClientError(
        "Merci de renseigner un numéro valide.",
        "INVALID_PHONE",
      );
    }
    throw new OtpClientError(
      "Nous n’avons pas pu vérifier votre numéro pour le moment. Merci de réessayer.",
      payload?.error || "OTP_START_FAILED",
    );
  }

  return { ok: true };
}

export async function verifyPhoneOtp(
  phone: string,
  code: string,
): Promise<OtpVerifyResult> {
  if (!/^\d{6}$/.test(code)) {
    throw new OtpClientError("Saisissez un code à 6 chiffres.", "INVALID_CODE");
  }

  // Always send E.164 so the cookie proof and later eligibility share one form.
  const phoneE164 = normalizeV2PhoneToE164(phone);
  if (!phoneE164) {
    throw new OtpClientError(
      "Merci de renseigner un numéro valide.",
      "INVALID_PHONE",
    );
  }

  const response = await fetch("/api/verify/check", {
    method: "POST",
    credentials: CREDENTIALED,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: phoneE164, code }),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
    phoneE164?: string;
  } | null;

  if (!response.ok || payload?.success !== true) {
    console.error("OTP_CHECK_FAILED", {
      httpStatus: response.status,
      error: payload?.error ?? null,
    });
    if (payload?.error === "CODE_EXPIRED") {
      throw new OtpClientError(
        "Ce code a expiré. Demandez un nouveau code pour continuer.",
        "CODE_EXPIRED",
      );
    }
    if (
      payload?.error === "NOT_APPROVED" ||
      payload?.error === "INVALID_CODE"
    ) {
      throw new OtpClientError(
        "Code incorrect. Vérifiez le SMS reçu et réessayez.",
        "INVALID_CODE",
      );
    }
    throw new OtpClientError(
      "Nous n’avons pas pu vérifier votre numéro pour le moment. Merci de réessayer.",
      payload?.error || "OTP_CHECK_FAILED",
    );
  }

  const verifiedPhone =
    typeof payload?.phoneE164 === "string" && payload.phoneE164.startsWith("+33")
      ? payload.phoneE164
      : phoneE164;

  console.info("OTP_SUCCESS", {
    httpStatus: response.status,
    phonePrefix: verifiedPhone.slice(0, 6),
  });

  return { ok: true, phoneE164: verifiedPhone };
}
