/**
 * Display helpers for V2 partner cards (logos only).
 * Consent wording lives in `src/lib/v2/consent.ts` (shared with the server).
 * Partner names / privacy URLs always come from the registry via eligibility ids.
 */

import {
  getV2PartnerById,
  getV2PartnerPrivacyPolicyUrl,
} from "@/lib/v2/partners-registry";

export function getV2PartnerLogoSrc(id: string, _name?: string): string | null {
  return getV2PartnerById(id)?.logo ?? null;
}

export { getV2PartnerPrivacyPolicyUrl };

export {
  buildV2PartnerConsentText as buildDynamicConsentText,
} from "@/lib/v2/consent";
