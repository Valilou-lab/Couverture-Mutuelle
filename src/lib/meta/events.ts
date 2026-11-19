/**
 * Shared Meta (Pixel + Conversions API) event contract.
 * Used by the browser helpers and the server relay — keep it free of PII.
 * Meta tracking is implemented directly in app code, NOT through GTM.
 */

/** Browser events relayed to /api/meta/events (Lead is sent from /api/leads). */
export const META_RELAYED_EVENTS = ["PageView", "FormStart", "FormStep"] as const;

/** One event per question (FormStep_1, FormStep_2…), sent next to FormStep. */
export const META_MAX_NUMBERED_STEP = 20;
export type MetaNumberedStepEventName = `FormStep_${number}`;
const NUMBERED_STEP_PATTERN = /^FormStep_([1-9]|1[0-9]|20)$/;

export type MetaRelayedEventName =
  | (typeof META_RELAYED_EVENTS)[number]
  | MetaNumberedStepEventName;

/** Events registered as custom events (fbq trackCustom). */
export const META_CUSTOM_EVENTS = new Set<string>(["FormStart", "FormStep"]);

export function isMetaCustomEvent(eventName: string): boolean {
  return META_CUSTOM_EVENTS.has(eventName) || NUMBERED_STEP_PATTERN.test(eventName);
}

export function metaNumberedStepEvent(
  stepNumber: number,
): MetaNumberedStepEventName | null {
  if (!Number.isInteger(stepNumber) || stepNumber < 1) return null;
  if (stepNumber > META_MAX_NUMBERED_STEP) return null;
  return `FormStep_${stepNumber}`;
}

export type MetaCustomData = {
  step_number?: number;
  step_key?: string;
};

/** Body sent by the browser to /api/meta/events. */
export type MetaRelayRequestBody = {
  event_name: MetaRelayedEventName;
  event_id: string;
  event_source_url: string;
  marketing_consent: boolean;
  custom_data?: MetaCustomData;
  fbclid?: string;
};

/** Lead tracking context sent alongside /api/leads (no PII). */
export type MetaLeadTracking = {
  eventId: string;
  marketingConsent: boolean;
  eventSourceUrl: string;
};

const EVENT_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const STEP_KEY_PATTERN = /^[A-Za-z]{1,40}$/;

export function isMetaRelayedEvent(value: unknown): value is MetaRelayedEventName {
  return (
    typeof value === "string" &&
    ((META_RELAYED_EVENTS as readonly string[]).includes(value) ||
      NUMBERED_STEP_PATTERN.test(value))
  );
}

export function isValidMetaEventId(value: unknown): value is string {
  return typeof value === "string" && EVENT_ID_PATTERN.test(value);
}

/** Keeps only step_number (1–50) and step_key (letters only). */
export function sanitizeMetaCustomData(value: unknown): MetaCustomData | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  const raw = value as Record<string, unknown>;
  const result: MetaCustomData = {};
  if (
    typeof raw.step_number === "number" &&
    Number.isInteger(raw.step_number) &&
    raw.step_number >= 1 &&
    raw.step_number <= 50
  ) {
    result.step_number = raw.step_number;
  }
  if (typeof raw.step_key === "string" && STEP_KEY_PATTERN.test(raw.step_key)) {
    result.step_key = raw.step_key;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

/** Random id shared by the Pixel event and its CAPI twin (deduplication). */
export function createMetaEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}
