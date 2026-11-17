import type { V2RegisteredPartner } from "./partners-registry";

/** Bump when the V2 partner-consent wording template changes. */
export const V2_PARTNER_CONSENT_VERSION = "2026-11-17.v2.partners.6";

/** French list: "A", "A et B", "A, B et C". */
export function formatPartnerNamesFr(names: string[]): string {
  if (names.length === 0) return "les organismes éligibles";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} et ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`;
}

export type V2BrokerCountCopy = {
  title: string;
  intro: string;
  consent: string;
  footer: string;
  cta: string;
};

/**
 * All partner-step copy driven by the real precheck count — never hardcode.
 */
export function buildV2BrokerCountCopy(count: number): V2BrokerCountCopy {
  const n = Math.max(0, Math.floor(count));

  if (n <= 1) {
    return {
      title: "1 courtier peut vous proposer un devis",
      intro:
        "Pour obtenir un devis adapté à votre profil, votre demande est confiée à ce courtier :",
      consent:
        "J’accepte que ce courtier me contacte par téléphone, SMS ou e-mail pour me proposer un devis de complémentaire santé.",
      footer:
        "Vos informations ne sont transmises qu’à ce courtier, et à personne d’autre.",
      cta: "Recevoir mon devis",
    };
  }

  if (n === 2) {
    return {
      title: "2 courtiers peuvent vous proposer un devis",
      intro:
        "Pour obtenir 2 devis à comparer, votre demande est confiée à ces 2 courtiers :",
      consent:
        "J’accepte que ces 2 courtiers me contactent par téléphone, SMS ou e-mail pour me proposer un devis de complémentaire santé.",
      footer:
        "Vos informations ne sont transmises qu’à ces 2 courtiers, et à personne d’autre.",
      cta: "Recevoir mes devis",
    };
  }

  return {
    title: `${n} courtiers peuvent vous proposer un devis`,
    intro: `Pour obtenir ${n} devis à comparer, votre demande est confiée à ces ${n} courtiers :`,
    consent: `J’accepte que ces ${n} courtiers me contactent par téléphone, SMS ou e-mail pour me proposer un devis de complémentaire santé.`,
    footer: `Vos informations ne sont transmises qu’à ces ${n} courtiers, et à personne d’autre.`,
    cta: "Recevoir mes devis",
  };
}

/**
 * Canonical V2 partner consent text.
 * Must be generated from server-validated partners only (never free browser text).
 */
export function buildV2PartnerConsentText(
  partners: readonly { name: string }[],
): string {
  return buildV2BrokerCountCopy(partners.length).consent;
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
