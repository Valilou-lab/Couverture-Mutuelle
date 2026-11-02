import type { QuoteFormData } from "@/components/form/types";
import type { AcquisitionParams } from "@/lib/vertikl/types";
import type { V2ConsentRecord } from "./consent";

/**
 * Client → `POST /api/v2/leads` body (scaffold contract).
 * Mirrors Main's acquisition/meta shape so the future route can reuse
 * `buildVertiklFields` / Meta / campaign libs without changing `/api/leads`.
 */
export type V2LeadRequestBody = {
  form: Partial<QuoteFormData>;
  /** First-touch acquisition from `getStoredAcquisition()` — never re-derived. */
  meta: {
    landingPageUrl: string;
    referrer: string;
    acquisition: AcquisitionParams;
  };
  /** Opaque proof from `/api/v2/eligibility` (signed later). */
  eligibilityToken: string;
  /**
   * Partner ids the UI showed. Server ignores inventable names and re-resolves
   * from the token + allowlist registry.
   */
  displayedPartnerIds: string[];
  /** Checkbox must be true; text is rebuilt server-side. */
  partnerConsentGiven: boolean;
};

export type V2LeadScaffoldResponse = {
  success: true;
  mode: "scaffold";
  /** Server-authoritative consent snapshot (no Vertikl / CAPI yet). */
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
    | "SCAFFOLD_ONLY";
};
