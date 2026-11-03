/**
 * Expose consent + internal GTM signals via dataLayer.
 * Never include personal data, form answers, or health-related fields.
 */

export type CookieConsentDataLayerEvent = {
  event: "cookie_consent_update";
  marketingAllowed: boolean;
};

export type LeadCompletedDataLayerEvent = {
  event: "lead_completed";
};

export type WhatsappHeaderClickDataLayerEvent = {
  event: "whatsapp_header_click";
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function ensureDataLayer(): Array<Record<string, unknown>> {
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  return window.dataLayer;
}

/**
 * Push a consent update for GTM / sGTM (Stape).
 * Payload is intentionally limited to event + marketingAllowed.
 * Ensures window.dataLayer exists before pushing (GTM may load later).
 */
export function pushCookieConsentToDataLayer(marketingAllowed: boolean): void {
  if (typeof window === "undefined") return;

  const payload: CookieConsentDataLayerEvent = {
    event: "cookie_consent_update",
    marketingAllowed: Boolean(marketingAllowed),
  };
  ensureDataLayer().push(payload);
}

/**
 * Internal GTM signal after a successful /api/leads response.
 * Payload is only { event: "lead_completed" } — no PII / form / health data.
 */
export function pushLeadCompletedToDataLayer(): void {
  if (typeof window === "undefined") return;

  const payload: LeadCompletedDataLayerEvent = {
    event: "lead_completed",
  };
  ensureDataLayer().push(payload);
  console.log("[GTM DEBUG] lead_completed pushed");
}

/**
 * Header WhatsApp CTA click (Couverture Mutuelle LPs only — never IKI).
 * Payload is only { event: "whatsapp_header_click" } — no PII.
 */
export function pushWhatsappHeaderClickToDataLayer(): void {
  if (typeof window === "undefined") return;

  const payload: WhatsappHeaderClickDataLayerEvent = {
    event: "whatsapp_header_click",
  };
  ensureDataLayer().push(payload);
}
