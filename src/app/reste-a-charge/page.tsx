import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ResteAChargeLanding } from "@/components/landing/reste-a-charge/ResteAChargeLanding";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-tranches",
  display: "swap",
});

const TITLE = "Encore un reste à charge ? Comparez votre mutuelle — Couverture Mutuelle";
const DESCRIPTION =
  "Dentaire, optique, audition, dépassements d’honoraires : si vous payez encore de votre poche, votre contrat n’est peut-être plus adapté. Comparez gratuitement, sans engagement.";

/**
 * Paid landing for the Meta ad « A03 | Reste à charge 420 € » (UGC video).
 * Same quote form as the homepage; own hero, sections and copy.
 * Not indexed: meant for ad traffic only.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function ResteAChargePage() {
  return (
    <ResteAChargeLanding
      className={`${inter.variable} reste-a-charge-type lp-v2-type`}
    />
  );
}
