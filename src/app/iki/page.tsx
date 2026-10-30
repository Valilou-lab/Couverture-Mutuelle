import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { IkiLanding } from "@/components/landing/iki/IkiLanding";
import { IkiRouteTheme } from "@/components/landing/iki/IkiRouteTheme";

/** IKI design system typefaces: Outfit carries everything, Manrope only the
 *  capital eyebrows and the big figures (stand-in for Monopause). */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-iki-outfit",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-iki-manrope",
  display: "swap",
});

const TITLE = "IKI Assurances × Couverture Mutuelle — Mutuelle santé senior";
const DESCRIPTION =
  "Avec IKI Assurances, courtier spécialisé depuis 2008 : un conseiller compare les garanties pour vous. 5 questions, gratuit et sans engagement.";

/**
 * Co-branded landing PROPOSAL for IKI Assurances.
 * Same quote form as the homepage (logic untouched); everything visible follows
 * the IKI design system, Couverture Mutuelle only appears as a small co-brand.
 * Not indexed (proposal, not meant for search engines).
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

const FONT_CLASSES = `${outfit.variable} ${manrope.variable}`;

export default function IkiPage() {
  return (
    <div className={`${FONT_CLASSES} flex min-h-0 flex-1 flex-col`}>
      <IkiRouteTheme fontClassName={FONT_CLASSES} />
      <IkiLanding />
    </div>
  );
}
