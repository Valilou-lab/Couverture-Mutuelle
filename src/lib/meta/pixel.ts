/**
 * Meta Pixel helpers — no health / form questionnaire data.
 *
 * Only call after marketing cookie consent.
 * Never pass care needs, DOB, health regime, insurer, family status, etc.
 */

import {
  hasMarketingConsent,
  readConsentFromStorage,
} from "@/lib/cookie-consent";

export const META_PIXEL_ID = "4246816345581334";

/** Events allowed to be fired explicitly from app code. */
export const META_ALLOWED_EVENTS = ["PageView", "Lead"] as const;

export type MetaAllowedEvent = (typeof META_ALLOWED_EVENTS)[number];

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

let pixelInitialized = false;
let lastPageViewPath: string | null = null;
/** Prevents duplicate Lead fires for the same page lifetime. */
let leadEventSent = false;

export function isMetaAllowedEvent(event: string): event is MetaAllowedEvent {
  return (META_ALLOWED_EVENTS as readonly string[]).includes(event);
}

export function hasMetaPixelStub(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * Init Pixel without Advanced Matching user data.
 * Disables Meta automatic configuration (form/button scanning).
 */
export function initMetaPixel(): boolean {
  if (!hasMetaPixelStub()) return false;
  if (pixelInitialized) return true;

  window.fbq!("set", "autoConfig", false, META_PIXEL_ID);
  // No second argument → no automatic Advanced Matching payload.
  window.fbq!("init", META_PIXEL_ID);
  pixelInitialized = true;
  return true;
}

/**
 * Fire a consented, allow-listed Meta event.
 * Do not attach health-related or form-answer parameters.
 */
export function trackMetaEvent(
  event: MetaAllowedEvent,
  pathKey?: string,
): boolean {
  if (!isMetaAllowedEvent(event)) {
    console.log("[META DEBUG] trackMetaEvent aborted: event not allowed", {
      event,
    });
    return false;
  }

  const marketingActive = hasMarketingConsent(readConsentFromStorage());
  console.log("[META DEBUG] marketing consent active", marketingActive);
  if (!marketingActive) {
    console.log("[META DEBUG] trackMetaEvent aborted: marketing consent off");
    return false;
  }

  const fbqExists = hasMetaPixelStub();
  console.log("[META DEBUG] window.fbq exists", fbqExists);
  if (!fbqExists) {
    console.log("[META DEBUG] trackMetaEvent aborted: fbq missing");
    return false;
  }

  if (!initMetaPixel()) {
    console.log("[META DEBUG] trackMetaEvent aborted: initMetaPixel failed");
    return false;
  }

  if (event === "PageView") {
    const key =
      pathKey ??
      (typeof window !== "undefined" ? window.location.pathname : "");
    if (lastPageViewPath === key) return false;
    lastPageViewPath = key;
  }

  if (event === "Lead") {
    if (leadEventSent) {
      console.log("[META DEBUG] trackMetaEvent aborted: Lead already sent");
      return false;
    }
    leadEventSent = true;
  }

  // Standard event only — never pass custom parameters / form fields.
  console.log("[META DEBUG] calling fbq('track', event)", { event });
  window.fbq!("track", event);
  console.log("[META DEBUG] fbq('track') executed", { event });
  return true;
}

/** Reset module guards (e.g. after consent revoked in-session). */
export function resetMetaPixelState(): void {
  pixelInitialized = false;
  lastPageViewPath = null;
  // Keep leadEventSent to avoid re-firing Lead after revoke/re-accept.
}

/**
 * Inline bootstrap only (no init / no PageView).
 * Safe to inject only after marketing consent.
 */
export const META_PIXEL_BOOTSTRAP = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
`.trim();
