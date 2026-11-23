import { getStoredAcquisition, getCurrentConsentLandingPageUrl } from "@/lib/acquisition";
import type { QuoteFormData } from "@/components/form/types";
import type { ConsentVariantId } from "@/lib/consent";
import { pushLeadCompletedToDataLayer } from "@/lib/gtm-consent";
import {
  prepareMetaLeadTracking,
  trackMetaLeadPixel,
} from "@/lib/meta/pixel";
import type {
  V2LeadErrorResponse,
  V2LeadRequestBody,
  V2LeadSuccessResponse,
} from "@/lib/v2/lead-types";
import type { EligiblePartner } from "../v2Types";

/**
 * V2 lead adapter → `POST /api/v2/leads`
 * After OTP proof cookie is set (or landline skip), acquires the Vertikl lead.
 */

export type V2LeadClientResult = {
  ok: true;
  mode: "vertikl";
};

export class V2LeadClientError extends Error {
  /** Vertikl / API diagnostic — logs only, never show to the prospect. */
  readonly detail: string | null;

  constructor(message: string, detail: string | null = null) {
    super(message);
    this.name = "V2LeadClientError";
    this.detail = detail;
  }
}

/** Generic user-facing copy — never include Vertikl payload text. */
const SUBMIT_ERROR =
  "Impossible d’enregistrer le dossier pour le moment. Merci de réessayer.";

export async function submitV2Lead(input: {
  data: QuoteFormData;
  partners: EligiblePartner[];
  eligibilityToken: string;
  consentVariant?: ConsentVariantId;
}): Promise<V2LeadClientResult> {
  const stored = getStoredAcquisition();
  const metaTracking = prepareMetaLeadTracking();
  const consentVariant = input.consentVariant ?? "senior";

  const body: V2LeadRequestBody = {
    form: input.data,
    meta: {
      landingPageUrl: stored.landingPageUrl,
      consentLandingPageUrl: getCurrentConsentLandingPageUrl(),
      referrer: stored.referrer,
      acquisition: stored.acquisition,
    },
    eligibilityToken: input.eligibilityToken,
    displayedPartnerIds: input.partners.map((partner) => partner.id),
    // Standard V2: one broker-consent checkbox. IKI: second opt-in → partners CM.
    partnerConsentGiven:
      consentVariant === "iki"
        ? Boolean(input.data.partnerConsent)
        : Boolean(input.data.consent),
    consentVariant,
    metaTracking,
  };

  // credentials:include — send HttpOnly `cm_phone_verified` with the acquire call
  const response = await fetch("/api/v2/leads", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let payload: V2LeadSuccessResponse | V2LeadErrorResponse | null = null;
  try {
    payload = (await response.json()) as
      | V2LeadSuccessResponse
      | V2LeadErrorResponse;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload || payload.success !== true) {
    const errPayload =
      payload && "success" in payload && payload.success === false
        ? payload
        : null;
    const detail =
      errPayload && typeof errPayload.detail === "string"
        ? errPayload.detail
        : null;
    const code =
      errPayload && typeof errPayload.error === "string"
        ? errPayload.error
        : null;
    console.error("[v2/leads] acquire failed", {
      status: response.status,
      code,
      detail,
      payload: errPayload,
    });
    throw new V2LeadClientError(SUBMIT_ERROR, detail || code);
  }

  pushLeadCompletedToDataLayer();
  trackMetaLeadPixel(metaTracking);

  return { ok: true, mode: "vertikl" };
}

/** @deprecated Use submitV2Lead */
export const submitV2LeadScaffold = submitV2Lead;
