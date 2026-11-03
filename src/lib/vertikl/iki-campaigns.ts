import "server-only";

import {
  resolveIkiCampaignFromEnv,
  type IkiCampaignRouting,
  type IkiFlow,
} from "./iki-campaigns-core";

export {
  IKI_CAMPAIGN_ENV_BY_FLOW,
  IKI_CAMPAIGN_IDS,
  IKI_DOCUMENTED_CAMPAIGN_IDS,
  IKI_META_LP_CAMPAIGN_ENV,
  IKI_META_FORM_CAMPAIGN_ENV,
  IKI_CHATBOT_CAMPAIGN_ENV,
  ikiLandingPageLooksLikeIki,
  isIkiFlow,
  type IkiCampaignRouting,
  type IkiFlow,
} from "./iki-campaigns-core";

/**
 * IKI Vertikl campaign resolution.
 * brand = iki (caller); flow selects the campaign from the real entry point.
 * `/iki` → `resolveIkiCampaign("lp")`. Instant Form / Chatbot entry points
 * will call `meta_form` / `chatbot` when they exist — do not infer from UTMs.
 */
export function resolveIkiCampaign(
  flow: IkiFlow,
  input: { landingPageUrl?: string } = {},
): IkiCampaignRouting {
  return resolveIkiCampaignFromEnv(process.env, flow, input);
}
