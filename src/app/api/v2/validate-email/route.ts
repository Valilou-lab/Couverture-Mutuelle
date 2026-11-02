import { NextResponse } from "next/server";
import { isValidEmailAddress } from "@/components/form/validation";
import { checkEmailDomainMx } from "@/lib/v2/email-domain";
import { detectV2EmailDomainTypo } from "@/lib/v2/email-typos";

export const runtime = "nodejs";

type Body = {
  email?: unknown;
};

/**
 * V2 email domain check (scaffold path for `/devis`).
 * Format + consumer typo map (client also runs these) + DNS MX on the server.
 * Does not touch `/api/leads` or production forms.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim() : "";

  if (!email || /\s/.test(email) || !isValidEmailAddress(email)) {
    return NextResponse.json({
      ok: false,
      reason: "format",
      message: "Veuillez saisir une adresse e-mail valide.",
    });
  }

  const typo = detectV2EmailDomainTypo(email);
  if (typo) {
    return NextResponse.json({
      ok: false,
      reason: "typo",
      message: `Vérifiez votre adresse e-mail. Vouliez-vous dire ${typo.suggestedEmail} ?`,
      suggestion: typo.suggestedEmail,
    });
  }

  const mx = await checkEmailDomainMx(email);
  if (!mx.ok) {
    return NextResponse.json({
      ok: false,
      reason: mx.reason,
      message: "Veuillez saisir une adresse e-mail valide.",
    });
  }

  return NextResponse.json({
    ok: true,
    domain: mx.domain,
  });
}
