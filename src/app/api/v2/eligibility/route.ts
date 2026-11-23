import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type {
  CoveredPersonId,
  ProfessionalStatusId,
} from "@/components/form/types";
import {
  PHONE_VERIFY_COOKIE,
  normalizePhoneForProof,
  verifyPhoneProofToken,
} from "@/lib/phone-verify-proof";
import { createV2EligibilityToken } from "@/lib/v2/eligibility-token";
import { mapVertiklBuyerToDisplay } from "@/lib/v2/vertikl-buyer-map";
import {
  buildVertiklRuntimeDiag,
  storePrecheckFieldsSnapshot,
} from "@/lib/vertikl/fields-snapshot";
import { VertiklMappingError } from "@/lib/vertikl/mappers";
import { requiresSmsPhoneVerification } from "@/lib/vertikl/normalize";
import {
  runVertiklPrecheck,
  V2_VERTIKL_CAMPAIGN_ID,
} from "@/lib/vertikl/precheck";
import {
  buildV2VertiklCoreFields,
  listFieldNames,
  V2_VERTIKL_CORE_FIELD_KEYS,
} from "@/lib/vertikl/v2-core-fields";

export const runtime = "nodejs";

type EligibilityBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  birthDate?: unknown;
  postalCode?: unknown;
  city?: unknown;
  coveredPersons?: unknown;
  professionalStatus?: unknown;
  alreadyInsured?: unknown;
  healthInsuranceGoal?: unknown;
};

/**
 * V2 eligibility for `/devis`.
 * Front → this route → Vertikl precheck. Never expose Vertikl to the browser.
 */
export async function POST(request: NextRequest) {
  let body: EligibilityBody = {};
  try {
    body = (await request.json()) as EligibilityBody;
  } catch {
    body = {};
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  // Same normalizer as createPhoneVerifyProof / verifyPhoneProofToken (06 ↔ +336).
  const phone = normalizePhoneForProof(phoneRaw) || phoneRaw;

  console.info("[api/v2/eligibility] request received", {
    hasEmail: Boolean(email),
    hasPhone: Boolean(phone),
    hasFirstName:
      typeof body.firstName === "string" && Boolean(body.firstName.trim()),
    hasLastName:
      typeof body.lastName === "string" && Boolean(body.lastName.trim()),
    hasBirthDate: typeof body.birthDate === "string" && Boolean(body.birthDate),
    hasPostalCode:
      typeof body.postalCode === "string" && Boolean(body.postalCode),
  });

  if (!email || !phone.startsWith("+33")) {
    return NextResponse.json(
      {
        eligible: false,
        status: "technical_error",
        partners: [],
        eligibilityToken: null,
        reason: "invalid_contact",
      },
      { status: 400 },
    );
  }

  // Same gate as /api/v2/leads: 06/07 require a signed OTP proof bound to this phone.
  // Landlines bypass. verifyPhoneProofToken rejects number A cookie used with number B.
  if (requiresSmsPhoneVerification(phone)) {
    const phoneProof = request.cookies.get(PHONE_VERIFY_COOKIE)?.value;
    const phoneVerified = verifyPhoneProofToken(phoneProof, phone);
    console.info("[api/v2/eligibility] phone proof gate", {
      required: true,
      hasCookie: Boolean(phoneProof),
      phoneVerified,
      phonePrefix: phone.slice(0, 6),
    });
    if (!phoneVerified) {
      console.info("[api/v2/eligibility] phone not verified");
      return NextResponse.json(
        {
          eligible: false,
          status: "technical_error",
          partners: [],
          eligibilityToken: null,
          reason: "phone_not_verified",
        },
        { status: 403 },
      );
    }
  }

  let fields;
  try {
    fields = buildV2VertiklCoreFields({
      firstName: typeof body.firstName === "string" ? body.firstName : "",
      lastName: typeof body.lastName === "string" ? body.lastName : "",
      phone,
      email,
      birthDate: typeof body.birthDate === "string" ? body.birthDate : "",
      postalCode: typeof body.postalCode === "string" ? body.postalCode : "",
      alreadyInsured:
        body.alreadyInsured === "oui" || body.alreadyInsured === "non"
          ? body.alreadyInsured
          : "",
      coveredPersons:
        typeof body.coveredPersons === "string"
          ? (body.coveredPersons as CoveredPersonId | "")
          : "",
      professionalStatus:
        typeof body.professionalStatus === "string"
          ? (body.professionalStatus as ProfessionalStatusId | "")
          : "",
    });
  } catch (error) {
    const reason =
      error instanceof VertiklMappingError
        ? "invalid_qualification"
        : "invalid_qualification";
    console.info("[api/v2/eligibility] core fields mapping failed", {
      reason,
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        eligible: false,
        status: "technical_error",
        partners: [],
        eligibilityToken: null,
        reason,
      },
      { status: 400 },
    );
  }

  console.info("[api/v2/eligibility] precheck field names", {
    fieldNames: listFieldNames(fields as Record<string, unknown>),
    expectedCoreKeys: [...V2_VERTIKL_CORE_FIELD_KEYS],
    coreKeyCount: V2_VERTIKL_CORE_FIELD_KEYS.length,
  });

  const criteria: Record<string, unknown> = {
    firstName: typeof body.firstName === "string" ? body.firstName : "",
    lastName: typeof body.lastName === "string" ? body.lastName : "",
    email,
    phone,
    birthDate: typeof body.birthDate === "string" ? body.birthDate : "",
    postalCode: typeof body.postalCode === "string" ? body.postalCode : "",
    city: typeof body.city === "string" ? body.city : "",
    coveredPersons:
      typeof body.coveredPersons === "string" ? body.coveredPersons : "",
    professionalStatus:
      typeof body.professionalStatus === "string"
        ? body.professionalStatus
        : "",
    alreadyInsured:
      typeof body.alreadyInsured === "string" ? body.alreadyInsured : "",
  };

  const precheck = await runVertiklPrecheck({
    fields,
    idempotencyKey: randomUUID(),
  });

  if (precheck.status === "TECHNICAL_ERROR") {
    console.error("[api/v2/eligibility] technical error", {
      reason: precheck.reason,
      httpStatus: precheck.httpStatus,
    });
    return NextResponse.json(
      {
        eligible: false,
        status: "technical_error",
        partners: [],
        eligibilityToken: null,
        reason: precheck.reason,
      },
      { status: 503 },
    );
  }

  if (precheck.status === "REFUSED") {
    console.info("[api/v2/eligibility] no eligible partner", {
      reason: precheck.reason,
    });
    return NextResponse.json({
      eligible: false,
      status: "no_eligible_partner",
      partners: [],
      eligibilityToken: null,
      reason: precheck.reason,
    });
  }

  // RESERVED
  const mappedBuyers = precheck.buyers.map(mapVertiklBuyerToDisplay);
  const unknownBuyers = mappedBuyers.filter((buyer) => !buyer.partnerId);
  for (const buyer of unknownBuyers) {
    console.warn("[api/v2/eligibility] unknown Vertikl buyer (not in registry)", {
      vertiklBuyerId: buyer.vertiklBuyerId,
      name: buyer.name,
    });
  }

  const mappedPartnerIds = mappedBuyers
    .map((buyer) => buyer.partnerId)
    .filter((id): id is NonNullable<typeof id> => Boolean(id));

  // TEMP diagnostic — SAFE fields snapshot tied to this precheck_id.
  // Also embedded in the eligibility token for Vercel serverless compare.
  const precheckFieldsSnap = storePrecheckFieldsSnapshot(
    precheck.precheckId,
    fields as Record<string, unknown>,
  );
  const runtime = buildVertiklRuntimeDiag({
    campaignId: V2_VERTIKL_CAMPAIGN_ID,
    kind: "precheck",
  });
  console.info("[api/v2/eligibility] precheck fields SAFE snapshot", {
    precheckId: precheck.precheckId,
    expiresAt: precheck.expiresAt,
    endpoint: runtime.endpoint,
    vertiklApiMode: runtime.vertiklApiMode,
    campaignId: runtime.campaignId,
    apiKey: runtime.apiKey,
    keys: precheckFieldsSnap.keys,
    entries: precheckFieldsSnap.entries,
    emailFp: precheckFieldsSnap.emailFp,
    phoneFp: precheckFieldsSnap.phoneFp,
  });

  console.info("[api/v2/eligibility] reserved", {
    precheckId: precheck.precheckId,
    expiresAt: precheck.expiresAt,
    buyerIds: mappedBuyers.map((buyer) => buyer.vertiklBuyerId),
    mappedPartnerIds,
    unknownBuyerIds: unknownBuyers.map((buyer) => buyer.vertiklBuyerId),
  });

  const eligibilityToken = createV2EligibilityToken({
    precheckId: precheck.precheckId,
    expiresAt: precheck.expiresAt,
    buyerIds: mappedBuyers.map((buyer) => buyer.vertiklBuyerId),
    partnerIds: mappedPartnerIds,
    criteria,
    fieldsSnap: precheckFieldsSnap,
  });

  return NextResponse.json({
    eligible: mappedBuyers.length > 0,
    status: mappedBuyers.length > 0 ? "reserved" : "no_eligible_partner",
    partners: mappedBuyers.map((buyer) => ({
      id: buyer.id,
      name: buyer.name,
      vertiklBuyerId: buyer.vertiklBuyerId,
    })),
    eligibilityToken: mappedBuyers.length > 0 ? eligibilityToken : null,
    expiresAt: precheck.expiresAt,
    precheckId: precheck.precheckId,
  });
}
