export type VertiklHealthScheme =
  | "regime_general"
  | "travailleur_non_salarie"
  | "regime_agricole"
  | "alsace_moselle";

export type VertiklPeopleToCover =
  | "moi"
  | "moi_enfants"
  | "moi_conjoint"
  | "moi_conjoint_enfants";

export type VertiklPriorityCare =
  | "hospitalisation"
  | "optique"
  | "dentaire"
  | "audition"
  | "medecines_douces"
  | "soins_courants"
  | "je_ne_sais_pas";

/** Vertikl ENUM for mutual tenure (`time-insured`). */
export type VertiklTimeInsured =
  | "moinsde2ans"
  | "entre2et5ans"
  | "plusde5ans";

export type VertiklConsentChannel =
  | "telephone"
  | "email"
  | "sms"
  | "appel_automatise";

export type VertiklLeadFields = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  partner_date_of_birth?: string;
  postal_code: string;
  city?: string;
  health_scheme: VertiklHealthScheme;
  currently_insured: boolean;
  people_to_cover: VertiklPeopleToCover;
  priority_care: VertiklPriorityCare[];
  /** Vertikl field name uses a hyphen. */
  "consent-whatsapp": boolean;
  consent_given: boolean;
  consent_campaign: string;
  consent_datetime: string;
  consent_expiration_date: string;
  consent_channels: VertiklConsentChannel[];
  consent_ip_address?: string;
  consent_landing_page_url?: string;
  consent_landing_page_version: string;
  consent_optin_text: string;
  consent_optin_text_version: string;
  consent_legal_notice_version: string;
  consent_referrer?: string;
  consent_user_agent?: string;
  consent_source: string;
  consent_status: "actif" | "retire" | "expire";
  /** Optional — savings calculator only. */
  health_insurance_budget?: number;
  /** Optional — savings calculator only. Vertikl field name uses a hyphen. */
  "time-insured"?: VertiklTimeInsured;
};

export type VertiklLeadPayload = {
  campaignId: string;
  fields: VertiklLeadFields;
};

export type VertiklTestResponse = {
  success: boolean;
  fields?: Record<string, unknown> | null;
  failureMessage?: string | null;
  suspiciousDetection?: unknown;
};

export type SendLeadResult =
  | {
      ok: true;
      httpStatus: number;
      failureMessage: null;
      returnedFieldNames: string[];
      consentWhatsappReturned: boolean | null;
    }
  | {
      ok: false;
      httpStatus: number | null;
      failureMessage: string;
      returnedFieldNames: string[];
      consentWhatsappReturned: boolean | null;
    };

export const ACQUISITION_CHANNELS = [
  "meta / paid",
  "google / paid",
  "instagram / organic",
  "facebook / organic",
  "referral",
  "direct",
] as const;

export type AcquisitionChannel = (typeof ACQUISITION_CHANNELS)[number];

export function isAcquisitionChannel(
  value: unknown,
): value is AcquisitionChannel {
  return (
    typeof value === "string" &&
    (ACQUISITION_CHANNELS as readonly string[]).includes(value)
  );
}

/** Acquisition params captured client-side for a future Vertikl mapping. */
export type AcquisitionParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  acquisition_channel?: AcquisitionChannel;
};

/** Optional calculator-only fields (never sent to GTM / dataLayer). */
export type LeadCalculatorMeta = {
  currentMonthlyPremium?: number;
  insurerTenure?: "moins-2-ans" | "2-5-ans" | "plus-5-ans";
};

export type LeadSubmissionMeta = {
  landingPageUrl?: string;
  referrer?: string;
  acquisition?: AcquisitionParams;
  calculator?: LeadCalculatorMeta;
};
