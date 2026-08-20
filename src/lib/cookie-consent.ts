/**
 * Cookie consent preferences (first-party, necessary for remembering choice).
 * Marketing/advertising consent gates third-party pixels (e.g. Meta).
 */

export const COOKIE_CONSENT_STORAGE_KEY = "cm-cookie-consent-v1";
export const COOKIE_CONSENT_VERSION = 1;

export type CookieConsentPreferences = {
  version: typeof COOKIE_CONSENT_VERSION;
  /** Always true — required for site + storing this choice. */
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  /** Advertising / marketing — required before Meta Pixel loads. */
  marketing: boolean;
  updatedAt: string;
};

export type CookieConsentChoice = Omit<
  CookieConsentPreferences,
  "version" | "necessary" | "updatedAt"
>;

export const DEFAULT_DENIED_CHOICE: CookieConsentChoice = {
  preferences: false,
  analytics: false,
  marketing: false,
};

export function buildConsentPreferences(
  choice: CookieConsentChoice,
): CookieConsentPreferences {
  return {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    preferences: Boolean(choice.preferences),
    analytics: Boolean(choice.analytics),
    marketing: Boolean(choice.marketing),
    updatedAt: new Date().toISOString(),
  };
}

export function parseStoredConsent(
  raw: string | null,
): CookieConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    if (parsed.necessary !== true) return null;
    if (typeof parsed.marketing !== "boolean") return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.preferences !== "boolean") return null;
    if (typeof parsed.updatedAt !== "string") return null;
    return {
      version: COOKIE_CONSENT_VERSION,
      necessary: true,
      preferences: parsed.preferences,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

let cachedRaw: string | null | undefined;
let cachedPreferences: CookieConsentPreferences | null = null;
const consentListeners = new Set<() => void>();

function notifyConsentListeners() {
  consentListeners.forEach((listener) => listener());
}

export function subscribeCookieConsent(onStoreChange: () => void): () => void {
  consentListeners.add(onStoreChange);

  function onStorage(event: StorageEvent) {
    if (event.key !== COOKIE_CONSENT_STORAGE_KEY) return;
    // Invalidate cache so cross-tab updates are visible.
    cachedRaw = undefined;
    onStoreChange();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    consentListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/** Stable snapshot for useSyncExternalStore — same reference if unchanged. */
export function getCookieConsentSnapshot(): CookieConsentPreferences | null {
  return readConsentFromStorage();
}

export function getServerCookieConsentSnapshot(): CookieConsentPreferences | null {
  return null;
}

export function readConsentFromStorage(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedPreferences;
    }
    cachedRaw = raw;
    cachedPreferences = parseStoredConsent(raw);
    return cachedPreferences;
  } catch {
    cachedRaw = undefined;
    cachedPreferences = null;
    return null;
  }
}

export function writeConsentToStorage(
  preferences: CookieConsentPreferences,
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(preferences);
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedPreferences = preferences;
    // Defer notifications so React never sees a store update mid-render.
    queueMicrotask(notifyConsentListeners);
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function hasMarketingConsent(
  preferences: CookieConsentPreferences | null | undefined,
): boolean {
  return preferences?.marketing === true;
}
