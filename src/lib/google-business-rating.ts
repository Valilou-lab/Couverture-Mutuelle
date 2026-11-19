/**
 * Couverture Mutuelle — Google Business Profile rating.
 * Display-only trust signal: never render as an outbound link from the funnel.
 *
 * Source fiche (do not expose to visitors):
 * https://share.google/UNwXMQnv5q7EU8azi
 * Knowledge Graph: /g/11_0bcm_22
 * Places ID: ChIJVanNySuftqKE3If4ExI0uA
 *
 * Live sync: set GOOGLE_PLACES_API_KEY (+ optional GOOGLE_PLACE_ID) on the
 * server. Without a key, FALLBACK figures are shown (update when the fiche
 * changes until the key is configured).
 */

export const GOOGLE_PLACE_ID_DEFAULT = "ChIJVanNySuftqKE3If4ExI0uA";

/** Manual fallback when Places API is unavailable / not configured. */
export const GOOGLE_BUSINESS_RATING_FALLBACK = {
  rating: 5,
  reviewCount: 5,
  /** ISO date of last manual check of the Google fiche. */
  syncedAt: "2026-11-19",
  source: "fallback" as const,
};

export type GoogleBusinessRating = {
  rating: number;
  reviewCount: number;
  syncedAt: string;
  source: "places" | "fallback";
};

/** @deprecated Prefer getGoogleBusinessRating() — kept for sync formatters. */
export const GOOGLE_BUSINESS_RATING = GOOGLE_BUSINESS_RATING_FALLBACK;

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6 hours

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function clampRating(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < 1 || value > 5) return null;
  return Math.round(value * 10) / 10;
}

function clampCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const n = Math.floor(value);
  return n >= 0 ? n : null;
}

/**
 * Fetch live rating + review count from Places API (New).
 * Falls back to GOOGLE_BUSINESS_RATING_FALLBACK when unset / failing.
 */
export async function getGoogleBusinessRating(): Promise<GoogleBusinessRating> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId =
    process.env.GOOGLE_PLACE_ID?.trim() || GOOGLE_PLACE_ID_DEFAULT;

  if (!apiKey) {
    return { ...GOOGLE_BUSINESS_RATING_FALLBACK };
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.warn(
        "[google-business-rating] Places API error",
        res.status,
        await res.text().catch(() => ""),
      );
      return { ...GOOGLE_BUSINESS_RATING_FALLBACK };
    }

    const body = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
    };
    const rating = clampRating(body.rating);
    const reviewCount = clampCount(body.userRatingCount);

    if (rating == null || reviewCount == null) {
      return { ...GOOGLE_BUSINESS_RATING_FALLBACK };
    }

    return {
      rating,
      reviewCount,
      syncedAt: todayIso(),
      source: "places",
    };
  } catch (err) {
    console.warn("[google-business-rating] Places fetch failed", err);
    return { ...GOOGLE_BUSINESS_RATING_FALLBACK };
  }
}

/** French label for the score, e.g. "5/5" or "4,8/5". */
export function formatGoogleRatingScore(
  rating: number = GOOGLE_BUSINESS_RATING_FALLBACK.rating,
): string {
  const label = Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1).replace(".", ",");
  return `${label}/5`;
}

/** French review count, e.g. "1 avis" / "12 avis". */
export function formatGoogleReviewCount(
  count: number = GOOGLE_BUSINESS_RATING_FALLBACK.reviewCount,
): string {
  return `${count} avis`;
}
