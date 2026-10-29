import { NextResponse } from "next/server";

/**
 * DEMO-ONLY eligibility endpoint for /nouveau-parcours-demo.
 * Isolated from Vertikl, /api/leads, Meta CAPI and Twilio Verify.
 * Returns a fixed mock of partners that could contact the prospect.
 */
export async function POST(request: Request) {
  // Accept any JSON body for the demo; real qualification comes later.
  try {
    await request.json();
  } catch {
    // Empty / invalid body is fine in demo mode.
  }

  return NextResponse.json({
    eligible: true,
    partners: [
      { id: "iki", name: "IKI Assurance" },
      { id: "skarlett", name: "Skarlett" },
      { id: "santiane", name: "Santiane" },
    ],
  });
}
