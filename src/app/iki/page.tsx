import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import { IkiLanding } from "@/components/landing/iki/IkiLanding";

/** IKI brand typeface (charte graphique IKI : Titillium Web). */
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-titillium",
  display: "swap",
});

const TITLE = "IKI Assurance × Couverture Mutuelle — Comparez votre mutuelle santé";
const DESCRIPTION =
  "En partenariat avec IKI Assurance : comparez gratuitement les mutuelles santé seniors. 5 questions, un conseiller vous rappelle. Sans engagement.";

/**
 * Co-branded landing PROPOSAL for IKI Assurance.
 * Same quote form as the homepage; own header, hero, sections and IKI colours.
 * Not indexed (proposal, not meant for search engines).
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function IkiPage() {
  return (
    <div className={`${titillium.variable} flex min-h-0 flex-1 flex-col`}>
      <IkiLanding />
    </div>
  );
}
