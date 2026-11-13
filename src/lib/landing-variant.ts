/**
 * Internal LP version tagging for ads A/B (V1 vs V2).
 * Does not change Vertikl field names, GTM conversion events, or pixels.
 * Pathname is the source of truth — no cookie, no redirect.
 */

export const PAID_LANDING_IDS = [
  "home",
  "tranches-age",
  "reste-a-charge",
  "tiktok",
] as const;

export type PaidLandingId = (typeof PAID_LANDING_IDS)[number];
export type LandingVersion = "v1" | "v2";

export type LandingVariant = {
  lp_id: PaidLandingId | "other";
  lp_version: LandingVersion;
};

const BY_PATH: Record<string, LandingVariant> = {
  "/": { lp_id: "home", lp_version: "v1" },
  "/home-2": { lp_id: "home", lp_version: "v2" },
  "/tranches-age": { lp_id: "tranches-age", lp_version: "v1" },
  "/tranches-age-2": { lp_id: "tranches-age", lp_version: "v2" },
  "/reste-a-charge": { lp_id: "reste-a-charge", lp_version: "v1" },
  "/reste-a-charge-2": { lp_id: "reste-a-charge", lp_version: "v2" },
  "/tiktok": { lp_id: "tiktok", lp_version: "v1" },
  "/tiktok-2": { lp_id: "tiktok", lp_version: "v2" },
};

function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed || trimmed === "/") return "/";
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return normalizePathname(new URL(trimmed).pathname);
    }
  } catch {
    /* keep raw path */
  }
  const path = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;
  const stripped = path.replace(/\/+$/, "");
  return stripped || "/";
}

export function parseLandingVariant(pathname: string): LandingVariant {
  return BY_PATH[normalizePathname(pathname)] ?? { lp_id: "other", lp_version: "v1" };
}

export function isPaidLandingPath(pathname: string): boolean {
  return parseLandingVariant(pathname).lp_id !== "other";
}
