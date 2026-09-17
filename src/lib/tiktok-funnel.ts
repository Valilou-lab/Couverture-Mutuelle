/**
 * Behavioral funnel events for the /tiktok landing only.
 * DataLayer-only: GTM must map these to TikTok if needed.
 * Never include PII, form answers, or health-related fields.
 */

export const TIKTOK_FUNNEL_PAGE = "/tiktok";

export type TikTokFunnelEventName =
  | "LandingPageView"
  | "CTA_Click"
  | "Form_View"
  | "Form_Start"
  | "Form_Step_Completed"
  | "SubmitForm";

type OnceFlag =
  | "LandingPageView"
  | "CTA_Click"
  | "Form_View"
  | "Form_Start"
  | "SubmitForm";

type FunnelState = {
  loadId: string;
  once: Record<OnceFlag, boolean>;
  steps: Set<string>;
};

const CTA_CLICKED_EVENT = "tiktok-funnel-cta";

function emptyState(loadId: string): FunnelState {
  return {
    loadId,
    once: {
      LandingPageView: false,
      CTA_Click: false,
      Form_View: false,
      Form_Start: false,
      SubmitForm: false,
    },
    steps: new Set(),
  };
}

function getState(): FunnelState | null {
  if (typeof window === "undefined") return null;
  const loadId = String(performance.timeOrigin);
  const root = window as Window & { __cmTikTokFunnel?: FunnelState };
  if (!root.__cmTikTokFunnel || root.__cmTikTokFunnel.loadId !== loadId) {
    root.__cmTikTokFunnel = emptyState(loadId);
  }
  return root.__cmTikTokFunnel;
}

function ensureDataLayer(): Array<Record<string, unknown>> {
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  return window.dataLayer;
}

function debug(eventName: TikTokFunnelEventName, payload: Record<string, string>) {
  if (process.env.NODE_ENV === "development") {
    console.debug("[tiktok-funnel]", eventName, payload);
  }
}

function pushEvent(
  eventName: TikTokFunnelEventName,
  extra: { step?: string } = {},
): void {
  if (typeof window === "undefined") return;

  const payload: Record<string, string> = {
    event: eventName,
    event_name: eventName,
    page: TIKTOK_FUNNEL_PAGE,
  };
  if (extra.step) {
    payload.step = extra.step;
  }

  ensureDataLayer().push(payload);
  debug(eventName, payload);
}

function fireOnce(flag: OnceFlag, eventName: TikTokFunnelEventName): boolean {
  const state = getState();
  if (!state || state.once[flag]) return false;
  state.once[flag] = true;
  pushEvent(eventName);
  return true;
}

export function trackTikTokLandingPageView(): void {
  fireOnce("LandingPageView", "LandingPageView");
}

export function trackTikTokCtaClick(): void {
  const fired = fireOnce("CTA_Click", "CTA_Click");
  if (fired) {
    window.dispatchEvent(new Event(CTA_CLICKED_EVENT));
  }
}

export function hasTikTokCtaClicked(): boolean {
  return Boolean(getState()?.once.CTA_Click);
}

export function onTikTokCtaClick(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(CTA_CLICKED_EVENT, listener);
  return () => window.removeEventListener(CTA_CLICKED_EVENT, listener);
}

export function trackTikTokFormView(): void {
  if (!hasTikTokCtaClicked()) return;
  fireOnce("Form_View", "Form_View");
}

export function trackTikTokFormStart(): void {
  fireOnce("Form_Start", "Form_Start");
}

export function trackTikTokFormStepCompleted(stepNumber: number): void {
  if (!Number.isInteger(stepNumber) || stepNumber < 1) return;
  const state = getState();
  if (!state) return;
  const step = `step_${stepNumber}`;
  if (state.steps.has(step)) return;
  state.steps.add(step);
  pushEvent("Form_Step_Completed", { step });
}

export function trackTikTokSubmitForm(): void {
  fireOnce("SubmitForm", "SubmitForm");
}
