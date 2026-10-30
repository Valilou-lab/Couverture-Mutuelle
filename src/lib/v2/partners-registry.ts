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

export type V2RegisteredPartner = {
  id: V2PartnerId;
  name: string;
  legalName?: string;
  logo?: string;
  websiteUrl: string;
  privacyPolicyUrl: string | null;
  contactChannels: V2PartnerContactChannel[];
  active: boolean;
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
  },
  assu_france: {
    id: "assu_france",
    name: "ASSU-FRANCE",
    logo: "/images/partners/assu-france.jpg",
    websiteUrl: "https://assu-france.info/",
    privacyPolicyUrl: "https://assu-france.info/politique-rgpd/",
    contactChannels: ["phone", "email"],
    active: true,
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
  },
  skarlett: {
    id: "skarlett",
    name: "Skarlett",
    logo: "/images/partners/skarlett.webp",
    websiteUrl: "https://www.skarlett.fr/",
    privacyPolicyUrl: "https://www.skarlett.fr/politique-de-confidentialite1",
    contactChannels: ["phone", "email"],
    active: true,
  },
  "2a_assurances": {
    id: "2a_assurances",
    name: "2A Assurances",
    legalName: "ASSURANCES DE L'ADOUR",
    websiteUrl: "https://2a-assurances.fr/",
    privacyPolicyUrl: "https://2a-assurances.fr/politique-de-confidentialite/",
    contactChannels: ["phone", "email"],
    active: true,
  },
  aveyronnaise: {
    id: "aveyronnaise",
    name: "L'Aveyronnaise d'Assurances",
    logo: "/images/partners/aveyronnaise.webp",
    websiteUrl: "https://www.laveyronnaisedassurances.fr/",
    /** Official privacy URL pending — keep out of V2 distribution. */
    privacyPolicyUrl: null,
    contactChannels: ["phone", "email"],
    active: false,
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

/** Scaffold mock: all currently distributable partners until the real engine lands. */
export function getMockEligiblePartners(): V2RegisteredPartner[] {
  return (Object.keys(V2_PARTNERS_REGISTRY) as V2PartnerId[])
    .map((id) => V2_PARTNERS_REGISTRY[id])
    .filter(isV2PartnerDistributable);
}
