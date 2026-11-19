import { NextResponse } from "next/server";
import { getGoogleBusinessRating } from "@/lib/google-business-rating";

export const revalidate = 21600; // 6h — aligned with Places fetch cache

/**
 * Public JSON for the LP trust line (rating + review count only).
 * Never returns a Google Maps / share URL (keeps users in the funnel).
 */
export async function GET() {
  const rating = await getGoogleBusinessRating();
  return NextResponse.json(
    {
      rating: rating.rating,
      reviewCount: rating.reviewCount,
      syncedAt: rating.syncedAt,
      source: rating.source,
    },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    },
  );
}
