import { NextResponse } from "next/server";
import { buildV2ConsentRecord } from "@/lib/v2/consent";
import { verifyV2EligibilityToken } from "@/lib/v2/eligibility-token";
import type {
  V2LeadErrorResponse,
  V2LeadRequestBody,
  V2LeadScaffoldResponse,
} from "@/lib/v2/lead-types";
import { resolveV2PartnersFromIds } from "@/lib/v2/partners-registry";

/**
 * V2 lead endpoint (scaffold).
 *
 * Will later reuse Main server libs (Vertikl normalize/build/campaigns,
 * Meta CAPI, Twilio proof, IP, server consent clock) WITHOUT modifying
 * `/api/leads`.
 *
 * For now: validates eligibility token + partner allowlist, rebuilds consent
 * server-side, returns success — no Vertikl, no Meta Lead, no Twilio.
 */
export async function POST(request: Request) {
  let body: V2LeadRequestBody;
  try {
    body = (await request.json()) as V2LeadRequestBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Corps de requête invalide.",
        code: "INVALID_BODY",
      } satisfies V2LeadErrorResponse,
      { status: 400 },
    );
  }

  if (!body?.form || !body.meta || !body.eligibilityToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Champs obligatoires manquants.",
        code: "INVALID_BODY",
      } satisfies V2LeadErrorResponse,
      { status: 400 },
    );
  }

  if (!body.partnerConsentGiven) {
    return NextResponse.json(
      {
        success: false,
        error: "Le consentement partenaires est requis.",
        code: "CONSENT_REQUIRED",
      } satisfies V2LeadErrorResponse,
      { status: 400 },
    );
  }

  const tokenResult = verifyV2EligibilityToken(body.eligibilityToken);
  if (!tokenResult.ok) {
    return NextResponse.json(
      {
        success: false,
        error:
          tokenResult.reason === "expired"
            ? "La vérification des offres a expiré. Relancez la recherche."
            : "Preuve d’éligibilité invalide.",
        code:
          tokenResult.reason === "expired"
            ? "ELIGIBILITY_TOKEN_EXPIRED"
            : "ELIGIBILITY_TOKEN_INVALID",
      } satisfies V2LeadErrorResponse,
      { status: 400 },
    );
  }

  const partners = resolveV2PartnersFromIds(tokenResult.payload.partnerIds);
  if (partners.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Aucun partenaire allowlisté pour ce dossier.",
        code: "PARTNERS_MISMATCH",
      } satisfies V2LeadErrorResponse,
      { status: 400 },
    );
  }

  // Optional sanity check: displayed ids must be a subset of token partners.
  const tokenIdSet = new Set<string>(tokenResult.payload.partnerIds);
  const displayed = Array.isArray(body.displayedPartnerIds)
    ? body.displayedPartnerIds.filter((id): id is string => typeof id === "string")
    : [];
  if (displayed.some((id) => !tokenIdSet.has(id))) {
    return NextResponse.json(
      {
        success: false,
        error: "La liste des partenaires ne correspond pas à l’éligibilité.",
        code: "PARTNERS_MISMATCH",
      } satisfies V2LeadErrorResponse,
      { status: 400 },
    );
  }

  // Acquisition / IP / Vertikl / Meta / Twilio: intentionally not wired yet.
  // Future: getStoredAcquisition shape is already in body.meta for campaign routing.
  void body.meta;
  void body.form;

  const consentAt = new Date();
  const consent = buildV2ConsentRecord(partners, consentAt.toISOString());

  const response: V2LeadScaffoldResponse = {
    success: true,
    mode: "scaffold",
    consent,
  };

  return NextResponse.json(response);
}
