"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  buildConsentPreferences,
  DEFAULT_DENIED_CHOICE,
  getCookieConsentSnapshot,
  getServerCookieConsentSnapshot,
  hasMarketingConsent,
  subscribeCookieConsent,
  writeConsentToStorage,
  type CookieConsentChoice,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";
import { pushCookieConsentToDataLayer } from "@/lib/gtm-consent";

type CookieConsentContextValue = {
  /** null when the visitor has not chosen yet. */
  preferences: CookieConsentPreferences | null;
  hasChosen: boolean;
  marketingAllowed: boolean;
  bannerOpen: boolean;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  refuseOptional: () => void;
  saveChoice: (choice: CookieConsentChoice) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const preferences = useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getServerCookieConsentSnapshot,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const persist = useCallback((choice: CookieConsentChoice) => {
    const next = buildConsentPreferences(choice);
    writeConsentToStorage(next);
    setPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    persist({ preferences: true, analytics: true, marketing: true });
  }, [persist]);

  /** Refuse all optional cookies (marketing/analytics/preferences). */
  const refuseOptional = useCallback(() => {
    persist(DEFAULT_DENIED_CHOICE);
  }, [persist]);

  const saveChoice = useCallback(
    (choice: CookieConsentChoice) => {
      persist(choice);
    },
    [persist],
  );

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
  }, []);

  const hasChosen = preferences !== null;
  const bannerOpen = !hasChosen && !preferencesOpen;
  /** Explicit marketing opt-in only — refuse/close/unset => false. */
  const marketingAllowed = hasMarketingConsent(preferences);

  useEffect(() => {
    // Initial push on client mount + every later marketingAllowed change.
    // Payload: event + marketingAllowed only (no PII / form / health data).
    pushCookieConsentToDataLayer(marketingAllowed);
  }, [marketingAllowed]);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      preferences,
      hasChosen,
      marketingAllowed,
      bannerOpen,
      preferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      refuseOptional,
      saveChoice,
    }),
    [
      preferences,
      hasChosen,
      marketingAllowed,
      bannerOpen,
      preferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      refuseOptional,
      saveChoice,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
