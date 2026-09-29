import type { Metadata } from "next";
import { PrimaryLanding } from "@/components/landing/primary/PrimaryLanding";

export const metadata: Metadata = {
  title: "Couverture Mutuelle — Comparez les mutuelles santé",
  description:
    "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
  robots: { index: false, follow: true },
};

export default function TikTokLandingPage() {
  return <PrimaryLanding homeHref="/tiktok" />;
}
