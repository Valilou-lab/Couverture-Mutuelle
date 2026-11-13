import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ResteAChargeV2Landing } from "@/components/landing/lp-v2/ResteAChargeV2Landing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-tranches",
  display: "swap",
});

const TITLE =
  "Encore un reste à charge ? Comparez votre mutuelle — Couverture Mutuelle";
const DESCRIPTION =
  "Dentaire, optique, audition, dépassements d’honoraires : si vous payez encore de votre poche, votre contrat n’est peut-être plus adapté. Comparez gratuitement, sans engagement.";

/**
 * Independent V2 of `/reste-a-charge`. Same questionnaire and mobile as V1;
 * desktop chrome matches the validated `/tranches-age` layout.
 * No redirect to or from `/reste-a-charge`.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function ResteAChargeV2Page() {
  return (
    <ResteAChargeV2Landing
      className={`${inter.variable} reste-a-charge-type lp-v2-type`}
    />
  );
}
