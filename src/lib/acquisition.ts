import type { AcquisitionChannel, AcquisitionParams } from "@/lib/vertikl/types";

const ACQUISITION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const satisfies readonly (keyof AcquisitionParams)[];

const STORAGE_KEY = "cm-acquisition-first-touch-v1";
const STORAGE_VERSION = 1;
const FIRST_TOUCH_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const PAID_MEDIUMS = new Set(["cpc", "paid", "paid_social", "paidsocial"]);
const GOOGLE_PAID_MEDIUMS = new Set(["cpc", "paid"]);

type PersistedFirstTouch = {
  v: typeof STORAGE_VERSION;
  capturedAt: number;
  landingPageUrl: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
};

export type StoredAcquisition = {
  landingPageUrl: string;
  referrer: string;
  acquisition: AcquisitionParams;
};

/** In-memory fallback when localStorage is unavailable (private mode). */
let memoryStore: PersistedFirstTouch | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeToken(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeMedium(value: string | undefined): string {
  return normalizeToken(value).replace(/[-\s]/g, "_");
}

function stripWww(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

function parseHostname(url: string): string | null {
  if (!url.trim()) return null;
  try {
    return stripWww(new URL(url).hostname);
  } catch {
    return null;
  }
}

export function isInternalReferrer(
  referrer: string,
  currentOrigin: string = isBrowser() ? window.location.origin : "",
): boolean {
  const trimmed = referrer.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    if (currentOrigin && url.origin === currentOrigin) return true;

    const host = stripWww(url.hostname);
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "couverturemutuelle.fr" ||
      host.endsWith(".couverturemutuelle.fr")
    );
  } catch {
    return false;
  }
}

function isInstagramHost(host: string): boolean {
  return host === "instagram.com" || host.endsWith(".instagram.com") || host === "instagr.am";
}

function isFacebookHost(host: string): boolean {
  return (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.com" ||
    host.endsWith(".fb.com") ||
    host === "fb.me" ||
    host === "l.facebook.com" ||
    host === "lm.facebook.com" ||
    host === "m.facebook.com"
  );
}

function isGoogleHost(host: string): boolean {
  return (
    host === "google.com" ||
    host.endsWith(".google.com") ||
    /^google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(host) ||
    host === "googleadservices.com" ||
    host.endsWith(".googleadservices.com")
  );
}

function pickParams(source: PersistedFirstTouch | AcquisitionParams): AcquisitionParams {
  const result: AcquisitionParams = {};
  for (const key of ACQUISITION_KEYS) {
    const value = source[key]?.trim();
    if (value) result[key] = value;
  }
  return result;
}

/** Read UTM / click IDs from a query string (defaults to the current URL). */
export function readAcquisitionParams(
  search: string = isBrowser() ? window.location.search : "",
): AcquisitionParams {
  const params = new URLSearchParams(search);
  const result: AcquisitionParams = {};

  for (const key of ACQUISITION_KEYS) {
    const value = params.get(key)?.trim();
    if (value) result[key] = value;
  }

  return result;
}

/**
 * Derive the marketing channel from first-touch params + original referrer.
 * Priority: gclid > fbclid > explicit UTM > referrer > direct.
 */
export function deriveAcquisitionChannel(input: {
  utm_source?: string;
  utm_medium?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
}): AcquisitionChannel {
  const source = normalizeToken(input.utm_source);
  const medium = normalizeMedium(input.utm_medium);
  const hasGclid = Boolean(input.gclid?.trim());
  const hasFbclid = Boolean(input.fbclid?.trim());
  const referrerHost = parseHostname(input.referrer ?? "");
  const externalHost =
    referrerHost &&
    !isInternalReferrer(input.referrer ?? "")
      ? referrerHost
      : null;

  if (hasGclid) return "google / paid";
  if (hasFbclid) return "meta / paid";

  if (source === "google" && GOOGLE_PAID_MEDIUMS.has(medium)) {
    return "google / paid";
  }
  if (PAID_MEDIUMS.has(medium)) return "meta / paid";

  if (source === "instagram" && medium === "organic") {
    return "instagram / organic";
  }
  if ((source === "facebook" || source === "fb") && medium === "organic") {
    return "facebook / organic";
  }

  if (externalHost && isInstagramHost(externalHost)) {
    return "instagram / organic";
  }
  if (externalHost && isFacebookHost(externalHost)) {
    return "facebook / organic";
  }
  if (externalHost && !isGoogleHost(externalHost)) {
    return "referral";
  }

  return "direct";
}

function toSnapshot(stored: PersistedFirstTouch): StoredAcquisition {
  const params = pickParams(stored);
  return {
    landingPageUrl: stored.landingPageUrl,
    referrer: stored.referrer,
    acquisition: {
      ...params,
      acquisition_channel: deriveAcquisitionChannel({
        ...params,
        referrer: stored.referrer,
      }),
    },
  };
}

function readLocalStorage(): PersistedFirstTouch | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedFirstTouch;
    if (
      parsed?.v !== STORAGE_VERSION ||
      typeof parsed.capturedAt !== "number" ||
      typeof parsed.landingPageUrl !== "string"
    ) {
      return null;
    }
    if (Date.now() - parsed.capturedAt > FIRST_TOUCH_TTL_MS) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalStorage(value: PersistedFirstTouch): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Quota / private mode — memory fallback still holds first-touch.
  }
}

function getPersisted(): PersistedFirstTouch | null {
  const fromStorage = readLocalStorage();
  if (fromStorage) {
    memoryStore = fromStorage;
    return fromStorage;
  }
  if (
    memoryStore &&
    Date.now() - memoryStore.capturedAt <= FIRST_TOUCH_TTL_MS
  ) {
    return memoryStore;
  }
  return null;
}

function captureFromCurrentPage(): PersistedFirstTouch {
  const params = readAcquisitionParams();
  const landingPageUrl = window.location.href;
  const rawReferrer = document.referrer || "";
  const referrer = isInternalReferrer(rawReferrer) ? "" : rawReferrer;

  return {
    v: STORAGE_VERSION,
    capturedAt: Date.now(),
    landingPageUrl,
    referrer,
    ...params,
  };
}

/**
 * Persist first-touch acquisition if none is stored (or the 90-day window expired).
 * Never overwrites an unexpired first-touch — including a later UTM / click ID.
 */
export function captureFirstTouchAcquisition(): StoredAcquisition | null {
  if (!isBrowser()) return null;

  const existing = getPersisted();
  if (existing) return toSnapshot(existing);

  const captured = captureFromCurrentPage();
  memoryStore = captured;
  writeLocalStorage(captured);
  return toSnapshot(captured);
}

/**
 * Always returns the initial first-touch source.
 * Captures it on first call if nothing is stored yet.
 */
export function getStoredAcquisition(): StoredAcquisition {
  const captured = captureFirstTouchAcquisition();
  if (captured) return captured;

  return {
    landingPageUrl: "",
    referrer: "",
    acquisition: { acquisition_channel: "direct" },
  };
}
