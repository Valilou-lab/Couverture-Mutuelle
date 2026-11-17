import type {
  EligibilityClientResult,
  EligibilityRequestPayload,
  EligibilityResponse,
  EligiblePartner,
} from "../v2Types";

const ELIGIBILITY_ERROR =
  "Impossible de vérifier vos offres pour le moment. Merci de réessayer.";

export class EligibilityClientError extends Error {
  constructor(message = ELIGIBILITY_ERROR) {
    super(message);
    this.name = "EligibilityClientError";
  }
}

/**
 * Front → `/api/v2/eligibility` only.
 * No Vertikl URL / API key in the browser.
 */
export async function fetchEligiblePartners(
  payload: EligibilityRequestPayload,
): Promise<EligibilityClientResult> {
  // TEMP diagnostic — remove after OTP→precheck bug is confirmed.
  console.info("PRECHECK_PAYLOAD", payload);

  // credentials:include — must send HttpOnly `cm_phone_verified` set by /api/verify/check
  const response = await fetch("/api/v2/eligibility", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let json: EligibilityResponse | null = null;
  try {
    json = (await response.json()) as EligibilityResponse;
  } catch {
    json = null;
  }

  console.info("PRECHECK_RESPONSE", {
    httpStatus: response.status,
    ok: response.ok,
    body: json,
  });

  if (response.status === 503 || json?.status === "technical_error") {
    console.error("PRECHECK_ERROR", {
      httpStatus: response.status,
      reason: json?.reason ?? null,
      status: json?.status ?? null,
      message: ELIGIBILITY_ERROR,
    });
    throw new EligibilityClientError();
  }

  if (!response.ok && response.status !== 200) {
    console.error("PRECHECK_ERROR", {
      httpStatus: response.status,
      reason: json?.reason ?? null,
      status: json?.status ?? null,
      message: ELIGIBILITY_ERROR,
    });
    throw new EligibilityClientError();
  }

  if (!json) {
    throw new EligibilityClientError();
  }

  const partners = Array.isArray(json.partners)
    ? json.partners.filter(
        (p): p is EligiblePartner =>
          typeof p?.id === "string" && typeof p?.name === "string",
      )
    : [];

  if (json.status === "no_eligible_partner" || partners.length === 0) {
    return {
      status: "no_eligible_partner",
      partners: [],
      eligibilityToken: null,
      reason: json.reason,
    };
  }

  if (typeof json.eligibilityToken !== "string" || !json.eligibilityToken) {
    throw new EligibilityClientError();
  }

  return {
    status: "reserved",
    partners,
    eligibilityToken: json.eligibilityToken,
    expiresAt: json.expiresAt,
    reason: json.reason,
  };
}
