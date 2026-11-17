/**
 * Couverture Mutuelle — Google Business Profile rating.
 * Display-only trust signal: never render as an outbound link from the funnel.
 *
 * Source (do not expose to visitors):
 * https://share.google/UNwXMQnv5q7EU8azi
 *
 * Update rating / reviewCount when the Google fiche changes.
 * Live Places API sync can replace this later if needed.
 */
export const GOOGLE_BUSINESS_RATING = {
  rating: 5,
  reviewCount: 1,
  /** ISO date of last manual sync from the Google fiche. */
  syncedAt: "2026-11-17",
} as const;

/** French label for the score, e.g. "5/5" or "4,8/5". */
export function formatGoogleRatingScore(
  rating: number = GOOGLE_BUSINESS_RATING.rating,
): string {
  const label = Number.isInteger(rating)
    ? String(rating)
    : rating.toFixed(1).replace(".", ",");
  return `${label}/5`;
}

/** French review count, e.g. "1 avis" / "12 avis". */
export function formatGoogleReviewCount(
  count: number = GOOGLE_BUSINESS_RATING.reviewCount,
): string {
  return `${count} avis`;
}
