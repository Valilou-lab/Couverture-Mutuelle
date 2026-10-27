import "server-only";

import { toInternationalFrenchPhone } from "@/lib/vertikl/normalize";

type TwilioVerifyConfig = {
  accountSid: string;
  authToken: string;
  serviceSid: string;
};

export type TwilioStartResult =
  | { ok: true; phoneE164: string; status: string }
  | { ok: false; error: "INVALID_PHONE" | "TWILIO_MISCONFIGURED" | "TWILIO_ERROR" | "RATE_LIMITED"; message?: string };

export type TwilioCheckResult =
  | { ok: true; phoneE164: string; status: "approved" }
  | {
      ok: false;
      error:
        | "INVALID_PHONE"
        | "INVALID_CODE"
        | "CODE_EXPIRED"
        | "TWILIO_MISCONFIGURED"
        | "TWILIO_ERROR"
        | "NOT_APPROVED";
      message?: string;
    };

function getConfig(): TwilioVerifyConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim();
  if (
    !accountSid ||
    !authToken ||
    !serviceSid ||
    !serviceSid.startsWith("VA")
  ) {
    return null;
  }
  return { accountSid, authToken, serviceSid };
}

function authHeader(config: TwilioVerifyConfig): string {
  return `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`;
}

/** Light in-memory cooldown (best-effort on serverless). */
const lastSendByPhone = new Map<string, number>();
const SEND_COOLDOWN_MS = 30_000;

export function normalizeFrenchPhoneE164(phone: string): string | null {
  return toInternationalFrenchPhone(phone);
}

export async function startTwilioSmsVerification(
  phoneRaw: string,
): Promise<TwilioStartResult> {
  const phoneE164 = normalizeFrenchPhoneE164(phoneRaw);
  if (!phoneE164) {
    return { ok: false, error: "INVALID_PHONE" };
  }

  const last = lastSendByPhone.get(phoneE164) ?? 0;
  if (Date.now() - last < SEND_COOLDOWN_MS) {
    return { ok: false, error: "RATE_LIMITED" };
  }

  const config = getConfig();
  if (!config) {
    console.error("[twilio-verify] missing TWILIO_* env");
    return { ok: false, error: "TWILIO_MISCONFIGURED" };
  }

  const url = `https://verify.twilio.com/v2/Services/${config.serviceSid}/Verifications`;
  const body = new URLSearchParams({
    To: phoneE164,
    Channel: "sms",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader(config),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const json = (await response.json()) as {
      status?: string;
      message?: string;
      code?: number;
    };

    if (!response.ok) {
      console.error("[twilio-verify] start failed", {
        httpStatus: response.status,
        code: json.code ?? null,
      });
      if (response.status === 429) {
        return { ok: false, error: "RATE_LIMITED" };
      }
      return { ok: false, error: "TWILIO_ERROR" };
    }

    lastSendByPhone.set(phoneE164, Date.now());
    return {
      ok: true,
      phoneE164,
      status: typeof json.status === "string" ? json.status : "pending",
    };
  } catch (error) {
    console.error("[twilio-verify] start exception", error);
    return { ok: false, error: "TWILIO_ERROR" };
  }
}

export async function checkTwilioSmsVerification(
  phoneRaw: string,
  codeRaw: string,
): Promise<TwilioCheckResult> {
  const phoneE164 = normalizeFrenchPhoneE164(phoneRaw);
  if (!phoneE164) {
    return { ok: false, error: "INVALID_PHONE" };
  }

  const code = codeRaw.replace(/\D/g, "").slice(0, 6);
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, error: "INVALID_CODE" };
  }

  const config = getConfig();
  if (!config) {
    console.error("[twilio-verify] missing TWILIO_* env");
    return { ok: false, error: "TWILIO_MISCONFIGURED" };
  }

  const url = `https://verify.twilio.com/v2/Services/${config.serviceSid}/VerificationCheck`;
  const body = new URLSearchParams({
    To: phoneE164,
    Code: code,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader(config),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const json = (await response.json()) as {
      status?: string;
      valid?: boolean;
      message?: string;
      code?: number;
    };

    if (!response.ok) {
      console.error("[twilio-verify] check failed", {
        httpStatus: response.status,
        code: json.code ?? null,
      });
      // Twilio 20404 / expired verification
      if (json.code === 20404 || response.status === 404) {
        return { ok: false, error: "CODE_EXPIRED" };
      }
      return { ok: false, error: "TWILIO_ERROR" };
    }

    if (json.status === "approved" || json.valid === true) {
      return { ok: true, phoneE164, status: "approved" };
    }

    if (json.status === "expired" || json.status === "canceled") {
      return { ok: false, error: "CODE_EXPIRED" };
    }

    return { ok: false, error: "NOT_APPROVED" };
  } catch (error) {
    console.error("[twilio-verify] check exception", error);
    return { ok: false, error: "TWILIO_ERROR" };
  }
}
