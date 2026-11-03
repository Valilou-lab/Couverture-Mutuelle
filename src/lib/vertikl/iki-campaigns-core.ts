/**
 * Pure IKI Vertikl campaign routing (no server-only).
 *
 * brand = iki is decided by the caller (`consentVariant === "iki"`).
 * flow selects the Vertikl campaign and must come from the real entry point
 * (not from UTMs). Today only `/iki` calls this with `flow: "lp"`.
 */

export type IkiFlow = "lp" | "meta_form" | "chatbot";

export const IKI_CAMPAIGN_ENV_BY_FLOW: Record<IkiFlow, string> = {
  lp: "VERTIKL_IKI_META_LP_CAMPAIGN_ID",
  meta_form: "VERTIKL_IKI_META_FORM_CAMPAIGN_ID",
  chatbot: "VERTIKL_IKI_CHATBOT_CAMPAIGN_ID",
};

/** Canonical campaign IDs (also the expected Production env values). */
export const IKI_CAMPAIGN_IDS: Record<IkiFlow, string> = {
  lp: "ce62a19e-4624-4045-9cd5-8ded57f7f333",
  meta_form: "45bf442a-0347-4559-9c70-13593768ff27",
  chatbot: "7aea1666-52fb-42fd-8ebc-317af62f8af5",
};

/** @deprecated Prefer `IKI_CAMPAIGN_IDS` — kept for existing script imports. */
export const IKI_DOCUMENTED_CAMPAIGN_IDS = IKI_CAMPAIGN_IDS;

export const IKI_META_LP_CAMPAIGN_ENV = IKI_CAMPAIGN_ENV_BY_FLOW.lp;
export const IKI_META_FORM_CAMPAIGN_ENV = IKI_CAMPAIGN_ENV_BY_FLOW.meta_form;
export const IKI_CHATBOT_CAMPAIGN_ENV = IKI_CAMPAIGN_ENV_BY_FLOW.chatbot;

export type IkiCampaignRouting = {
  brand: "iki";
  flow: IkiFlow;
  campaignId: string | undefined;
  campaignEnv: string;
  /** Soft guard for LP only: true when landingPageUrl looks like /iki (or unavailable). */
  landingPageLooksLikeIki: boolean;
};

function pathnameFromUrl(landingPageUrl: string | undefined): string | null {
  const raw = landingPageUrl?.trim() ?? "";
  if (!raw) return null;
  try {
    return new URL(raw).pathname;
  } catch {
    const pathOnly = raw.split(/[?#]/)[0] ?? "";
    return pathOnly || null;
  }
}

/** True when pathname is `/iki` or under `/iki/…`. Empty URL → unknown (not false). */
export function ikiLandingPageLooksLikeIki(
  landingPageUrl: string | undefined,
): boolean {
  const pathname = pathnameFromUrl(landingPageUrl);
  if (!pathname) return true;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized === "/iki" || normalized.startsWith("/iki/");
}

export function isIkiFlow(value: unknown): value is IkiFlow {
  return value === "lp" || value === "meta_form" || value === "chatbot";
}

/**
 * Resolve the Vertikl campaign for an IKI lead.
 * `flow` must be supplied by the real entry point (LP / Instant Form / Chatbot).
 */
export function resolveIkiCampaignFromEnv(
  env: Record<string, string | undefined>,
  flow: IkiFlow,
  input: { landingPageUrl?: string } = {},
): IkiCampaignRouting {
  const campaignEnv = IKI_CAMPAIGN_ENV_BY_FLOW[flow];
  const campaignId = env[campaignEnv]?.trim() || undefined;
  return {
    brand: "iki",
    flow,
    campaignId,
    campaignEnv,
    landingPageLooksLikeIki:
      flow === "lp"
        ? ikiLandingPageLooksLikeIki(input.landingPageUrl)
        : true,
  };
}
