import { NextResponse } from "next/server";
import { lookupCommunesByPostalCode } from "@/lib/commune-lookup-server";
import { isCompletePostalCode } from "@/lib/location-service";

export const runtime = "nodejs";

/**
 * Same-origin postal → cities proxy.
 * Avoids brittle browser calls to geo.api.gouv.fr (CORS / DNS / outages).
 */
export async function GET(request: Request) {
  const postalCode =
    new URL(request.url).searchParams.get("codePostal")?.trim() ?? "";

  if (!isCompletePostalCode(postalCode)) {
    return NextResponse.json(
      { error: "invalid_postal_code" },
      { status: 400 },
    );
  }

  try {
    const cities = await lookupCommunesByPostalCode(postalCode);
    return NextResponse.json(
      { cities },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "lookup_failed" },
      { status: 502 },
    );
  }
}
