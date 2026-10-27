import { NextResponse } from "next/server";
import { startTwilioSmsVerification } from "@/lib/twilio/verify";

export const runtime = "nodejs";

type Body = {
  phone?: unknown;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const phone = typeof body.phone === "string" ? body.phone : "";
  const result = await startTwilioSmsVerification(phone);

  if (!result.ok) {
    const status =
      result.error === "INVALID_PHONE"
        ? 400
        : result.error === "RATE_LIMITED"
          ? 429
          : result.error === "TWILIO_MISCONFIGURED"
            ? 500
            : 502;
    return NextResponse.json(
      { success: false, error: result.error },
      { status },
    );
  }

  return NextResponse.json({
    success: true,
    status: result.status,
  });
}
