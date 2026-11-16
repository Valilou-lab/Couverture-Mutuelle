import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createV2EligibilityToken } from "@/lib/v2/eligibility-token";
import { mapVertiklBuyerToDisplay } from "@/lib/v2/vertikl-buyer-map";
import {
  mapCurrentlyInsured,
  mapPeopleToCover,
  mapProfessionalStatut,
} from "@/lib/vertikl/mappers";
import {
  frenchDateToIso,
  toInternationalFrenchPhone,
} from "@/lib/vertikl/normalize";
import { runVertiklPrecheck } from "@/lib/vertikl/precheck";
import { isValidFrenchPostalCode } from "@/lib/location-service";
import type {
  CoveredPersonId,
  ProfessionalStatusId,
} from "@/components/form/types";

export const runtime = "nodejs";

type EligibilityBody = {
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
export async function POST(request: Request) {
  let body: EligibilityBody = {};
  try {
    body = (await request.json()) as EligibilityBody;
  } catch {
    body = {};
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  const phone = toInternationalFrenchPhone(phoneRaw) || phoneRaw;

  console.info("[api/v2/eligibility] request received", {
    hasEmail: Boolean(email),
    hasPhone: Boolean(phone),
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

  const fields: {
    email: string;
    phone: string;
    date_of_birth?: string;
    postal_code?: string;
    city?: string;
    currently_insured?: boolean;
    people_to_cover?: string;
    professional_statut?: string;
  } = { email, phone };

  if (typeof body.birthDate === "string") {
    const dob = frenchDateToIso(body.birthDate);
    if (dob) fields.date_of_birth = dob;
  }
  if (
    typeof body.postalCode === "string" &&
    isValidFrenchPostalCode(body.postalCode)
  ) {
    fields.postal_code = body.postalCode;
  }
  if (typeof body.city === "string" && body.city.trim()) {
    fields.city = body.city.trim();
  }
  if (body.alreadyInsured === "oui" || body.alreadyInsured === "non") {
    fields.currently_insured = mapCurrentlyInsured(body.alreadyInsured);
  }
  if (typeof body.coveredPersons === "string" && body.coveredPersons) {
    try {
      fields.people_to_cover = mapPeopleToCover(
        body.coveredPersons as CoveredPersonId,
      );
    } catch {
      // omit unmapped
    }
  }
  if (typeof body.professionalStatus === "string" && body.professionalStatus) {
    const mapped = mapProfessionalStatut(
      body.professionalStatus as ProfessionalStatusId | "",
    );
    if (mapped) fields.professional_statut = mapped;
  }

  const criteria: Record<string, unknown> = {
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
