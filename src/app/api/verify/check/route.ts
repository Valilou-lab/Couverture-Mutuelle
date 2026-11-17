import { NextResponse } from "next/server";
import {
  PHONE_VERIFY_COOKIE,
  createPhoneVerifyProof,
  phoneVerifyCookieOptions,
  phoneVerifySecureFromRequest,
} from "@/lib/phone-verify-proof";
import { checkTwilioSmsVerification } from "@/lib/twilio/verify";

export const runtime = "nodejs";

type Body = {
  phone?: unknown;
  code?: unknown;
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
  const code = typeof body.code === "string" ? body.code : "";
  const result = await checkTwilioSmsVerification(phone, code);

  if (!result.ok) {
    const status =
      result.error === "INVALID_PHONE" || result.error === "INVALID_CODE"
        ? 400
        : result.error === "CODE_EXPIRED" || result.error === "NOT_APPROVED"
          ? 400
          : result.error === "TWILIO_MISCONFIGURED"
            ? 500
            : 502;
    return NextResponse.json(
      { success: false, error: result.error },
      { status },
    );
  }

  const proof = createPhoneVerifyProof(result.phoneE164);
  if (!proof) {
    console.error(
      "[api/verify/check] PHONE_VERIFY_SECRET missing or too weak — cannot sign proof",
    );
    return NextResponse.json(
      { success: false, error: "PHONE_VERIFY_MISCONFIGURED" },
      { status: 500 },
    );
  }

  const secure = phoneVerifySecureFromRequest(request);
  const cookieOptions = phoneVerifyCookieOptions(900, { secure });

  const response = NextResponse.json({
    success: true,
    status: "approved",
    /** Canonical E.164 bound into the cookie — client must reuse this for eligibility. */
    phoneE164: result.phoneE164,
  });
  response.cookies.set(PHONE_VERIFY_COOKIE, proof, cookieOptions);

  console.info("[api/verify/check] proof cookie set", {
    phonePrefix: result.phoneE164.slice(0, 6),
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: cookieOptions.maxAge,
    httpOnly: cookieOptions.httpOnly,
  });

  return response;
}
