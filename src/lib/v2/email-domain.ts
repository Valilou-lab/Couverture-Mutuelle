import { resolveMx, resolveSoa } from "node:dns/promises";

export type V2EmailDomainCheck =
  | { ok: true; domain: string }
  | { ok: false; domain: string; reason: "no_mx" | "nxdomain" | "invalid" };

function extractDomain(email: string): string | null {
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0 || at !== trimmed.indexOf("@")) return null;
  const domain = trimmed.slice(at + 1).toLowerCase().replace(/\.$/, "");
  if (!domain || domain.includes(" ") || !domain.includes(".")) return null;
  return domain;
}

/**
 * Server-only: domain can receive mail if it publishes MX records.
 * Falls back to SOA existence check only to distinguish NXDOMAIN vs empty MX.
 */
export async function checkEmailDomainMx(
  email: string,
): Promise<V2EmailDomainCheck> {
  const domain = extractDomain(email);
  if (!domain) {
    return { ok: false, domain: "", reason: "invalid" };
  }

  try {
    const mx = await resolveMx(domain);
    if (Array.isArray(mx) && mx.length > 0) {
      return { ok: true, domain };
    }
    return { ok: false, domain, reason: "no_mx" };
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    if (code === "ENOTFOUND" || code === "ENODATA" || code === "ESERVFAIL") {
      // Confirm whether the name exists at all.
      try {
        await resolveSoa(domain);
        return { ok: false, domain, reason: "no_mx" };
      } catch {
        return { ok: false, domain, reason: "nxdomain" };
      }
    }

    if (code === "ENOTFOUND") {
      return { ok: false, domain, reason: "nxdomain" };
    }

    return { ok: false, domain, reason: "no_mx" };
  }
}
