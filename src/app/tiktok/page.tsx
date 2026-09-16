import type { Metadata } from "next";
import { TikTokHeader } from "@/components/landing/tiktok/TikTokHeader";
import { TikTokHero } from "@/components/landing/tiktok/TikTokHero";
import { Advantages } from "@/components/landing/Advantages";
import { MascotAdvice } from "@/components/landing/MascotAdvice";
import { PricingGuide } from "@/components/landing/PricingGuide";
import { AdvisorValue } from "@/components/landing/AdvisorValue";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoverageShowcase } from "@/components/landing/CoverageShowcase";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Couverture Mutuelle — Comparez les mutuelles santé",
  description:
    "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
  robots: { index: false, follow: true },
};

export default function TikTokLandingPage() {
  return (
    <>
      <TikTokHeader />
      <main className="flex-1">
        <TikTokHero />
        <HowItWorks />
        <Advantages />
        <MascotAdvice />
        <PricingGuide />
        <AdvisorValue />
        <CoverageShowcase />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
