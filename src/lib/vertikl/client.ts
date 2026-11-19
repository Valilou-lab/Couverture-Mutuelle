import "server-only";

import {
  fingerprintVertiklApiKey,
  getVertiklApiMode,
  resolveVertiklAcquireEndpoint,
} from "@/lib/vertikl/fields-snapshot";
import type {
  SendLeadResult,
  VertiklLeadFields,
  VertiklLeadPayload,
  VertiklTestResponse,
} from "./types";

/**
 * Resolve Vertikl endpoint from VERTIKL_API_MODE.
 * Default remains "test" when the env var is absent.
 */
function resolveEndpoint(): string {
  const mode = getVertiklApiMode();
  if (mode !== "test" && mode !== "production") {
    throw new Error(
      `Invalid VERTIKL_API_MODE="${mode}". Use "test" or "production".`,
    );
  }
  return resolveVertiklAcquireEndpoint(mode);
}

function summarizeReturnedFields(
  fields: Record<string, unknown> | null | undefined,
): { returnedFieldNames: string[]; consentWhatsappReturned: boolean | null } {
  if (!fields || typeof fields !== "object") {
    return { returnedFieldNames: [], consentWhatsappReturned: null };
  }
  const returnedFieldNames = Object.keys(fields).sort();
  const rawWhatsapp = fields["consent_whatsapp"];
  const consentWhatsappReturned =
    typeof rawWhatsapp === "boolean"
      ? rawWhatsapp
      : rawWhatsapp !== undefined
        ? Boolean(rawWhatsapp)
        : null;
  return { returnedFieldNames, consentWhatsappReturned };
}

export type SendLeadToVertiklOptions = {
  /** Vertikl reservation id from precheck — required to confirm a reserved sale. */
  precheckId?: string;
  /** Exact buyer UUIDs announced to the prospect during precheck. */
  buyerIds?: readonly string[];
  /**
   * ISO-8601 timestamp of nominative partner consent collection.
   */
  consentCollectedAt?: string;
  /** Optional internal consent proof reference — omit when unknown. */
  proofRef?: string;
};

export async function sendLeadToVertikl(
  fields: VertiklLeadFields,
  campaignId: string,
  options?: SendLeadToVertiklOptions,
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

  const resolvedCampaignId = campaignId.trim();
  if (!resolvedCampaignId) {
    console.error("[vertikl] campaignId is missing.");
    return {
      ok: false,
      httpStatus: null,
      failureMessage: "VERTIKL_CAMPAIGN_ID_MISSING",
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

  const precheckId = options?.precheckId?.trim() || "";
  const buyerIds = (options?.buyerIds ?? [])
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  const consentCollectedAt = options?.consentCollectedAt?.trim() || "";
  const proofRef = options?.proofRef?.trim() || "";

  // Vertikl reservation confirm contract: consent.buyer_ids (not root buyer_ids).
  const consent =
    buyerIds.length > 0 && consentCollectedAt
      ? {
          buyer_ids: buyerIds,
          collected_at: consentCollectedAt,
          ...(proofRef ? { proof_ref: proofRef } : {}),
        }
      : undefined;

  const payload: VertiklLeadPayload & {
    precheck_id?: string;
    consent?: {
      buyer_ids: string[];
      collected_at: string;
      proof_ref?: string;
    };
  } = {
    campaignId: resolvedCampaignId,
    fields,
    ...(precheckId ? { precheck_id: precheckId } : {}),
    ...(consent ? { consent } : {}),
  };

  const sentFieldNames = Object.keys(fields).sort();

  console.info("[vertikl] submitting lead", {
    endpoint,
    campaignId: resolvedCampaignId,
    vertiklApiMode: getVertiklApiMode(),
    apiKey: fingerprintVertiklApiKey(apiKey),
    sentFieldNames,
    precheckId: precheckId || null,
    consentBuyerIds: consent?.buyer_ids ?? [],
    consentCollectedAt: consent?.collected_at ?? null,
    hasConsentProofRef: Boolean(consent?.proof_ref),
    hasConsentGiven: Object.prototype.hasOwnProperty.call(
      fields,
      "consent_given",
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

    const responseText = await response.text();
    let body: VertiklTestResponse | null = null;
    let rawBody: unknown = null;
    try {
      rawBody = responseText ? (JSON.parse(responseText) as unknown) : null;
      body = rawBody as VertiklTestResponse;
    } catch {
      body = null;
      rawBody = responseText || null;
    }

    const { returnedFieldNames, consentWhatsappReturned } =
      summarizeReturnedFields(body?.fields ?? null);

    const vertiklMessage =
      body && typeof body === "object"
        ? typeof (body as { message?: unknown }).message === "string"
          ? (body as { message: string }).message.trim()
          : null
        : null;
    const vertiklErrorFlag =
      body && typeof body === "object"
        ? (body as { error?: unknown }).error
        : undefined;

    const failureMessage =
      body?.failureMessage?.trim() ||
      vertiklMessage ||
      (!response.ok ? `HTTP_${response.status}` : null);

    const ok = response.ok && body?.success === true;

    // TEMP diagnostic — redact PII if present in returned fields.
    const safeRaw =
      rawBody && typeof rawBody === "object"
        ? (() => {
            const clone = JSON.parse(JSON.stringify(rawBody)) as Record<
              string,
              unknown
            >;
            const maybeFields = clone.fields;
            if (maybeFields && typeof maybeFields === "object") {
              const f = maybeFields as Record<string, unknown>;
              if (typeof f.email === "string") f.email = "[redacted]";
              if (typeof f.phone === "string") f.phone = "[redacted]";
              if (typeof f.first_name === "string") f.first_name = "[redacted]";
              if (typeof f.last_name === "string") f.last_name = "[redacted]";
            }
            return clone;
          })()
        : rawBody;

    const usefulHeaders: Record<string, string | null> = {
      "content-type": response.headers.get("content-type"),
      "x-request-id":
        response.headers.get("x-request-id") ||
        response.headers.get("x-vercel-id") ||
        response.headers.get("cf-ray"),
    };

    console.info("[vertikl] response", {
      endpoint,
      campaignId: resolvedCampaignId,
      vertiklApiMode: getVertiklApiMode(),
      apiKey: fingerprintVertiklApiKey(apiKey),
      precheckId: precheckId || null,
      httpStatus: response.status,
      success: ok,
      failureMessage: failureMessage ?? null,
      vertiklMessage,
      vertiklErrorFlag: vertiklErrorFlag ?? null,
      returnedFieldNames,
      consentWhatsappReturned,
      responseHeaders: usefulHeaders,
      // TEMP: full Vertikl body (PII redacted) / raw text to diagnose 422s
      rawBody: safeRaw,
      rawBodyText:
        typeof rawBody === "string"
          ? rawBody.slice(0, 4000)
          : responseText.slice(0, 4000),
    });

    if (!response.ok) {
      console.error("VERTIKL_ACQUIRE_ERROR_BODY", {
        httpStatus: response.status,
        responseHeaders: usefulHeaders,
        body: safeRaw,
        bodyText: responseText.slice(0, 4000),
        failureMessage,
        precheckId: precheckId || null,
        consentBuyerIds: consent?.buyer_ids ?? [],
      });
    }

    if (!ok) {
      return {
        ok: false,
        httpStatus: response.status,
        failureMessage: failureMessage || "LEAD_SUBMISSION_FAILED",
        returnedFieldNames,
        consentWhatsappReturned,
        vertiklBody: safeRaw,
        vertiklHeaders: usefulHeaders,
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
      campaignId: resolvedCampaignId,
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
