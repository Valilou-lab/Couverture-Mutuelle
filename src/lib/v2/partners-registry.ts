/**
 * Server allowlist of V2 partners.
 * The browser may only display partners returned by `/api/v2/eligibility`
 * (resolved from this registry). It cannot invent ids, names, or privacy URLs.
 *
 * A partner without `privacyPolicyUrl` must stay `active: false` and must never
 * be returned as distributable.
 */

export type V2PartnerContactChannel = "phone" | "email" | "sms";

export type V2PartnerId =
  | "santiane"
  | "assu_france"
  | "iki"
  | "skarlett"
  | "2a_assurances"
  | "aveyronnaise";

export type V2PartnerGoogleRating = {
  rating: number;
  reviewCount: number;
  /** ISO date of last manual sync from Google Business Profile. */
  syncedAt: string;
};

export type V2RegisteredPartner = {
  id: V2PartnerId;
  name: string;
  legalName?: string;
  logo?: string;
  websiteUrl: string;
  privacyPolicyUrl: string | null;
  contactChannels: V2PartnerContactChannel[];
  active: boolean;
  /**
   * Optional landline shown on the /devis confirmation screen.
   * When missing, the card shows logo + name only (no « Enregistrer »).
   */
  confirmationPhoneDisplay?: string;
  /** E.164 or national digits for tel: / vCard — required with display. */
  confirmationPhoneTel?: string;
  /**
   * Google Business Profile figures — display only, never link out.
   * Omit when the fiche is missing or unreliable.
   */
  googleRating?: V2PartnerGoogleRating;
};

export const V2_PARTNERS_REGISTRY: Record<V2PartnerId, V2RegisteredPartner> = {
  santiane: {
    id: "santiane",
    name: "Santiane",
    logo: "/images/partners/santiane.webp",
    websiteUrl: "https://www.santiane.fr/",
    privacyPolicyUrl: "https://www.santiane.fr/politique-de-confidentialite",
    contactChannels: ["phone", "email"],
    active: true,
    googleRating: {
      rating: 4.5,
      reviewCount: 5932,
      syncedAt: "2026-11-17",
    },
  },
  assu_france: {
    id: "assu_france",
    name: "ASSU-FRANCE",
    logo: "/images/partners/assu-france.jpg",
    websiteUrl: "https://assu-france.info/",
    privacyPolicyUrl: "https://assu-france.info/politique-rgpd/",
    contactChannels: ["phone", "email"],
    active: false,
  },
  iki: {
    id: "iki",
    name: "IKI Assurance",
    logo: "/images/partners/iki.jpg",
    websiteUrl: "https://iki-assurances.fr/",
    privacyPolicyUrl:
      "https://iki-assurances.fr/politique-de-protection-des-donnees",
    contactChannels: ["phone", "email"],
    active: true,
    googleRating: {
      rating: 4.8,
      reviewCount: 2541,
      syncedAt: "2026-11-17",
    },
  },
  skarlett: {
    id: "skarlett",
    name: "Skarlett",
    logo: "/images/partners/skarlett.webp",
    websiteUrl: "https://www.skarlett.fr/",
    privacyPolicyUrl: "https://www.skarlett.fr/politique-de-confidentialite1",
    contactChannels: ["phone", "email"],
    active: true,
    googleRating: {
      rating: 4.7,
      reviewCount: 355,
      syncedAt: "2026-11-17",
    },
  },
  "2a_assurances": {
    id: "2a_assurances",
    name: "2A L'Adour",
    legalName: "ASSURANCES DE L'ADOUR",
    logo: "/images/partners/2a-ladour.png",
    websiteUrl: "https://2a-assurances.fr/",
    privacyPolicyUrl: "https://2a-assurances.fr/politique-de-confidentialite/",
    contactChannels: ["phone", "email"],
    active: true,
    // Google Knowledge Graph /g/11b75dszgc — Biarritz, 2a-assurances.fr
    googleRating: {
      rating: 4.1,
      reviewCount: 661,
      syncedAt: "2026-11-17",
    },
  },
  aveyronnaise: {
    id: "aveyronnaise",
    name: "L'Aveyronnaise d'Assurances",
    logo: "/images/partners/aveyronnaise.webp",
    websiteUrl: "https://www.laveyronnaisedassurances.fr/",
    privacyPolicyUrl: "https://www.laveyronnaisedassurances.fr/",
    contactChannels: ["phone", "email"],
    active: true,
    googleRating: {
      rating: 4.8,
      reviewCount: 37,
      syncedAt: "2026-11-17",
    },
  },
};

export function isV2PartnerId(value: string): value is V2PartnerId {
  return Object.prototype.hasOwnProperty.call(V2_PARTNERS_REGISTRY, value);
}

/** Distributable = active + official privacy policy configured. */
export function isV2PartnerDistributable(
  partner: V2RegisteredPartner,
): boolean {
  return (
    partner.active &&
    typeof partner.privacyPolicyUrl === "string" &&
    partner.privacyPolicyUrl.length > 0
  );
}

export function getV2PartnerById(
  id: string,
): V2RegisteredPartner | null {
  if (!isV2PartnerId(id)) return null;
  return V2_PARTNERS_REGISTRY[id];
}

/**
 * Privacy URL from the allowlist only (never from free browser input).
 * Returns null for unknown / non-distributable partners.
 */
export function getV2PartnerPrivacyPolicyUrl(id: string): string | null {
  const partner = getV2PartnerById(id);
  if (!partner || !isV2PartnerDistributable(partner)) return null;
  return partner.privacyPolicyUrl;
}

/** Confirmation callback number, only when both display + tel are set. */
export function getV2PartnerConfirmationPhone(
  id: string,
): { display: string; tel: string } | null {
  const partner = getV2PartnerById(id);
  if (!partner) return null;
  const display = partner.confirmationPhoneDisplay?.trim();
  const tel = partner.confirmationPhoneTel?.trim();
  if (!display || !tel) return null;
  return { display, tel };
}

/** Google rating for display-only trust (never linked). */
export function getV2PartnerGoogleRating(
  id: string,
): V2PartnerGoogleRating | null {
  return getV2PartnerById(id)?.googleRating ?? null;
}

/** French compact label, e.g. "4,5/5 · 5 932 avis". */
export function formatV2PartnerGoogleRating(
  rating: V2PartnerGoogleRating,
): string {
  const score = Number.isInteger(rating.rating)
    ? String(rating.rating)
    : rating.rating.toFixed(1).replace(".", ",");
  const count = new Intl.NumberFormat("fr-FR").format(rating.reviewCount);
  return `${score}/5 · ${count} avis`;
}

/** Resolve allowlisted distributable partners; unknown / inactive ids are dropped. */
export function resolveV2PartnersFromIds(
  ids: readonly string[],
): V2RegisteredPartner[] {
  const seen = new Set<V2PartnerId>();
  const partners: V2RegisteredPartner[] = [];
  for (const raw of ids) {
    if (!isV2PartnerId(raw) || seen.has(raw)) continue;
    const partner = V2_PARTNERS_REGISTRY[raw];
    if (!isV2PartnerDistributable(partner)) continue;
    seen.add(raw);
    partners.push(partner);
  }
  return partners;
}

