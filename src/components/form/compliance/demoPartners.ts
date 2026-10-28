/**
 * Demo-only partner logo catalog for /nouveau-parcours.
 * Display stays driven by response.partners — this map only resolves assets.
 */
export const DEMO_PARTNER_LOGOS: Record<string, string> = {
  iki: "/images/partners-demo/iki.webp",
  skarlett: "/images/partners-demo/skarlett.webp",
  santiane: "/images/partners-demo/santiane.png",
};

const NAME_TO_LOGO_ID: Record<string, string> = {
  "iki assurance": "iki",
  iki: "iki",
  skarlett: "skarlett",
  santiane: "santiane",
};

export function getDemoPartnerLogoSrc(id: string, name: string): string | null {
  if (DEMO_PARTNER_LOGOS[id]) return DEMO_PARTNER_LOGOS[id]!;
  const fromName = NAME_TO_LOGO_ID[name.trim().toLowerCase()];
  if (fromName && DEMO_PARTNER_LOGOS[fromName]) {
    return DEMO_PARTNER_LOGOS[fromName]!;
  }
  return null;
}

/** French list: "A", "A et B", "A, B et C". */
export function formatPartnerNamesFr(names: string[]): string {
  if (names.length === 0) return "les organismes éligibles";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} et ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`;
}

function startsWithVowelSound(value: string): boolean {
  return /^[aeiouyhàâäéèêëïîôùûü]/i.test(value.trim());
}

export function buildDynamicConsentText(partnerNames: string[]): string {
  const list = formatPartnerNamesFr(partnerNames);
  const singular = partnerNames.length <= 1;
  const verb = singular ? "me contacte" : "me contactent";
  const possessive = singular ? "ses" : "leurs";
  const linker = startsWithVowelSound(list) ? "qu’" : "que ";
  return `J’accepte ${linker}${list} ${verb} par téléphone et/ou e-mail afin de me présenter ${possessive} offres correspondant à ma demande.`;
}
