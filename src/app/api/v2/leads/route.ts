import { after, NextRequest, NextResponse } from "next/server";
import {
  deriveAlreadyInsured,
  initialFormData,
  isCurrentMutualTariffId,
  isHealthInsuranceGoalId,
  isProfessionalStatusId,
  type QuoteFormData,
} from "@/components/form/types";
import {
  validateStep,
  type FieldErrors,
} from "@/components/form/validation";
import { isHiddenFormStep } from "@/components/form/formConfig";
import {
  buildLeadUserData,
  isMetaCapiConfigured,
  metaContextFromRequest,
  nowInSeconds,
  sendMetaEvents,
} from "@/lib/meta/capi";
import { isValidMetaEventId, type MetaLeadTracking } from "@/lib/meta/events";
import {
  PHONE_VERIFY_COOKIE,
  clearPhoneVerifyCookie,
  verifyPhoneProofToken,
} from "@/lib/phone-verify-proof";
import {
  buildV2ConsentRecord,
  buildV2PartnerConsentText,
  V2_PARTNER_CONSENT_VERSION,
} from "@/lib/v2/consent";
import { verifyV2EligibilityToken } from "@/lib/v2/eligibility-token";
import type {
  V2LeadErrorResponse,
  V2LeadRequestBody,
  V2LeadSuccessResponse,
} from "@/lib/v2/lead-types";
import { resolveV2PartnersFromIds } from "@/lib/v2/partners-registry";
import { buildVertiklFields } from "@/lib/vertikl/build-payload";
import { sendLeadToVertikl } from "@/lib/vertikl/client";
import { VertiklMappingError } from "@/lib/vertikl/mappers";
import {
  formatVertiklDateTime,
  requiresSmsPhoneVerification,
} from "@/lib/vertikl/normalize";
import { V2_VERTIKL_CAMPAIGN_ID } from "@/lib/vertikl/precheck";
import {
  isAcquisitionChannel,
  type AcquisitionParams,
  type LeadSubmissionMeta,
} from "@/lib/vertikl/types";

export const runtime = "nodejs";

const V2_VALIDATION_STEPS = [
  "currentMutualTariff",
  "coveredPersons",
  "professionalStatus",
  "birthAndPostal",
  "contact",
] as const;

function failure(status: number, error: string, code?: V2LeadErrorResponse["code"]) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(code ? { code } : {}),
    } satisfies V2LeadErrorResponse,
    { status },
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const first = vercelIp.split(",")[0]?.trim();
    if (first) return first;
  }
  return undefined;
}

function sanitizeAcquisition(raw: unknown): AcquisitionParams | undefined {
  if (!isPlainObject(raw)) return undefined;
  const out: AcquisitionParams = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
  ] as const) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, 500);
    }
  }
  if (
    typeof raw.acquisition_channel === "string" &&
    isAcquisitionChannel(raw.acquisition_channel)
  ) {
    out.acquisition_channel = raw.acquisition_channel;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function sanitizeMetaLeadTracking(raw: unknown): MetaLeadTracking | null {
  if (!isPlainObject(raw)) return null;
  if (!isValidMetaEventId(raw.eventId)) return null;
  if (typeof raw.marketingConsent !== "boolean") return null;
  if (typeof raw.eventSourceUrl !== "string") return null;
  return {
    eventId: raw.eventId,
    marketingConsent: raw.marketingConsent,
    eventSourceUrl: raw.eventSourceUrl.slice(0, 2000),
  };
}

function parseForm(raw: unknown): QuoteFormData | null {
  if (!isPlainObject(raw)) return null;

  const currentMutualTariff =
    typeof raw.currentMutualTariff === "string" &&
    isCurrentMutualTariffId(raw.currentMutualTariff)
      ? raw.currentMutualTariff
      : "";
  const healthInsuranceGoal =
    typeof raw.healthInsuranceGoal === "string" &&
    isHealthInsuranceGoalId(raw.healthInsuranceGoal)
      ? raw.healthInsuranceGoal
      : "";
  const derivedInsured = deriveAlreadyInsured(currentMutualTariff);
  const explicitInsured =
    raw.alreadyInsured === "oui" || raw.alreadyInsured === "non"
      ? raw.alreadyInsured
      : "";
  const alreadyInsured = explicitInsured || derivedInsured;

  return {
    ...initialFormData,
    careNeeds: Array.isArray(raw.careNeeds)
      ? (raw.careNeeds.filter(
          (item) => typeof item === "string",
        ) as QuoteFormData["careNeeds"])
      : [],
    coveredPersons:
      typeof raw.coveredPersons === "string"
        ? (raw.coveredPersons as QuoteFormData["coveredPersons"])
        : "",
    spouseBirthDate:
      typeof raw.spouseBirthDate === "string" ? raw.spouseBirthDate : "",
    birthDate: typeof raw.birthDate === "string" ? raw.birthDate : "",
    familyStatus: "",
    postalCode: typeof raw.postalCode === "string" ? raw.postalCode : "",
    city: typeof raw.city === "string" ? raw.city : "",
    citiesOptions: [],
    professionalStatus:
      typeof raw.professionalStatus === "string" &&
      isProfessionalStatusId(raw.professionalStatus)
        ? raw.professionalStatus
        : "",
    currentMutualTariff,
    healthInsuranceGoal,
    alreadyInsured,
    insurer: "",
    civility:
      raw.civility === "mme" || raw.civility === "m" ? raw.civility : "",
    firstName: typeof raw.firstName === "string" ? raw.firstName : "",
    lastName: typeof raw.lastName === "string" ? raw.lastName : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    email: typeof raw.email === "string" ? raw.email : "",
    whatsappAvailable: Boolean(raw.whatsappAvailable),
    consent: Boolean(raw.consent),
    partnerConsent: Boolean(raw.partnerConsent),
  };
}

function validateV2LeadForm(form: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  for (const step of V2_VALIDATION_STEPS) {
    if (isHiddenFormStep(step)) continue;
    Object.assign(
      errors,
      validateStep(step, form, {
        // Name/email already collected earlier on /devis.
        contactPhoneOnly: step === "contact",
      }),
    );
  }
  if (!form.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!form.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!form.email.trim()) errors.email = "Indiquez votre e-mail.";
  if (!form.consent) {
    errors.consent = "Le consentement est nécessaire pour être contacté(e).";
  }
  return errors;
}

function scheduleMetaLead(
  request: Request,
  form: QuoteFormData,
  meta: LeadSubmissionMeta,
  rawTracking: unknown,
): void {
  try {
    if (!isMetaCapiConfigured()) return;
    const tracking = sanitizeMetaLeadTracking(rawTracking);
    if (!tracking) return;

    const context = metaContextFromRequest(request, meta.acquisition?.fbclid);
    const event = {
      event_name: "Lead" as const,
      event_time: nowInSeconds(),
      event_id: tracking.eventId,
      ...(tracking.eventSourceUrl
        ? { event_source_url: tracking.eventSourceUrl }
        : {}),
      action_source: "website" as const,
      user_data: buildLeadUserData(context, {
        email: form.email,
        phone: form.phone,
        firstName: form.firstName,
        lastName: form.lastName,
        postalCode: form.postalCode,
        city: form.city,
      }),
    };
    after(() => sendMetaEvents([event]));
  } catch {
    console.error("[api/v2/leads] meta capi scheduling failed");
  }
}

/**
 * V2 final acquire for `/devis`.
 * Front → OTP Twilio proof → this route → Vertikl POST /api/leads
 * with precheck_id + consent.{buyer_ids, collected_at} from the eligibility reservation.
 */
export async function POST(request: NextRequest) {
  if (!process.env.VERTIKL_API_KEY?.trim()) {
    console.error("[api/v2/leads] VERTIKL_API_KEY missing");
    return failure(500, "SERVER_MISCONFIGURED", "SERVER_MISCONFIGURED");
  }

  let body: V2LeadRequestBody;
  try {
    body = (await request.json()) as V2LeadRequestBody;
  } catch {
    return failure(400, "Corps de requête invalide.", "INVALID_BODY");
  }

  if (!body?.form || !body.meta || !body.eligibilityToken) {
    return failure(400, "Champs obligatoires manquants.", "INVALID_BODY");
  }

  if (!body.partnerConsentGiven) {
    return failure(
      400,
      "Le consentement partenaires est requis.",
      "CONSENT_REQUIRED",
    );
  }

  const form = parseForm(body.form);
  if (!form) {
    return failure(400, "Formulaire invalide.", "INVALID_BODY");
  }

  if (form.consent !== true) {
    return failure(400, "Le consentement est requis.", "CONSENT_REQUIRED");
  }

  // Twilio Verify proof — required for 06/07 only.
  if (requiresSmsPhoneVerification(form.phone)) {
    const phoneProof = request.cookies.get(PHONE_VERIFY_COOKIE)?.value;
    if (!verifyPhoneProofToken(phoneProof, form.phone)) {
      console.info("[api/v2/leads] phone not verified");
      return failure(403, "PHONE_NOT_VERIFIED", "PHONE_NOT_VERIFIED");
    }
  }

  const tokenResult = verifyV2EligibilityToken(body.eligibilityToken);
  if (!tokenResult.ok) {
    return failure(
      400,
      tokenResult.reason === "expired"
        ? "La vérification des offres a expiré. Relancez la recherche."
        : "Preuve d’éligibilité invalide.",
      tokenResult.reason === "expired"
        ? "ELIGIBILITY_TOKEN_EXPIRED"
        : "ELIGIBILITY_TOKEN_INVALID",
    );
  }

  const partners = resolveV2PartnersFromIds(tokenResult.payload.partnerIds);
  if (partners.length === 0) {
    return failure(
      400,
      "Aucun partenaire allowlisté pour ce dossier.",
      "PARTNERS_MISMATCH",
    );
  }

  const tokenIdSet = new Set<string>([
    ...tokenResult.payload.partnerIds,
    ...tokenResult.payload.buyerIds,
  ]);
  const displayed = Array.isArray(body.displayedPartnerIds)
    ? body.displayedPartnerIds.filter(
        (id): id is string => typeof id === "string",
      )
    : [];
  if (displayed.some((id) => !tokenIdSet.has(id))) {
    return failure(
      400,
      "La liste des partenaires ne correspond pas à l’éligibilité.",
      "PARTNERS_MISMATCH",
    );
  }

  const validationErrors = validateV2LeadForm(form);
  if (Object.keys(validationErrors).length > 0) {
    console.info("[api/v2/leads] validation failed", {
      fields: Object.keys(validationErrors),
    });
    return failure(400, "VALIDATION_FAILED", "VALIDATION_FAILED");
  }

  const meta: LeadSubmissionMeta = {
    landingPageUrl:
      typeof body.meta.landingPageUrl === "string"
        ? body.meta.landingPageUrl.slice(0, 2000)
        : undefined,
    consentLandingPageUrl:
      typeof body.meta.consentLandingPageUrl === "string"
        ? body.meta.consentLandingPageUrl.slice(0, 2000)
        : undefined,
    referrer:
      typeof body.meta.referrer === "string"
        ? body.meta.referrer.slice(0, 2000)
        : undefined,
    acquisition: sanitizeAcquisition(body.meta.acquisition),
  };

  // Single consent clock for fields.consent_datetime + consent.collected_at.
  const consentAt = new Date();
  const consentCollectedAt = `${formatVertiklDateTime(consentAt)}Z`;
  const consentText = buildV2PartnerConsentText(partners);
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent")?.trim() || undefined;

  let fields;
  try {
    fields = buildVertiklFields({
      form,
      meta,
      consentAt,
      consentOptinOverride: {
        optinText: consentText,
        optinTextVersion: V2_PARTNER_CONSENT_VERSION,
      },
      ipAddress,
      userAgent,
    });
  } catch (error) {
    if (error instanceof VertiklMappingError) {
      console.error("[api/v2/leads] mapping error", error.message);
      return failure(400, "MAPPING_FAILED", "MAPPING_FAILED");
    }
    console.error("[api/v2/leads] unexpected mapping failure");
    return failure(500, "LEAD_SUBMISSION_FAILED", "LEAD_SUBMISSION_FAILED");
  }

  scheduleMetaLead(request, form, meta, body.metaTracking);

  console.info("[api/v2/leads] acquire payload shape", {
    campaignId: V2_VERTIKL_CAMPAIGN_ID,
    precheckId: tokenResult.payload.precheckId,
    expiresAt: tokenResult.payload.expiresAt,
    consentBuyerIds: tokenResult.payload.buyerIds,
    consentCollectedAt,
    hasConsentProofRef: false,
    fieldKeys: Object.keys(fields).sort(),
  });

  const result = await sendLeadToVertikl(fields, V2_VERTIKL_CAMPAIGN_ID, {
    precheckId: tokenResult.payload.precheckId,
    buyerIds: tokenResult.payload.buyerIds,
    consentCollectedAt,
    // proof_ref omitted until we have a Vertikl-approved internal reference.
  });

  console.info("[api/v2/leads] vertikl result", {
    ok: result.ok,
    httpStatus: result.httpStatus,
    failureMessage: result.failureMessage,
    campaignId: V2_VERTIKL_CAMPAIGN_ID,
    precheckId: tokenResult.payload.precheckId,
    consentBuyerIds: tokenResult.payload.buyerIds,
  });

  if (!result.ok) {
    // Surface Vertikl's diagnostic (masked from PII) so Network tab / UI can show why.
    const detail = result.failureMessage || `HTTP_${result.httpStatus ?? "unknown"}`;
    return NextResponse.json(
      {
        success: false,
        error: "LEAD_SUBMISSION_FAILED",
        code: "LEAD_SUBMISSION_FAILED",
        detail,
        httpStatus: result.httpStatus,
      } satisfies V2LeadErrorResponse & {
        detail?: string;
        httpStatus?: number | null;
      },
      { status: 502 },
    );
  }

  const consent = buildV2ConsentRecord(partners, consentAt.toISOString());
  const response = NextResponse.json({
    success: true,
    mode: "vertikl",
    consent,
  } satisfies V2LeadSuccessResponse);
  clearPhoneVerifyCookie(response);
  return response;
}
