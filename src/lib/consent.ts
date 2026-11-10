/**
 * Single source of truth for the opt-in text shown in the form
 * and sent to Vertikl as consent proof.
 */

export const LANDING_PAGE_VERSION = "2026-08-17";
export const CONSENT_OPTIN_TEXT_VERSION = "2026-08-27.1";
/** @deprecated Use CONSENT_OPTIN_TEXT_VERSION */
export const CONSENT_TEXT_VERSION = CONSENT_OPTIN_TEXT_VERSION;
export const LEGAL_NOTICE_VERSION = "2026-08-17";

/** Stable campaign label for Vertikl consent_campaign. */
export const CONSENT_CAMPAIGN = "Couverture Mutuelle";

/** Exact opt-in sentence presented next to the consent checkbox. */
export const CONSENT_OPTIN_TEXT =
  "J’accepte d’être contacté(e) par téléphone, SMS, whatsapp et email dans les 2 heures suivant ma demande, de 8h à 20h du lundi au samedi par Couverture Mutuelle et ses partenaires afin de recevoir mes offres de complémentaire santé.";

/** Supporting sentence under the opt-in (validity / withdrawal). */
export const CONSENT_VALIDITY_TEXT =
  "Mon consentement est accessible et valable 12 mois et peut être retiré à tout moment.";

/** Full text stored as Vertikl consent_optin_text. */
export const CONSENT_OPTIN_TEXT_FULL = `${CONSENT_OPTIN_TEXT} ${CONSENT_VALIDITY_TEXT}`;

/** Vertikl published channels only — WhatsApp is consent_whatsapp, not a channel. */
export const CONSENT_CHANNELS = ["telephone", "email", "sms"] as const;

export type ConsentChannel = (typeof CONSENT_CHANNELS)[number];

export const CONSENT_SOURCE = "couverture_mutuelle_landing";
export const CONSENT_STATUS_ACTIVE = "actif" as const;

/**
 * Consent variants. Each variant = exact text displayed next to the checkbox
 * (stored as Vertikl consent_optin_text), its version id and the channels
 * actually collected. The server picks the variant from this allowlist; the
 * client only sends the variant id, never free text.
 */
export const SENIOR_CONSENT_OPTIN_TEXT_VERSION = "2026-10-12.senior.1";

/** Visible label of the senior form checkbox ("ses partenaires" is a link). */
export const SENIOR_CONSENT_OPTIN_TEXT =
  "J'accepte d'être contacté(e) par téléphone et e-mail par Couverture Mutuelle et ses partenaires pour recevoir mes offres.";

/** Small muted line displayed under the senior checkbox. */
export const SENIOR_CONSENT_VALIDITY_TEXT =
  "Consentement valable 12 mois, retirable à tout moment.";

/** Full text stored as Vertikl consent_optin_text for the senior form. */
export const SENIOR_CONSENT_OPTIN_TEXT_FULL = `${SENIOR_CONSENT_OPTIN_TEXT} ${SENIOR_CONSENT_VALIDITY_TEXT} Politique de confidentialité.`;

export const SENIOR_CONSENT_CHANNELS = ["telephone", "email"] as const;

/** IKI LP (/iki) — dual independent opt-ins. */
export const IKI_CONSENT_OPTIN_TEXT_VERSION = "2026-11-02.iki.1";
export const IKI_CONSENT_OPTIN_TEXT_VERSION_WITH_PARTNERS =
  "2026-11-10.iki.partners.2";

export const IKI_CONSENT_OPTIN_TEXT =
  "J'accepte d'être contacté(e) par téléphone et e-mail par IKI Assurance pour recevoir une proposition de complémentaire santé adaptée à mes besoins.";

export const IKI_PARTNER_CONSENT_OPTIN_TEXT =
  "Je souhaite comparer jusqu’à 3 offres et j’accepte d’être contacté(e) par les partenaires sélectionnés pour ma demande.";

export const IKI_CONSENT_VALIDITY_TEXT =
  "Consentements facultatifs, indépendants et révocables. Durée de validité : 12 mois maximum pour le démarchage téléphonique.";

export const IKI_PRIVACY_POLICY_URL =
  "https://iki-assurances.fr/politique-de-protection-des-donnees";

export const IKI_PRIVACY_POLICY_LABEL = "Protection des données IKI";

export const IKI_CONSENT_CHANNELS = ["telephone", "email"] as const;

/** Full Vertikl proof when only the IKI checkbox is checked. */
export const IKI_CONSENT_OPTIN_TEXT_FULL = `${IKI_CONSENT_OPTIN_TEXT} ${IKI_CONSENT_VALIDITY_TEXT} ${IKI_PRIVACY_POLICY_LABEL}.`;

/** Full Vertikl proof when both IKI + partenaires checkboxes are checked. */
export const IKI_CONSENT_OPTIN_TEXT_FULL_WITH_PARTNERS = `${IKI_CONSENT_OPTIN_TEXT} ${IKI_PARTNER_CONSENT_OPTIN_TEXT} ${IKI_CONSENT_VALIDITY_TEXT} ${IKI_PRIVACY_POLICY_LABEL}.`;

export function buildIkiConsentOptinText(partnerConsent: boolean): {
  optinText: string;
  optinTextVersion: string;
} {
  if (partnerConsent) {
    return {
      optinText: IKI_CONSENT_OPTIN_TEXT_FULL_WITH_PARTNERS,
      optinTextVersion: IKI_CONSENT_OPTIN_TEXT_VERSION_WITH_PARTNERS,
    };
  }
  return {
    optinText: IKI_CONSENT_OPTIN_TEXT_FULL,
    optinTextVersion: IKI_CONSENT_OPTIN_TEXT_VERSION,
  };
}

export type ConsentVariantId = "default" | "senior" | "iki";

export type ConsentVariant = {
  optinText: string;
  optinTextVersion: string;
  channels: readonly ConsentChannel[];
  /** WhatsApp checkbox shown (consent_whatsapp can be true). */
  whatsapp: boolean;
};

export const CONSENT_VARIANTS: Record<ConsentVariantId, ConsentVariant> = {
  default: {
    optinText: CONSENT_OPTIN_TEXT_FULL,
    optinTextVersion: CONSENT_OPTIN_TEXT_VERSION,
    channels: CONSENT_CHANNELS,
    whatsapp: true,
  },
  senior: {
    optinText: SENIOR_CONSENT_OPTIN_TEXT_FULL,
    optinTextVersion: SENIOR_CONSENT_OPTIN_TEXT_VERSION,
    channels: SENIOR_CONSENT_CHANNELS,
    whatsapp: false,
  },
  iki: {
    optinText: IKI_CONSENT_OPTIN_TEXT_FULL,
    optinTextVersion: IKI_CONSENT_OPTIN_TEXT_VERSION,
    channels: IKI_CONSENT_CHANNELS,
    whatsapp: false,
  },
};

/** Allowlist lookup: anything unknown falls back to the default variant. */
export function resolveConsentVariantId(value: unknown): ConsentVariantId {
  if (value === "senior" || value === "iki") return value;
  return "default";
}
