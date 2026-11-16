import "server-only";

import { randomUUID } from "crypto";

const VERTIKL_BASE_URL = "https://ebre.vertikl.app";

/** Couverture Mutuelle V2 campaign — acquire after consent. */
export const V2_VERTIKL_CAMPAIGN_ID =
  "fed07381-9b38-4ff1-8cef-2d92d6b12989";

export type VertiklPrecheckBuyer = {
  id: string;
  name: string;
};

export type VertiklPrecheckReserved = {
  status: "RESERVED";
  buyers: VertiklPrecheckBuyer[];
  precheckId: string;
  expiresAt: string;
};

export type VertiklPrecheckRefused = {
  status: "REFUSED";
  buyers: [];
  reason: string;
};

export type VertiklPrecheckTechnical = {
  status: "TECHNICAL_ERROR";
  httpStatus: number | null;
  reason: string;
};

export type VertiklPrecheckResult =
  | VertiklPrecheckReserved
  | VertiklPrecheckRefused
  | VertiklPrecheckTechnical;

export type VertiklPrecheckFields = {
  email: string;
  phone: string;
  date_of_birth?: string;
  postal_code?: string;
  city?: string;
  currently_insured?: boolean;
  people_to_cover?: string;
  professional_statut?: string;
};

type RawPrecheckBody = {
  status?: unknown;
  buyers?: unknown;
  precheck_id?: unknown;
  expires_at?: unknown;
  reason?: unknown;
  message?: unknown;
  failureMessage?: unknown;
};

function parseBuyers(raw: unknown): VertiklPrecheckBuyer[] {
  if (!Array.isArray(raw)) return [];
  const buyers: VertiklPrecheckBuyer[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const id = (item as { id?: unknown }).id;
    const name = (item as { name?: unknown }).name;
    if (typeof id !== "string" || !id.trim()) continue;
    if (typeof name !== "string" || !name.trim()) continue;
    buyers.push({ id: id.trim(), name: name.trim() });
  }
  return buyers;
}

/**
 * Vertikl precheck (reservation / buyer eligibility).
 * Server-only — never call from the browser.
 */
export async function runVertiklPrecheck(input: {
  fields: VertiklPrecheckFields;
  idempotencyKey?: string;
}): Promise<VertiklPrecheckResult> {
  const apiKey = process.env.VERTIKL_API_KEY?.trim();
  if (!apiKey) {
    console.error("[vertikl/precheck] VERTIKL_API_KEY missing");
    return {
      status: "TECHNICAL_ERROR",
      httpStatus: null,
      reason: "VERTIKL_API_KEY_MISSING",
    };
  }

  const idempotencyKey = input.idempotencyKey?.trim() || randomUUID();
  const endpoint = `${VERTIKL_BASE_URL}/api/leads/precheck`;
  const payload = {
    campaignId: V2_VERTIKL_CAMPAIGN_ID,
    fields: input.fields,
  };

  console.info("[vertikl/precheck] request", {
    endpoint,
    campaignId: V2_VERTIKL_CAMPAIGN_ID,
    idempotencyKey,
    fieldKeys: Object.keys(input.fields).sort(),
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const httpStatus = response.status;
    let body: RawPrecheckBody | null = null;
    try {
      body = (await response.json()) as RawPrecheckBody;
    } catch {
      body = null;
    }

    console.info("[vertikl/precheck] response", {
      httpStatus,
      status: body?.status ?? null,
      reason: typeof body?.reason === "string" ? body.reason : null,
      buyerCount: Array.isArray(body?.buyers) ? body.buyers.length : null,
      precheckId:
        typeof body?.precheck_id === "string" ? body.precheck_id : null,
      expiresAt:
        typeof body?.expires_at === "string" ? body.expires_at : null,
    });

    if (httpStatus === 503) {
      return {
        status: "TECHNICAL_ERROR",
        httpStatus,
        reason: "TECHNICAL_ERROR",
      };
    }

    if (httpStatus === 409) {
      return {
        status: "TECHNICAL_ERROR",
        httpStatus,
        reason: "IDEMPOTENCY_CONFLICT",
      };
    }

    if (httpStatus === 401 || httpStatus === 403) {
      return {
        status: "TECHNICAL_ERROR",
        httpStatus,
        reason: `HTTP_${httpStatus}`,
      };
    }

    if (!body || typeof body.status !== "string") {
      return {
        status: "TECHNICAL_ERROR",
        httpStatus,
        reason: "INVALID_PRECHECK_BODY",
      };
    }

    if (body.status === "REFUSED") {
      return {
        status: "REFUSED",
        buyers: [],
        reason:
          typeof body.reason === "string" && body.reason.trim()
            ? body.reason.trim()
            : "precheck.refused",
      };
    }

    if (body.status === "RESERVED") {
      const buyers = parseBuyers(body.buyers);
      const precheckId =
        typeof body.precheck_id === "string" ? body.precheck_id.trim() : "";
      const expiresAt =
        typeof body.expires_at === "string" ? body.expires_at.trim() : "";
      if (!precheckId || !expiresAt) {
        return {
          status: "TECHNICAL_ERROR",
          httpStatus,
          reason: "RESERVED_MISSING_FIELDS",
        };
      }
      return {
        status: "RESERVED",
        buyers,
        precheckId,
        expiresAt,
      };
    }

    if (body.status === "TECHNICAL_ERROR") {
      return {
        status: "TECHNICAL_ERROR",
        httpStatus,
        reason: "TECHNICAL_ERROR",
      };
    }

    return {
      status: "TECHNICAL_ERROR",
      httpStatus,
      reason: `UNEXPECTED_STATUS_${body.status}`,
    };
  } catch (error) {
    console.error("[vertikl/precheck] network error", {
      reason: error instanceof Error ? error.message : "NETWORK_ERROR",
    });
    return {
      status: "TECHNICAL_ERROR",
      httpStatus: null,
      reason: "NETWORK_ERROR",
    };
  }
}
