import type { V2PartnerId } from "./partners-registry";
import { isV2PartnerId } from "./partners-registry";

/**
 * Eligibility proof linking criteria → eligible partners → expiry.
 * Scaffold: opaque base64 JSON (NOT cryptographically signed).
 * Replace `createV2EligibilityToken` / `verifyV2EligibilityToken` with HMAC/JWT later.
 */

export const V2_ELIGIBILITY_TOKEN_TTL_MS = 30 * 60 * 1000;

export type V2EligibilityTokenPayload = {
  v: 1;
  issuedAt: string;
  expiresAt: string;
  partnerIds: V2PartnerId[];
  /** Stable fingerprint of criteria used for this eligibility decision. */
  criteriaFingerprint: string;
};

function toBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Deterministic non-secret fingerprint for scaffold correlation. */
export function fingerprintEligibilityCriteria(
  criteria: Record<string, unknown>,
): string {
  const keys = Object.keys(criteria).sort();
  const normalized = keys.map((key) => `${key}:${String(criteria[key] ?? "")}`);
  return toBase64Url(normalized.join("|")).slice(0, 32);
}

export function createV2EligibilityToken(input: {
  partnerIds: readonly string[];
  criteria: Record<string, unknown>;
  now?: Date;
  ttlMs?: number;
}): string {
  const now = input.now ?? new Date();
  const ttl = input.ttlMs ?? V2_ELIGIBILITY_TOKEN_TTL_MS;
  const partnerIds = input.partnerIds.filter(isV2PartnerId);
  const payload: V2EligibilityTokenPayload = {
    v: 1,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttl).toISOString(),
    partnerIds,
    criteriaFingerprint: fingerprintEligibilityCriteria(input.criteria),
  };
  return `v2e1.${toBase64Url(JSON.stringify(payload))}`;
}

export type V2EligibilityTokenVerifyResult =
  | { ok: true; payload: V2EligibilityTokenPayload }
  | { ok: false; reason: "malformed" | "expired" | "empty" };

export function verifyV2EligibilityToken(
  token: string | null | undefined,
  now: Date = new Date(),
): V2EligibilityTokenVerifyResult {
  if (!token || typeof token !== "string") {
    return { ok: false, reason: "empty" };
  }
  const trimmed = token.trim();
  if (!trimmed.startsWith("v2e1.")) {
    return { ok: false, reason: "malformed" };
  }
  try {
    const raw = fromBase64Url(trimmed.slice("v2e1.".length));
    const parsed = JSON.parse(raw) as Partial<V2EligibilityTokenPayload>;
    if (
      parsed.v !== 1 ||
      typeof parsed.issuedAt !== "string" ||
      typeof parsed.expiresAt !== "string" ||
      typeof parsed.criteriaFingerprint !== "string" ||
      !Array.isArray(parsed.partnerIds)
    ) {
      return { ok: false, reason: "malformed" };
    }
    const partnerIds = parsed.partnerIds.filter(isV2PartnerId);
    if (partnerIds.length === 0) {
      return { ok: false, reason: "malformed" };
    }
    if (Date.parse(parsed.expiresAt) <= now.getTime()) {
      return { ok: false, reason: "expired" };
    }
    return {
      ok: true,
      payload: {
        v: 1,
        issuedAt: parsed.issuedAt,
        expiresAt: parsed.expiresAt,
        partnerIds,
        criteriaFingerprint: parsed.criteriaFingerprint,
      },
    };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}
