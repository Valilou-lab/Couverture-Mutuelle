import "server-only";

import type {
  SendLeadResult,
  VertiklLeadFields,
  VertiklLeadPayload,
  VertiklTestResponse,
} from "./types";

const VERTIKL_BASE_URL = "https://ebre.vertikl.app";
const DEFAULT_CAMPAIGN_ID = "b1c3d961-2a06-4b99-b410-42753de22e1e";

function getCampaignId(): string {
  return process.env.VERTIKL_CAMPAIGN_ID?.trim() || DEFAULT_CAMPAIGN_ID;
}

function getApiMode(): string {
  return (process.env.VERTIKL_API_MODE ?? "test").trim().toLowerCase();
}

/**
 * TEST-only endpoint. Production is intentionally not enabled yet.
 */
function resolveEndpoint(): string {
  const mode = getApiMode();
  if (mode !== "test") {
    throw new Error(
      `VERTIKL_API_MODE="${mode}" is not enabled. Only "test" is allowed for now.`,
    );
  }
  return `${VERTIKL_BASE_URL}/api/leads/test`;
}

function summarizeReturnedFields(
  fields: Record<string, unknown> | null | undefined,
): { returnedFieldNames: string[]; consentWhatsappReturned: boolean | null } {
  if (!fields || typeof fields !== "object") {
    return { returnedFieldNames: [], consentWhatsappReturned: null };
  }
  const returnedFieldNames = Object.keys(fields).sort();
  const rawWhatsapp = fields["consent-whatsapp"];
  const consentWhatsappReturned =
    typeof rawWhatsapp === "boolean"
      ? rawWhatsapp
      : rawWhatsapp !== undefined
        ? Boolean(rawWhatsapp)
        : null;
  return { returnedFieldNames, consentWhatsappReturned };
}

export async function sendLeadToVertikl(
  fields: VertiklLeadFields,
): Promise<SendLeadResult> {
  const apiKey = process.env.VERTIKL_API_KEY?.trim();
  if (!apiKey) {
    console.error("[vertikl] VERTIKL_API_KEY is missing.");
    return {
      ok: false,
      httpStatus: null,
      failureMessage: "VERTIKL_API_KEY_MISSING",
      returnedFieldNames: [],
      consentWhatsappReturned: null,
    };
  }

  let endpoint: string;
  try {
    endpoint = resolveEndpoint();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "VERTIKL_MODE_INVALID";
    console.error("[vertikl]", message);
    return {
      ok: false,
      httpStatus: null,
      failureMessage: "VERTIKL_MODE_NOT_ENABLED",
      returnedFieldNames: [],
      consentWhatsappReturned: null,
    };
  }

  const campaignId = getCampaignId();
  const payload: VertiklLeadPayload = {
    campaignId,
    fields,
  };

  const sentFieldNames = Object.keys(fields).sort();

  console.info("[vertikl] submitting lead", {
    endpoint,
    campaignId,
    mode: getApiMode(),
    sentFieldNames,
    hasConsentWhatsapp: Object.prototype.hasOwnProperty.call(
      fields,
      "consent-whatsapp",
    ),
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    let body: VertiklTestResponse | null = null;
    try {
      body = (await response.json()) as VertiklTestResponse;
    } catch {
      body = null;
    }

    const { returnedFieldNames, consentWhatsappReturned } =
      summarizeReturnedFields(body?.fields ?? null);

    const failureMessage =
      body?.failureMessage?.trim() ||
      (!response.ok ? `HTTP_${response.status}` : null);

    const ok = response.ok && body?.success === true;

    console.info("[vertikl] response", {
      endpoint,
      campaignId,
      httpStatus: response.status,
      success: ok,
      failureMessage: failureMessage ?? null,
      returnedFieldNames,
      consentWhatsappReturned,
    });

    if (!ok) {
      return {
        ok: false,
        httpStatus: response.status,
        failureMessage: failureMessage || "LEAD_SUBMISSION_FAILED",
        returnedFieldNames,
        consentWhatsappReturned,
      };
    }

    return {
      ok: true,
      httpStatus: response.status,
      failureMessage: null,
      returnedFieldNames,
      consentWhatsappReturned,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "NETWORK_ERROR";
    console.error("[vertikl] network error", {
      endpoint,
      campaignId,
      failureMessage: message,
    });
    return {
      ok: false,
      httpStatus: null,
      failureMessage: "NETWORK_ERROR",
      returnedFieldNames: [],
      consentWhatsappReturned: null,
    };
  }
}
