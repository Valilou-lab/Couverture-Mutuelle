import { createHash } from "crypto";

/**
 * TEMP diagnostic — SAFE Vertikl fields snapshots (precheck vs acquire).
 * No plaintext email/phone/names. Survives Vercel serverless via eligibility token.
 */

const PII_KEYS = new Set([
  "email",
  "phone",
  "first_name",
  "last_name",
  "consent_ip_address",
  "consent_user_agent",
  "consent_landing_page_url",
  "consent_referrer",
  "consent_optin_text",
]);

export type SafeFieldEntry = {
  type: string;
  /** Non-PII value, or a fingerprint / presence marker for PII. */
  value: unknown;
};

export type SafeFieldsSnapshot = {
  precheckId: string | null;
  keys: string[];
  entries: Record<string, SafeFieldEntry>;
  emailFp: string | null;
  phoneFp: string | null;
};

export type FieldsCompareResult = {
  precheckId: string | null;
  PRECHECK_ONLY: string[];
  ACQUIRE_ONLY: string[];
  DIFFERENT_VALUES: Array<{
    key: string;
    precheck: SafeFieldEntry;
    acquire: SafeFieldEntry;
  }>;
  MATCHING: string[];
  precheckKeys: string[];
  acquireKeys: string[];
};

export type VertiklApiKeyFingerprint = {
  envVar: "VERTIKL_API_KEY";
  present: boolean;
  length: number;
  last4: string | null;
  sha256_12: string | null;
};

export type VertiklRuntimeDiag = {
  vertiklApiMode: string;
  endpoint: string;
  campaignId: string;
  apiKey: VertiklApiKeyFingerprint;
};

const VERTIKL_BASE_URL = "https://ebre.vertikl.app";

export function shortHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export function fingerprintVertiklApiKey(
  raw: string | undefined | null = process.env.VERTIKL_API_KEY,
): VertiklApiKeyFingerprint {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) {
    return {
      envVar: "VERTIKL_API_KEY",
      present: false,
      length: 0,
      last4: null,
      sha256_12: null,
    };
  }
  return {
    envVar: "VERTIKL_API_KEY",
    present: true,
    length: trimmed.length,
    last4: trimmed.slice(-4),
    sha256_12: shortHash(trimmed),
  };
}

export function getVertiklApiMode(): string {
  return (process.env.VERTIKL_API_MODE ?? "test").trim().toLowerCase();
}

export function resolveVertiklPrecheckEndpoint(): string {
  return `${VERTIKL_BASE_URL}/api/leads/precheck`;
}

export function resolveVertiklAcquireEndpoint(
  mode: string = getVertiklApiMode(),
): string {
  if (mode === "production") return `${VERTIKL_BASE_URL}/api/leads`;
  return `${VERTIKL_BASE_URL}/api/leads/test`;
}

export function buildVertiklRuntimeDiag(input: {
  campaignId: string;
  kind: "precheck" | "acquire";
}): VertiklRuntimeDiag {
  const vertiklApiMode = getVertiklApiMode();
  return {
    vertiklApiMode,
    endpoint:
      input.kind === "precheck"
        ? resolveVertiklPrecheckEndpoint()
        : resolveVertiklAcquireEndpoint(vertiklApiMode),
    campaignId: input.campaignId,
    apiKey: fingerprintVertiklApiKey(),
  };
}

function valueType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function normalizeForCompare(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Build a PII-safe snapshot of a Vertikl `fields` object. */
export function buildSafeFieldsSnapshot(
  fields: Record<string, unknown>,
  precheckId: string | null = null,
): SafeFieldsSnapshot {
  const keys = Object.keys(fields).sort();
  const entries: Record<string, SafeFieldEntry> = {};
  let emailFp: string | null = null;
  let phoneFp: string | null = null;

  for (const key of keys) {
    const raw = fields[key];
    const type = valueType(raw);

    if (key === "email" && typeof raw === "string") {
      emailFp = shortHash(raw.trim().toLowerCase());
      entries[key] = { type, value: `fp:${emailFp}` };
      continue;
    }
    if (key === "phone" && typeof raw === "string") {
      phoneFp = shortHash(raw.trim());
      entries[key] = { type, value: `fp:${phoneFp}` };
      continue;
    }
    if (PII_KEYS.has(key)) {
      if (typeof raw === "string") {
        entries[key] = {
          type,
          value: raw.trim().length === 0 ? "(empty-string)" : "(redacted)",
        };
      } else {
        entries[key] = { type, value: "(redacted)" };
      }
      continue;
    }

    if (typeof raw === "string" && raw.trim().length === 0) {
      entries[key] = { type, value: "(empty-string)" };
      continue;
    }

    entries[key] = { type, value: raw };
  }

  return { precheckId, keys, entries, emailFp, phoneFp };
}

export function isSafeFieldsSnapshot(value: unknown): value is SafeFieldsSnapshot {
  if (!value || typeof value !== "object") return false;
  const snap = value as Partial<SafeFieldsSnapshot>;
  return (
    Array.isArray(snap.keys) &&
    snap.entries !== null &&
    typeof snap.entries === "object" &&
    !Array.isArray(snap.entries)
  );
}

export function compareFieldsSnapshots(
  precheck: SafeFieldsSnapshot,
  acquire: SafeFieldsSnapshot,
): FieldsCompareResult {
  const preKeys = new Set(precheck.keys);
  const acqKeys = new Set(acquire.keys);

  const PRECHECK_ONLY = precheck.keys.filter((k) => !acqKeys.has(k));
  const ACQUIRE_ONLY = acquire.keys.filter((k) => !preKeys.has(k));

  const DIFFERENT_VALUES: FieldsCompareResult["DIFFERENT_VALUES"] = [];
  const MATCHING: string[] = [];

  for (const key of precheck.keys) {
    if (!acqKeys.has(key)) continue;
    const left = precheck.entries[key]!;
    const right = acquire.entries[key]!;
    const sameType = left.type === right.type;
    const sameValue =
      normalizeForCompare(left.value) === normalizeForCompare(right.value);
    if (sameType && sameValue) {
      MATCHING.push(key);
    } else {
      DIFFERENT_VALUES.push({ key, precheck: left, acquire: right });
    }
  }

  return {
    precheckId: precheck.precheckId || acquire.precheckId,
    PRECHECK_ONLY,
    ACQUIRE_ONLY,
    DIFFERENT_VALUES,
    MATCHING,
    precheckKeys: precheck.keys,
    acquireKeys: acquire.keys,
  };
}

/** Best-effort same-process cache (dev). Production relies on the eligibility token. */
const snapshotsByPrecheckId = new Map<string, SafeFieldsSnapshot>();

export function storePrecheckFieldsSnapshot(
  precheckId: string,
  fields: Record<string, unknown>,
): SafeFieldsSnapshot {
  const snapshot = buildSafeFieldsSnapshot(fields, precheckId);
  snapshotsByPrecheckId.set(precheckId, snapshot);
  return snapshot;
}

export function getPrecheckFieldsSnapshot(
  precheckId: string,
): SafeFieldsSnapshot | null {
  return snapshotsByPrecheckId.get(precheckId) ?? null;
}
