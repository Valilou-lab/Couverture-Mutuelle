import "server-only";

import { isInternalReferrer } from "@/lib/acquisition";

export const VERTIKL_ACQUISITION_SOURCES = [
  "instagram_organic",
  "instagram_paid",
  "facebook_organic",
  "facebook_paid",
  "google_paid",
  "tiktok_organic",
  "tiktok_paid",
  "referral",
  "direct",
  "meta_paid_unattributed",
] as const;

export type VertiklAcquisitionSource =
  (typeof VERTIKL_ACQUISITION_SOURCES)[number];

/** Single mapping: normalized source → env var holding the Vertikl campaignId. */
export const VERTIKL_CAMPAIGN_ID_ENV = {
  instagram_organic: "VERTIKL_CAMPAIGN_ID_INSTAGRAM_ORGANIC",
  instagram_paid: "VERTIKL_CAMPAIGN_ID_META_INSTAGRAM_PAID",
  facebook_organic: "VERTIKL_CAMPAIGN_ID_FACEBOOK_ORGANIC",
  facebook_paid: "VERTIKL_CAMPAIGN_ID_META_FACEBOOK_PAID",
  google_paid: "VERTIKL_CAMPAIGN_ID_GOOGLE_PAID",
  tiktok_organic: "VERTIKL_CAMPAIGN_ID_TIKTOK_ORGANIC",
  tiktok_paid: "VERTIKL_CAMPAIGN_ID_TIKTOK_PAID",
  referral: "VERTIKL_CAMPAIGN_ID_REFERRAL",
  direct: "VERTIKL_CAMPAIGN_ID_DIRECT",
  meta_paid_unattributed: "VERTIKL_CAMPAIGN_ID_META_PAID_UNATTRIBUTED",
} as const satisfies Record<VertiklAcquisitionSource, string>;

const PAID_MEDIUMS = new Set(["cpc", "paid", "paid_social", "paidsocial"]);
const GOOGLE_PAID_MEDIUMS = new Set(["cpc", "paid"]);

export type VertiklSourceInput = {
  utm_source?: string;
  utm_medium?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
};

function normalizeToken(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeMedium(value: string | undefined): string {
  return normalizeToken(value).replace(/[-\s]/g, "_");
}

function stripWww(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

function parseHostname(url: string): string | null {
  if (!url.trim()) return null;
  try {
    return stripWww(new URL(url).hostname);
  } catch {
    return null;
  }
}

function isInstagramSource(source: string): boolean {
  return source === "instagram" || source === "ig";
}

function isFacebookSource(source: string): boolean {
  return source === "facebook" || source === "fb";
}

function isTikTokSource(source: string): boolean {
  return source === "tiktok" || source === "tt";
}

function isGoogleSource(source: string): boolean {
  return source === "google";
}

function isInstagramHost(host: string): boolean {
  return (
    host === "instagram.com" ||
    host.endsWith(".instagram.com") ||
    host === "instagr.am"
  );
}

function isFacebookHost(host: string): boolean {
  return (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.com" ||
    host.endsWith(".fb.com") ||
    host === "fb.me"
  );
}

function isTikTokHost(host: string): boolean {
  return host === "tiktok.com" || host.endsWith(".tiktok.com");
}

function externalReferrerHost(referrer: string | undefined): string | null {
  const raw = referrer?.trim() ?? "";
  if (!raw || isInternalReferrer(raw)) return null;
  return parseHostname(raw);
}

/**
 * Normalize first-touch signals into a Vertikl routing source.
 * Does not persist anything — uses the already-captured first-touch payload.
 *
 * Priority: explicit UTM pairs → click IDs → source-only UTM → referrer → direct.
 */
export function resolveVertiklAcquisitionSource(
  input: VertiklSourceInput,
): VertiklAcquisitionSource {
  const source = normalizeToken(input.utm_source);
  const medium = normalizeMedium(input.utm_medium);
  const hasGclid = Boolean(input.gclid?.trim());
  const hasFbclid = Boolean(input.fbclid?.trim());
  const referrerHost = externalReferrerHost(input.referrer);

  if (isInstagramSource(source) && medium === "organic") {
    return "instagram_organic";
  }
  if (isInstagramSource(source) && PAID_MEDIUMS.has(medium)) {
    return "instagram_paid";
  }
  if (isFacebookSource(source) && medium === "organic") {
    return "facebook_organic";
  }
  if (isFacebookSource(source) && PAID_MEDIUMS.has(medium)) {
    return "facebook_paid";
  }
  if (isGoogleSource(source) && GOOGLE_PAID_MEDIUMS.has(medium)) {
    return "google_paid";
  }
  if (isTikTokSource(source) && medium === "organic") {
    return "tiktok_organic";
  }
  if (isTikTokSource(source) && PAID_MEDIUMS.has(medium)) {
    return "tiktok_paid";
  }

  if (hasGclid) return "google_paid";

  const instagramIdentifiable =
    isInstagramSource(source) ||
    (referrerHost !== null && isInstagramHost(referrerHost));
  const facebookIdentifiable =
    isFacebookSource(source) ||
    (referrerHost !== null && isFacebookHost(referrerHost));

  if (hasFbclid && instagramIdentifiable) return "instagram_paid";
  if (hasFbclid && facebookIdentifiable) return "facebook_paid";
  if (hasFbclid) return "meta_paid_unattributed";

  if (isInstagramSource(source)) return "instagram_organic";
  if (isFacebookSource(source)) return "facebook_organic";
  if (isTikTokSource(source)) return "tiktok_organic";

  if (referrerHost && isInstagramHost(referrerHost)) return "instagram_organic";
  if (referrerHost && isFacebookHost(referrerHost)) return "facebook_organic";
  if (referrerHost && isTikTokHost(referrerHost)) return "tiktok_organic";
  if (referrerHost) return "referral";

  return "direct";
}

export function getVertiklCampaignId(
  source: VertiklAcquisitionSource,
): string | undefined {
  const envName = VERTIKL_CAMPAIGN_ID_ENV[source];
  const value = process.env[envName]?.trim();
  return value || undefined;
}

export function resolveVertiklCampaign(input: VertiklSourceInput): {
  source: VertiklAcquisitionSource;
  campaignId: string | undefined;
  campaignEnv: string;
} {
  const source = resolveVertiklAcquisitionSource(input);
  return {
    source,
    campaignId: getVertiklCampaignId(source),
    campaignEnv: VERTIKL_CAMPAIGN_ID_ENV[source],
  };
}
