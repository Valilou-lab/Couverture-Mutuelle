/**
 * Meta Pixel (browser) — installed directly in app code, NOT through GTM.
 *
 * - fbevents.js is only injected after the visitor grants "Publicité / marketing"
 *   consent in the existing cookie banner (see MetaPixel component).
 * - Withdrawing consent calls fbq('consent', 'revoke') and clears _fbp / _fbc.
 * - Every event carries an eventID shared with its Conversions API twin.
 * - No PII, form answers or health data are ever passed to the pixel.
 */

import { getStoredAcquisition } from "@/lib/acquisition";
import {
  hasMarketingConsent,
  readConsentFromStorage,
} from "@/lib/cookie-consent";
import {
  createMetaEventId,
  META_CUSTOM_EVENTS,
  type MetaCustomData,
  type MetaLeadTracking,
  type MetaRelayedEventName,
  type MetaRelayRequestBody,
} from "@/lib/meta/events";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: unknown;
  loaded?: boolean;
  version?: string;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    __cmMetaPixelInitialized?: boolean;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isMetaPixelConfigured(): boolean {
  return /^\d{5,20}$/.test(META_PIXEL_ID);
}

/** Source of truth = the stored cookie banner choice (marketing category). */
export function hasMetaMarketingConsent(): boolean {
  if (!isBrowser()) return false;
  return hasMarketingConsent(readConsentFromStorage());
}

/** Standard Meta snippet (fbq stub + async fbevents.js), without auto PageView. */
function injectFbevents(): void {
  if (window.fbq) return;
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue!.push(args);
    }
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  // fbevents.js fires its own PageView (without our event_id) on every
  // history.pushState; MetaPixel.tsx already sends one per pathname.
  fbq.disablePushState = true;
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Load + init the pixel (idempotent). Returns false when not allowed / not configured.
 * autoConfig is disabled so the pixel never scrapes buttons or form fields.
 */
export function ensureMetaPixel(): boolean {
  if (!isBrowser() || !isMetaPixelConfigured()) return false;
  if (!hasMetaMarketingConsent()) return false;

  injectFbevents();
  const fbq = window.fbq!;
  fbq("consent", "grant");
  if (!window.__cmMetaPixelInitialized) {
    window.__cmMetaPixelInitialized = true;
    fbq("set", "autoConfig", false, META_PIXEL_ID);
    fbq("init", META_PIXEL_ID);
  }
  return true;
}

function expireCookie(name: string): void {
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  document.cookie = `${name}=; ${expired}`;
  const host = window.location.hostname;
  const parts = host.split(".");
  // Meta sets _fbp/_fbc on the registrable domain (e.g. .couverturemutuelle.fr).
  for (let i = 0; i < parts.length - 1; i += 1) {
    const domain = parts.slice(i).join(".");
    document.cookie = `${name}=; ${expired}; domain=.${domain}`;
  }
}

/** Consent withdrawn: stop the pixel and remove its first-party cookies. */
export function revokeMetaPixel(): void {
  if (!isBrowser()) return;
  if (window.fbq) {
    window.fbq("consent", "revoke");
  }
  expireCookie("_fbp");
  expireCookie("_fbc");
}

function currentFbclid(): string | undefined {
  try {
    const fromUrl = new URL(window.location.href).searchParams.get("fbclid");
    if (fromUrl?.trim()) return fromUrl.trim().slice(0, 500);
  } catch {
    // ignore
  }
  const stored = getStoredAcquisition().acquisition.fbclid;
  return stored?.trim() ? stored.trim().slice(0, 500) : undefined;
}

function firePixel(
  eventName: string,
  eventId: string,
  customData?: MetaCustomData,
): void {
  if (!ensureMetaPixel()) return;
  const method = META_CUSTOM_EVENTS.has(eventName) ? "trackCustom" : "track";
  window.fbq!(method, eventName, customData ?? {}, { eventID: eventId });
}

function relayToServer(body: MetaRelayRequestBody): void {
  try {
    void fetch("/api/meta/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      // Tracking must never surface errors to the visitor.
    });
  } catch {
    // ignore
  }
}

/**
 * Pixel + Conversions API (same event_id). No-op without marketing consent.
 */
export function trackMetaEvent(
  eventName: MetaRelayedEventName,
  customData?: MetaCustomData,
): void {
  if (!isBrowser() || !isMetaPixelConfigured()) return;
  if (!hasMetaMarketingConsent()) return;

  const eventId = createMetaEventId();
  const fbclid = currentFbclid();
  firePixel(eventName, eventId, customData);
  relayToServer({
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href.slice(0, 2000),
    marketing_consent: true,
    ...(customData ? { custom_data: customData } : {}),
    ...(fbclid ? { fbclid } : {}),
  });
}

export function trackMetaFormStart(): void {
  trackMetaEvent("FormStart");
}

/** step_key is the internal step id (e.g. "coveredPersons") — never an answer. */
export function trackMetaFormStep(stepNumber: number, stepKey: string): void {
  trackMetaEvent("FormStep", { step_number: stepNumber, step_key: stepKey });
}

/**
 * Prepared before POST /api/leads: the server sends the CAPI Lead with this
 * event_id (only if marketingConsent), the browser fires the Pixel Lead after OK.
 */
export function prepareMetaLeadTracking(): MetaLeadTracking {
  return {
    eventId: createMetaEventId(),
    marketingConsent: hasMetaMarketingConsent(),
    eventSourceUrl: isBrowser() ? window.location.href.slice(0, 2000) : "",
  };
}

/** Pixel-only Lead — its CAPI twin is sent server-side by /api/leads. */
export function trackMetaLeadPixel(tracking: MetaLeadTracking): void {
  if (!isBrowser() || !tracking.marketingConsent) return;
  firePixel("Lead", tracking.eventId);
}
