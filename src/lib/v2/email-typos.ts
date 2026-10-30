/**
 * V2 consumer-domain typo detection + suggestions.
 * Custom / professional domains are never blocked here — only explicit
 * near-misses of known providers (and known-invalid TLDs like gmail.fr).
 */

/** Canonical domains we accept for major providers (FR + global). */
export const V2_CANONICAL_CONSUMER_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.fr",
  "icloud.com",
  "me.com",
  "mac.com",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "laposte.net",
  "proton.me",
  "protonmail.com",
] as const;

/**
 * Explicit typo / wrong-TLD → suggested canonical domain.
 * Includes gmaill.fr, hotmail.fr (not in our consumer referential), etc.
 */
export const V2_DOMAIN_TYPO_SUGGESTIONS: Record<string, string> = {
  // Gmail
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmaill.fr": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.fr": "gmail.com",
  "gmail.comm": "gmail.com",
  "googlemail.fr": "googlemail.com",
  // Hotmail / Outlook / Live
  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.fr": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.cm": "outlook.com",
  "outlook.fr": "outlook.com",
  "live.fr": "live.com",
  "live.con": "live.com",
  "msn.con": "msn.com",
  "msn.fr": "msn.com",
  // Yahoo
  "yahho.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yaho.fr": "yahoo.fr",
  "yahho.fr": "yahoo.fr",
  // iCloud
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.con": "icloud.com",
  "icloud.fr": "icloud.com",
  "me.fr": "me.com",
  // French ISPs
  "orange.con": "orange.fr",
  "orange.com": "orange.fr",
  "wanadoo.con": "wanadoo.fr",
  "wanado.fr": "wanadoo.fr",
  "free.con": "free.fr",
  "free.com": "free.fr",
  "sfr.con": "sfr.fr",
  "sfr.com": "sfr.fr",
  "laposte.con": "laposte.net",
  "laposte.fr": "laposte.net",
  "laposte.com": "laposte.net",
};

export type V2EmailTypoResult = {
  isTypo: true;
  domain: string;
  suggestedDomain: string;
  suggestedEmail: string;
};

export function splitEmail(
  value: string,
): { local: string; domain: string } | null {
  const email = value.trim();
  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (!local || !domain) return null;
  return { local, domain };
}

/**
 * If the domain is an explicit known typo / wrong TLD of a consumer provider,
 * return a suggested correction. Professional domains return null.
 */
export function detectV2EmailDomainTypo(
  email: string,
): V2EmailTypoResult | null {
  const parts = splitEmail(email);
  if (!parts) return null;

  const suggestedDomain = V2_DOMAIN_TYPO_SUGGESTIONS[parts.domain];
  if (!suggestedDomain || suggestedDomain === parts.domain) return null;

  return {
    isTypo: true,
    domain: parts.domain,
    suggestedDomain,
    suggestedEmail: `${parts.local}@${suggestedDomain}`,
  };
}
