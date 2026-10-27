import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { toInternationalFrenchPhone } from "@/lib/vertikl/normalize";

export const PHONE_VERIFY_COOKIE = "cm_phone_verified";
const PROOF_TTL_MS = 15 * 60 * 1000;
const MIN_SECRET_LENGTH = 32;

type ProofPayload = {
  p: string;
  e: number;
};

/**
 * PHONE_VERIFY_SECRET is mandatory — no fallback to Twilio tokens or hardcoded values.
 * Rejects short secrets in production.
 */
export function getPhoneVerifySigningKey(): string | null {
  const key = process.env.PHONE_VERIFY_SECRET?.trim() ?? "";
  if (!key) return null;

  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  if (isProduction && key.length < MIN_SECRET_LENGTH) {
    console.error(
      "[phone-verify] PHONE_VERIFY_SECRET must be at least 32 characters in production",
    );
    return null;
  }

  return key;
}

function b64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function sign(payloadB64: string, key: string): string {
  return b64url(createHmac("sha256", key).update(payloadB64).digest());
}

/** Build a short-lived signed proof bound to an E.164 phone number. */
export function createPhoneVerifyProof(phoneE164: string): string | null {
  const key = getPhoneVerifySigningKey();
  if (!key) return null;
  const payload: ProofPayload = {
    p: phoneE164,
    e: Date.now() + PROOF_TTL_MS,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64, key)}`;
}

/**
 * Validates the proof and ensures it matches the submitted phone number.
 * A different number after OTP approval always fails.
 */
export function verifyPhoneProofToken(
  token: string | undefined,
  phoneRaw: string,
): boolean {
  const key = getPhoneVerifySigningKey();
  if (!key || !token) return false;

  const phoneE164 = toInternationalFrenchPhone(phoneRaw);
  if (!phoneE164) return false;

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  const [payloadB64, signature] = parts;

  const expected = sign(payloadB64, key);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  try {
    const payload = JSON.parse(
      fromB64url(payloadB64).toString("utf8"),
    ) as ProofPayload;
    if (typeof payload.p !== "string" || typeof payload.e !== "number") {
      return false;
    }
    if (payload.p !== phoneE164) return false;
    if (Date.now() > payload.e) return false;
    return true;
  } catch {
    return false;
  }
}

export function phoneVerifyCookieOptions(maxAgeSec = 900) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

/** Clear the OTP proof cookie after a successful lead submission. */
export function clearPhoneVerifyCookie(
  response: { cookies: { set: (name: string, value: string, options: object) => void } },
) {
  response.cookies.set(PHONE_VERIFY_COOKIE, "", {
    ...phoneVerifyCookieOptions(0),
    maxAge: 0,
  });
}
