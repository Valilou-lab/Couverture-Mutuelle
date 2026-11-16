import type { V2PartnerId } from "./partners-registry";
import { isV2PartnerId } from "./partners-registry";

/**
 * Eligibility proof linking Vertikl precheck → buyers → expiry.
 * Scaffold: opaque base64 JSON (NOT cryptographically signed).
 * Expiry follows Vertikl `expires_at` (reservation window), not a fixed 30 min TTL.
 */

export type V2EligibilityTokenPayload = {
  v: 2;
  issuedAt: string;
  /** Vertikl reservation expiry (ISO). */
  expiresAt: string;
  precheckId: string;
  /** Exact Vertikl buyer UUIDs announced to the prospect (order preserved). */
  buyerIds: string[];
  /** Mapped registry ids only (subset). */
  partnerIds: V2PartnerId[];
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
  precheckId: string;
  expiresAt: string;
  buyerIds: readonly string[];
  partnerIds: readonly string[];
  criteria: Record<string, unknown>;
  now?: Date;
}): string {
  const now = input.now ?? new Date();
  const partnerIds = input.partnerIds.filter(isV2PartnerId);
  const buyerIds = input.buyerIds
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const payload: V2EligibilityTokenPayload = {
    v: 2,
    issuedAt: now.toISOString(),
    expiresAt: input.expiresAt,
    precheckId: input.precheckId.trim(),
    buyerIds,
    partnerIds,
    criteriaFingerprint: fingerprintEligibilityCriteria(input.criteria),
  };
  return `v2e2.${toBase64Url(JSON.stringify(payload))}`;
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
  if (!trimmed.startsWith("v2e2.")) {
    return { ok: false, reason: "malformed" };
  }
  try {
    const raw = fromBase64Url(trimmed.slice("v2e2.".length));
    const parsed = JSON.parse(raw) as Partial<V2EligibilityTokenPayload>;
    if (
      parsed.v !== 2 ||
      typeof parsed.issuedAt !== "string" ||
      typeof parsed.expiresAt !== "string" ||
      typeof parsed.precheckId !== "string" ||
      typeof parsed.criteriaFingerprint !== "string" ||
      !Array.isArray(parsed.buyerIds) ||
      !Array.isArray(parsed.partnerIds)
    ) {
      return { ok: false, reason: "malformed" };
    }
    const buyerIds = parsed.buyerIds.filter(
      (id): id is string => typeof id === "string" && id.trim().length > 0,
    );
    if (buyerIds.length === 0 || !parsed.precheckId.trim()) {
      return { ok: false, reason: "malformed" };
    }
    if (Date.parse(parsed.expiresAt) <= now.getTime()) {
      return { ok: false, reason: "expired" };
    }
    return {
      ok: true,
      payload: {
        v: 2,
        issuedAt: parsed.issuedAt,
        expiresAt: parsed.expiresAt,
        precheckId: parsed.precheckId,
        buyerIds,
        partnerIds: parsed.partnerIds.filter(isV2PartnerId),
        criteriaFingerprint: parsed.criteriaFingerprint,
      },
    };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}
