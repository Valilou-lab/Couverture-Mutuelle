/**
 * V2 OTP adapter — reuses Main Twilio endpoints (no second Verify system):
 * - POST `/api/verify/start`
 * - POST `/api/verify/check`
 * Cookie proof `cm_phone_verified` is set by `/api/verify/check`.
 */

export type OtpStartResult = {
  ok: true;
};

export type OtpVerifyResult = {
  ok: true;
};

export class OtpClientError extends Error {
  readonly code: string;

  constructor(message: string, code = "OTP_FAILED") {
    super(message);
    this.name = "OtpClientError";
    this.code = code;
  }
}

export async function startPhoneOtp(phone: string): Promise<OtpStartResult> {
  const response = await fetch("/api/verify/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
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

  const response = await fetch("/api/verify/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
  } | null;

  if (!response.ok || payload?.success !== true) {
    if (payload?.error === "CODE_EXPIRED") {
      throw new OtpClientError(
        "Ce code a expiré. Demandez-en un nouveau.",
        "CODE_EXPIRED",
      );
    }
    if (
      payload?.error === "NOT_APPROVED" ||
      payload?.error === "INVALID_CODE"
    ) {
      throw new OtpClientError(
        "Ce code est incorrect. Vérifiez-le et réessayez.",
        "INVALID_CODE",
      );
    }
    throw new OtpClientError(
      "Nous n’avons pas pu vérifier votre numéro pour le moment. Merci de réessayer.",
      payload?.error || "OTP_CHECK_FAILED",
    );
  }

  return { ok: true };
}
