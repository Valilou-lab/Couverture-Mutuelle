import type { QuoteFormData } from "@/components/form/types";
import type { MetaLeadTracking } from "@/lib/meta/events";
import type { AcquisitionParams } from "@/lib/vertikl/types";
import type { V2ConsentRecord } from "./consent";

/**
 * Client → `POST /api/v2/leads` body.
 * Mirrors Main acquisition/meta shape so the route can reuse
 * `buildVertiklFields` / Meta / Twilio proof without changing `/api/leads`.
 */
export type V2LeadRequestBody = {
  form: Partial<QuoteFormData>;
  /** First-touch acquisition from `getStoredAcquisition()` — never re-derived. */
  meta: {
    landingPageUrl: string;
    consentLandingPageUrl?: string;
    referrer: string;
    acquisition: AcquisitionParams;
  };
  /** Opaque proof from `/api/v2/eligibility`. */
  eligibilityToken: string;
  /**
   * Partner ids the UI showed. Server ignores inventable names and re-resolves
   * from the token + allowlist registry.
   */
  displayedPartnerIds: string[];
  /** Checkbox must be true; text is rebuilt server-side. */
  partnerConsentGiven: boolean;
  /** Shared Pixel/CAPI event_id (optional). */
  metaTracking?: MetaLeadTracking;
};

export type V2LeadSuccessResponse = {
  success: true;
  mode: "vertikl";
  consent: V2ConsentRecord;
};

export type V2LeadErrorResponse = {
  success: false;
  error: string;
  code?:
    | "INVALID_BODY"
    | "CONSENT_REQUIRED"
    | "ELIGIBILITY_TOKEN_INVALID"
    | "ELIGIBILITY_TOKEN_EXPIRED"
    | "PARTNERS_MISMATCH"
    | "PHONE_NOT_VERIFIED"
    | "VALIDATION_FAILED"
    | "MAPPING_FAILED"
    | "SERVER_MISCONFIGURED"
    | "LEAD_SUBMISSION_FAILED";
  /** Vertikl failureMessage / HTTP diagnostic when available. */
  detail?: string;
  httpStatus?: number | null;
};

/** @deprecated Use V2LeadSuccessResponse — kept for older clients during deploy. */
export type V2LeadScaffoldResponse = V2LeadSuccessResponse;
