/**
 * Expose marketing cookie consent to GTM via dataLayer.
 * Never include personal data, form answers, or health-related fields.
 */

export type CookieConsentDataLayerEvent = {
  event: "cookie_consent_update";
  marketingAllowed: boolean;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Push a consent update for GTM / sGTM (Stape).
 * Payload is intentionally limited to event + marketingAllowed.
 */
export function pushCookieConsentToDataLayer(marketingAllowed: boolean): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  const payload: CookieConsentDataLayerEvent = {
    event: "cookie_consent_update",
    marketingAllowed: Boolean(marketingAllowed),
  };
  window.dataLayer.push(payload);
}
