import "server-only";

import { createHash } from "node:crypto";
import type { MetaCustomData } from "@/lib/meta/events";

/**
 * Meta Conversions API (server-side twin of the browser Pixel).
 * Implemented directly in app code — NOT through GTM / sGTM.
 *
 * Env (Vercel):
 * - NEXT_PUBLIC_META_PIXEL_ID   pixel / dataset id (shared with the browser)
 * - META_CAPI_ACCESS_TOKEN      server only — never expose to the client
 * - META_TEST_EVENT_CODE        optional, Events Manager "Test events"
 *
 * Missing env → every call is a silent no-op. Errors are logged without PII
 * and never thrown: callers fire-and-forget (via next/server `after`).
 */

const GRAPH_API_VERSION = "v21.0";
const REQUEST_TIMEOUT_MS = 4000;

type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  zp?: string[];
  ct?: string[];
  country?: string[];
  external_id?: string[];
};

export type MetaServerEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: "website";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
};

/** Plain (unhashed) identifiers for a Lead; hashed here before sending. */
export type MetaLeadIdentity = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  postalCode?: string;
  city?: string;
};

export type MetaRequestContext = {
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
};

function getConfig(): { pixelId: string; token: string; testCode?: string } | null {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!pixelId || !/^\d{5,20}$/.test(pixelId) || !token) return null;
  const testCode = process.env.META_TEST_EVENT_CODE?.trim() || undefined;
  return { pixelId, token, testCode };
}

export function isMetaCapiConfigured(): boolean {
  return getConfig() !== null;
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function hashed(value: string | null | undefined): string[] | undefined {
  if (!value) return undefined;
  return [sha256(value)];
}

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function normalizeEmail(value: string | undefined): string | null {
  const email = value?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  return email;
}

/** French numbers → E.164 digits without "+" (e.g. 0612345678 → 33612345678). */
export function normalizeFrenchPhoneForMeta(value: string | undefined): string | null {
  let digits = (value ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("33") && digits.length === 11) {
    return /^33[1-9]\d{8}$/.test(digits) ? digits : null;
  }
  if (/^0[1-9]\d{8}$/.test(digits)) {
    return `33${digits.slice(1)}`;
  }
  return null;
}

/** Lowercase, trimmed, punctuation removed (accents kept, as Meta accepts UTF-8). */
export function normalizeName(value: string | undefined): string | null {
  const name = value
    ?.trim()
    .toLowerCase()
    .replace(/[\s'’\-.,]/g, "");
  return name || null;
}

export function normalizePostalCode(value: string | undefined): string | null {
  const zip = value?.replace(/\s/g, "").toLowerCase();
  return zip && /^\d{5}$/.test(zip) ? zip : null;
}

/** Lowercase a–z only, no spaces / punctuation / accents. */
export function normalizeCity(value: string | undefined): string | null {
  const city = stripDiacritics(value ?? "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return city || null;
}

/** _fbc cookie if present, otherwise fb.1.<ms>.<fbclid>. */
export function resolveFbc(context: MetaRequestContext): string | undefined {
  if (context.fbc?.trim()) return context.fbc.trim();
  const fbclid = context.fbclid?.trim();
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export function buildBaseUserData(context: MetaRequestContext): MetaUserData {
  const userData: MetaUserData = {};
  if (context.clientIp) userData.client_ip_address = context.clientIp;
  if (context.userAgent) userData.client_user_agent = context.userAgent;
  if (context.fbp?.trim()) userData.fbp = context.fbp.trim();
  const fbc = resolveFbc(context);
  if (fbc) userData.fbc = fbc;
  return userData;
}

export function buildLeadUserData(
  context: MetaRequestContext,
  identity: MetaLeadIdentity,
): MetaUserData {
  const email = normalizeEmail(identity.email);
  const userData: MetaUserData = {
    ...buildBaseUserData(context),
    em: hashed(email),
    ph: hashed(normalizeFrenchPhoneForMeta(identity.phone)),
    fn: hashed(normalizeName(identity.firstName)),
    ln: hashed(normalizeName(identity.lastName)),
    zp: hashed(normalizePostalCode(identity.postalCode)),
    ct: hashed(normalizeCity(identity.city)),
    country: hashed("fr"),
    external_id: hashed(email),
  };
  for (const key of Object.keys(userData) as (keyof MetaUserData)[]) {
    if (userData[key] === undefined) delete userData[key];
  }
  return userData;
}

/** Reads a cookie from the raw Cookie header (route handlers). */
export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) {
      const value = rest.join("=").trim();
      try {
        return decodeURIComponent(value) || undefined;
      } catch {
        return value || undefined;
      }
    }
  }
  return undefined;
}

export function getRequestClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return undefined;
}

/** IP, UA and Meta cookies of the incoming request. */
export function metaContextFromRequest(
  request: Request,
  fbclid?: string,
): MetaRequestContext {
  return {
    clientIp: getRequestClientIp(request),
    userAgent: request.headers.get("user-agent")?.trim() || undefined,
    fbp: readCookie(request, "_fbp"),
    fbc: readCookie(request, "_fbc"),
    fbclid: fbclid?.trim() || undefined,
  };
}

/**
 * POST events to the Graph API. Never throws; resolves when done or timed out.
 * Logs status / Meta error codes only — no user data.
 */
export async function sendMetaEvents(events: MetaServerEvent[]): Promise<void> {
  const config = getConfig();
  if (!config || events.length === 0) return;

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.pixelId}/events`;
  const body: Record<string, unknown> = {
    data: events,
    access_token: config.token,
  };
  if (config.testCode) body.test_event_code = config.testCode;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      let code: unknown;
      let subcode: unknown;
      let traceId: unknown;
      try {
        const payload = (await response.json()) as {
          error?: { code?: unknown; error_subcode?: unknown; fbtrace_id?: unknown };
        };
        code = payload.error?.code;
        subcode = payload.error?.error_subcode;
        traceId = payload.error?.fbtrace_id;
      } catch {
        // ignore
      }
      console.error("[meta/capi] request failed", {
        httpStatus: response.status,
        code,
        subcode,
        traceId,
        events: events.map((event) => event.event_name),
      });
    }
  } catch (error) {
    console.error("[meta/capi] request error", {
      reason: error instanceof Error ? error.name : "unknown",
      events: events.map((event) => event.event_name),
    });
  }
}

export function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
