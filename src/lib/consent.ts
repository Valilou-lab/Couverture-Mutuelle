/**
 * Single source of truth for the opt-in text shown in the form
 * and sent to Vertikl as consent proof.
 */

export const LANDING_PAGE_VERSION = "2026-08-17";
export const CONSENT_OPTIN_TEXT_VERSION = "2026-08-17.1";
/** @deprecated Use CONSENT_OPTIN_TEXT_VERSION */
export const CONSENT_TEXT_VERSION = CONSENT_OPTIN_TEXT_VERSION;
export const LEGAL_NOTICE_VERSION = "2026-08-17";

/** Stable campaign label for Vertikl consent_campaign. */
export const CONSENT_CAMPAIGN = "Couverture Mutuelle";

/** Exact opt-in sentence presented next to the consent checkbox. */
export const CONSENT_OPTIN_TEXT =
  "J’accepte d’être contacté(e) par téléphone, SMS, whatsapp et email par Couverture Mutuelle et ses partenaires afin de recevoir des offres de complémentaire santé.";

/** Supporting sentence under the opt-in (validity / withdrawal). */
export const CONSENT_VALIDITY_TEXT =
  "Mon consentement est accessible et valable 12 mois et peut être retiré à tout moment.";

/** Full text stored as Vertikl consent_optin_text. */
export const CONSENT_OPTIN_TEXT_FULL = `${CONSENT_OPTIN_TEXT} ${CONSENT_VALIDITY_TEXT}`;

/** Vertikl published channels only — WhatsApp is consent-whatsapp, not a channel. */
export const CONSENT_CHANNELS = ["telephone", "email", "sms"] as const;

export type ConsentChannel = (typeof CONSENT_CHANNELS)[number];

export const CONSENT_SOURCE = "couverture_mutuelle_landing";
export const CONSENT_STATUS_ACTIVE = "actif" as const;
