import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Advantages } from "@/components/landing/Advantages";
import { MascotAdvice } from "@/components/landing/MascotAdvice";
import { PricingGuide } from "@/components/landing/PricingGuide";
import { AdvisorValue } from "@/components/landing/AdvisorValue";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoverageShowcase } from "@/components/landing/CoverageShowcase";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
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
