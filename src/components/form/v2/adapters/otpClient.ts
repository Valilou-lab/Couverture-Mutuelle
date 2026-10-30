/**
 * V2 OTP adapter — local scaffold only.
 *
 * Later: reuse Main endpoints as-is (no second Twilio system):
 * - POST `/api/verify/start`
 * - POST `/api/verify/check`
 * - cookie proof via `phone-verify-proof` (same as QuoteForm)
 *
 * Lead creation must happen only after OTP is validated.
 */

export type OtpVerifyResult = {
  ok: true;
  mode: "local-scaffold";
};

export async function verifyOtpLocally(code: string): Promise<OtpVerifyResult> {
  if (!/^\d{6}$/.test(code)) {
    throw new Error("Saisissez un code à 6 chiffres.");
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 600);
  });

  return { ok: true, mode: "local-scaffold" };
}
