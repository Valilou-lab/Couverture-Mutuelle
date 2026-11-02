import { NextResponse } from "next/server";
import { createV2EligibilityToken } from "@/lib/v2/eligibility-token";
import { getMockEligiblePartners } from "@/lib/v2/partners-registry";

/**
 * V2 eligibility for `/devis`.
 * Isolated from demo `/api/eligibility` and from Vertikl / `/api/leads` / Twilio.
 *
 * Contract: returns allowlisted partners + `eligibilityToken` (scaffold unsigned).
 * Commercial rules stay here (or downstream) — never in the LP.
 */
export async function POST(request: Request) {
  let criteria: Record<string, unknown> = {};
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body && typeof body === "object") {
      criteria = body;
    }
  } catch {
    // Empty / invalid body is accepted in scaffold mode.
  }

  const partners = getMockEligiblePartners();
  const eligibilityToken = createV2EligibilityToken({
    partnerIds: partners.map((partner) => partner.id),
    criteria,
  });

  return NextResponse.json({
    eligible: partners.length > 0,
    partners: partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
    })),
    eligibilityToken,
  });
}
