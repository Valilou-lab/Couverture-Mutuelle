import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HomeV2Landing } from "@/components/landing/lp-v2/HomeV2Landing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-tranches",
  display: "swap",
});

/**
 * Independent V2 of `/`. Same questionnaire and mobile as the homepage;
 * desktop chrome matches the validated `/tranches-age` layout.
 * No redirect to or from `/`.
 */
export const metadata: Metadata = {
  title: "Couverture Mutuelle — Comparez les mutuelles santé",
  description:
    "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
  robots: { index: false, follow: true },
};

export default function HomeV2Page() {
  return (
    <HomeV2Landing
      className={`${inter.variable} lp-v2-type lp-v2-home`}
    />
  );
}
