/**
 * Meta Pixel helpers — no health / form questionnaire data.
 *
 * Only call after marketing cookie consent.
 * Never pass care needs, DOB, health regime, insurer, family status, etc.
 */

export const META_PIXEL_ID = "4246816345581334";

/** Events allowed to be fired explicitly from app code. */
export const META_ALLOWED_EVENTS = ["PageView"] as const;

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
  if (!isMetaAllowedEvent(event)) return false;
  if (!hasMetaPixelStub()) return false;
  if (!initMetaPixel()) return false;

  if (event === "PageView") {
    const key = pathKey ?? (typeof window !== "undefined" ? window.location.pathname : "");
    if (lastPageViewPath === key) return false;
    lastPageViewPath = key;
  }

  window.fbq!("track", event);
  return true;
}

/** Reset module guards (e.g. after consent revoked in-session). */
export function resetMetaPixelState(): void {
  pixelInitialized = false;
  lastPageViewPath = null;
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
