import { getStoredAcquisition } from "@/lib/acquisition";
import type { QuoteFormData } from "@/components/form/types";
import type { V2LeadRequestBody, V2LeadScaffoldResponse } from "@/lib/v2/lead-types";
import type { EligiblePartner } from "../v2Types";

/**
 * V2 lead adapter → `POST /api/v2/leads` (scaffold).
 *
 * Reuses Main acquisition first-touch via `getStoredAcquisition()`.
 * Does NOT call `/api/leads`, Vertikl, or Meta Lead/CAPI.
 *
 * Later wiring (same pattern as QuoteForm, on `/api/v2/leads`):
 * prepareMetaLeadTracking → POST with event_id → success → Pixel + lead_completed.
 */

export type V2LeadClientResult = {
  ok: true;
  mode: "scaffold";
};

export class V2LeadClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "V2LeadClientError";
  }
}

export async function submitV2LeadScaffold(input: {
  data: QuoteFormData;
  partners: EligiblePartner[];
  eligibilityToken: string;
}): Promise<V2LeadClientResult> {
  const stored = getStoredAcquisition();

  const body: V2LeadRequestBody = {
    form: input.data,
    meta: {
      landingPageUrl: stored.landingPageUrl,
      referrer: stored.referrer,
      acquisition: stored.acquisition,
    },
    eligibilityToken: input.eligibilityToken,
    displayedPartnerIds: input.partners.map((partner) => partner.id),
    partnerConsentGiven: Boolean(input.data.consent),
  };

  const response = await fetch("/api/v2/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let payload: V2LeadScaffoldResponse | { success?: false; error?: string } | null =
    null;
  try {
    payload = (await response.json()) as V2LeadScaffoldResponse;
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success !== true) {
    const message =
      payload && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Impossible d’enregistrer le dossier pour le moment.";
    throw new V2LeadClientError(message);
  }

  // Intentionally no prepareMetaLeadTracking / Pixel Lead / lead_completed here.
  return { ok: true, mode: "scaffold" };
}
