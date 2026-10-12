import { after } from "next/server";
import {
  buildBaseUserData,
  isMetaCapiConfigured,
  metaContextFromRequest,
  nowInSeconds,
  sendMetaEvents,
} from "@/lib/meta/capi";
import {
  isMetaRelayedEvent,
  isValidMetaEventId,
  sanitizeMetaCustomData,
} from "@/lib/meta/events";

export const runtime = "nodejs";

/**
 * Browser → Conversions API relay for PageView / FormStart / FormStep.
 * Same event_id as the Pixel event for deduplication.
 * Only accepted with explicit marketing consent from the cookie banner.
 * Always answers 204 quickly; the Graph API call runs after the response.
 */

function noContent() {
  return new Response(null, { status: 204 });
}

function requestHost(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwarded || request.headers.get("host")?.trim();
  return host ? host.toLowerCase() : null;
}

/** Only accept URLs from this site (no arbitrary event_source_url relay). */
function sanitizeSourceUrl(value: unknown, request: Request): string | null {
  if (typeof value !== "string" || value.length > 2000) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = requestHost(request);
    if (!host || url.host.toLowerCase() !== host) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isMetaCapiConfigured()) return noContent();

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return noContent();
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return noContent();
  }

  if (body.marketing_consent !== true) return noContent();
  if (!isMetaRelayedEvent(body.event_name)) return noContent();
  if (!isValidMetaEventId(body.event_id)) return noContent();

  const eventSourceUrl = sanitizeSourceUrl(body.event_source_url, request);
  if (!eventSourceUrl) return noContent();

  const fbclid =
    typeof body.fbclid === "string" && body.fbclid.trim()
      ? body.fbclid.trim().slice(0, 500)
      : undefined;
  const context = metaContextFromRequest(request, fbclid);
  const customData = sanitizeMetaCustomData(body.custom_data);

  const event = {
    event_name: body.event_name,
    event_time: nowInSeconds(),
    event_id: body.event_id,
    event_source_url: eventSourceUrl,
    action_source: "website" as const,
    user_data: buildBaseUserData(context),
    ...(customData ? { custom_data: customData } : {}),
  };

  after(() => sendMetaEvents([event]));

  return noContent();
}
