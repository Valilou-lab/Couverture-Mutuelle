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
 * Independent V2 of `/tranches-age`. Snapshot of the currently validated
 * desktop + the existing mobile questionnaire. `/tranches-age` is unchanged.
 * No redirect between the two URLs.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function TranchesAgeV2Page() {
  return (
    <SeniorLanding className={`${inter.variable} tranches-age-type`} />
  );
}
