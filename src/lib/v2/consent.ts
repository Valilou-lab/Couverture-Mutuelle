import type { V2RegisteredPartner } from "./partners-registry";

/** Bump when the V2 partner-consent wording template changes. */
export const V2_PARTNER_CONSENT_VERSION = "2026-10-30.v2.partners.2";

/** French list: "A", "A et B", "A, B et C". */
export function formatPartnerNamesFr(names: string[]): string {
  if (names.length === 0) return "les organismes éligibles";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} et ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`;
}

function startsWithVowelSound(value: string): boolean {
  return /^[aeiouyhàâäéèêëïîôùûü]/i.test(value.trim());
}

/**
 * Canonical V2 partner consent text.
 * Must be generated from server-validated partners only (never free browser text).
 */
export function buildV2PartnerConsentText(
  partners: readonly { name: string }[],
): string {
  const names = partners.map((partner) => partner.name);
  const list = formatPartnerNamesFr(names);
  const singular = partners.length <= 1;
  const verb = singular ? "me contacte" : "me contactent";
  const possessive = singular ? "ses" : "leurs";
  const linker = startsWithVowelSound(list) ? "qu’" : "que ";
  return `J’accepte ${linker}${list} ${verb} par téléphone et/ou e-mail afin de me présenter ${possessive} offres correspondant à ma demande.`;
}

export type V2ConsentRecord = {
  partnerIds: string[];
  partnerNames: string[];
  consentText: string;
  consentVersion: string;
  /** ISO server timestamp — set when the lead is accepted. */
  consentDatetime?: string;
};

export function buildV2ConsentRecord(
  partners: readonly V2RegisteredPartner[],
  consentDatetime?: string,
): V2ConsentRecord {
  return {
    partnerIds: partners.map((partner) => partner.id),
    partnerNames: partners.map((partner) => partner.name),
    consentText: buildV2PartnerConsentText(partners),
    consentVersion: V2_PARTNER_CONSENT_VERSION,
    ...(consentDatetime ? { consentDatetime } : {}),
  };
}
