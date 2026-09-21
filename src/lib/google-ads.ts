/**
 * Google Ads tag (AW-18465010704) + Consent Mode v2 helpers.
 * Consent defaults to denied until the existing cookie banner records a choice.
 * Do not also add this Google Tag inside GTM — it is installed once in app code.
 */

import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

export const GOOGLE_ADS_ID = "AW-18465010704";

export type GoogleConsentValue = "granted" | "denied";

export type GoogleConsentModeState = {
  ad_storage: GoogleConsentValue;
  analytics_storage: GoogleConsentValue;
  ad_user_data: GoogleConsentValue;
  ad_personalization: GoogleConsentValue;
};

export const GOOGLE_CONSENT_DENIED: GoogleConsentModeState = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __cmGoogleAdsTagLoaded?: boolean;
  }
}

function asConsentValue(allowed: boolean): GoogleConsentValue {
  return allowed ? "granted" : "denied";
}

/**
 * Map the existing banner categories to Consent Mode v2.
 * Publicité / marketing → ad_storage, ad_user_data, ad_personalization.
 * Mesure d’audience → analytics_storage.
 * No choice yet (null) stays fully denied.
 */
export function googleConsentFromPreferences(
  preferences: CookieConsentPreferences | null | undefined,
): GoogleConsentModeState {
  const advertising = preferences?.marketing === true;
  const analytics = preferences?.analytics === true;
  return {
    ad_storage: asConsentValue(advertising),
    analytics_storage: asConsentValue(analytics),
    ad_user_data: asConsentValue(advertising),
    ad_personalization: asConsentValue(advertising),
  };
}

/**
 * Official gtag signature: dataLayer.push(arguments), not a plain array.
 * A real Array is ignored or misread by gtag.js / Consent Mode.
 */
export function ensureGtag(): NonNullable<Window["gtag"]> {
  if (typeof window.gtag === "function") {
    return window.gtag;
  }
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments as unknown as Record<string, unknown>);
  }
  window.gtag = gtag;
  return gtag;
}

/** Live update after Tout accepter / Tout refuser / Enregistrer mes choix. */
export function updateGoogleConsentMode(
  preferences: CookieConsentPreferences | null | undefined,
): void {
  if (typeof window === "undefined") return;
  ensureGtag()("consent", "update", googleConsentFromPreferences(preferences));
}

/**
 * Runs in the document head, before GTM and gtag.js.
 * Restores a stored choice immediately so returning visitors are not stuck on denied.
 */
export const GOOGLE_CONSENT_DEFAULT_SCRIPT = `(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
  try {
    var raw = localStorage.getItem(${JSON.stringify(COOKIE_CONSENT_STORAGE_KEY)});
    if (!raw) return;
    var parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.version !== ${COOKIE_CONSENT_VERSION} ||
      typeof parsed.marketing !== 'boolean' ||
      typeof parsed.analytics !== 'boolean'
    ) return;
    gtag('consent', 'update', {
      ad_storage: parsed.marketing ? 'granted' : 'denied',
      analytics_storage: parsed.analytics ? 'granted' : 'denied',
      ad_user_data: parsed.marketing ? 'granted' : 'denied',
      ad_personalization: parsed.marketing ? 'granted' : 'denied'
    });
  } catch (e) {}
})();`;

export const GOOGLE_ADS_CONFIG_SCRIPT = `(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  if (window.__cmGoogleAdsTagLoaded) return;
  window.__cmGoogleAdsTagLoaded = true;
  gtag('js', new Date());
  gtag('config', '${GOOGLE_ADS_ID}');
})();`;
