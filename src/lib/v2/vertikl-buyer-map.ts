import type { V2PartnerId } from "./partners-registry";
import {
  getV2PartnerById,
  isV2PartnerDistributable,
} from "./partners-registry";

/**
 * Vertikl buyer UUID → internal V2 partner id.
 * Eligibility always comes from Vertikl; this map only enriches display.
 */
export const VERTIKL_BUYER_ID_TO_PARTNER_ID: Record<string, V2PartnerId> = {
  // Observed from live precheck (campaign fed07381-…)
  "a7f36c2d-1196-4b7e-a607-334f41a913eb": "iki", // Vertikl name: Filiassur
  "7bd46d26-abc0-4167-9404-bed4fe4a5754": "skarlett",
  "95dbb4f1-2733-4efc-83bb-ac432777c2d3": "santiane",
  // SPVIE / Aveyronnaise UUIDs: fill when observed in a live precheck response
};

/**
 * Vertikl commercial name (normalized) → internal V2 partner id.
 * Used when the buyer UUID is not yet known in VERTIKL_BUYER_ID_TO_PARTNER_ID.
 */
const VERTIKL_BUYER_NAME_TO_PARTNER_ID: Record<string, V2PartnerId> = {
  filiassur: "iki",
  skarlett: "skarlett",
  santiane: "santiane",
  spvie: "2a_assurances",
  "2a l'adour": "2a_assurances",
  "2a ladour": "2a_assurances",
  aveyronnaise: "aveyronnaise",
  "l'aveyronnaise": "aveyronnaise",
  "l'aveyronnaise d'assurances": "aveyronnaise",
  "l aveyronnaise d assurances": "aveyronnaise",
};

function normalizeBuyerName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolvePartnerIdFromVertiklBuyer(input: {
  id: string;
  name: string;
}): V2PartnerId | null {
  const byId = VERTIKL_BUYER_ID_TO_PARTNER_ID[input.id.trim()];
  if (byId) return byId;

  const normalized = normalizeBuyerName(input.name);
  if (VERTIKL_BUYER_NAME_TO_PARTNER_ID[normalized]) {
    return VERTIKL_BUYER_NAME_TO_PARTNER_ID[normalized]!;
  }

  // Loose contains match for longer commercial labels.
  for (const [needle, partnerId] of Object.entries(
    VERTIKL_BUYER_NAME_TO_PARTNER_ID,
  )) {
    if (normalized.includes(needle)) return partnerId;
  }

  return null;
}

export type MappedVertiklBuyer = {
  /** Display / consent id: registry id when mapped, else Vertikl buyer UUID. */
  id: string;
  name: string;
  vertiklBuyerId: string;
  partnerId: V2PartnerId | null;
  logo: string | null;
  privacyPolicyUrl: string | null;
};

export function mapVertiklBuyerToDisplay(input: {
  id: string;
  name: string;
}): MappedVertiklBuyer {
  const vertiklBuyerId = input.id.trim();
  const partnerId = resolvePartnerIdFromVertiklBuyer(input);
  const registered = partnerId ? getV2PartnerById(partnerId) : null;
  const distributable =
    registered && isV2PartnerDistributable(registered) ? registered : null;

  return {
    id: distributable?.id ?? vertiklBuyerId,
    name: distributable?.name ?? input.name.trim(),
    vertiklBuyerId,
    partnerId: distributable?.id ?? null,
    logo: distributable?.logo ?? null,
    privacyPolicyUrl: distributable?.privacyPolicyUrl ?? null,
  };
}
