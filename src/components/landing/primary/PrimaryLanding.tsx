import { Advantages } from "@/components/landing/Advantages";
import { AdvisorValue } from "@/components/landing/AdvisorValue";
import { CoverageShowcase } from "@/components/landing/CoverageShowcase";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MascotAdvice } from "@/components/landing/MascotAdvice";
import { PricingGuide } from "@/components/landing/PricingGuide";
import { PrimaryHeader } from "@/components/landing/primary/PrimaryHeader";
import { PrimaryHero } from "@/components/landing/primary/PrimaryHero";

type PrimaryLandingProps = {
  homeHref: "/" | "/tiktok";
};

export function PrimaryLanding({ homeHref }: PrimaryLandingProps) {
  return (
    <div className="primary-lp flex min-h-0 flex-1 flex-col">
      <PrimaryHeader homeHref={homeHref} />
      <main className="flex-1">
        <PrimaryHero />
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
    </div>
  );
}
