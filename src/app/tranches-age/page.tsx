import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-tranches",
  display: "swap",
});

const TITLE = "Votre tarif mutuelle selon votre âge — Couverture Mutuelle";
const DESCRIPTION =
  "55 ans et plus : comparez gratuitement les tarifs de mutuelle santé selon votre tranche d’âge. Service sans engagement.";

/**
 * Paid landing for the Meta ad « A01 | Tranches d’âge ».
 * Mobile stays the validated template; desktop (`lg`) is a two-column layout.
 * Not indexed: duplicate of the homepage content, meant for ad traffic only.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function TranchesAgePage() {
  return (
    <SeniorLanding className={`${inter.variable} tranches-age-type`} />
  );
}
