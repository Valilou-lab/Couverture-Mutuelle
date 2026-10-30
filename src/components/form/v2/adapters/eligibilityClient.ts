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
 * No commercial rules; displays whatever partners (+ token) the API returns.
 */
export async function fetchEligiblePartners(
  payload: EligibilityRequestPayload,
): Promise<EligibilityClientResult> {
  const response = await fetch("/api/v2/eligibility", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new EligibilityClientError();
  }

  const json = (await response.json()) as EligibilityResponse;
  const partners = Array.isArray(json.partners)
    ? json.partners.filter(
        (p): p is EligiblePartner =>
          typeof p?.id === "string" && typeof p?.name === "string",
      )
    : [];

  if (typeof json.eligibilityToken !== "string" || !json.eligibilityToken) {
    throw new EligibilityClientError();
  }

  return {
    partners,
    eligibilityToken: json.eligibilityToken,
  };
}
