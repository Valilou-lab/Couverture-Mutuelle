import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { InsurersLogoCarousel } from "@/components/landing/InsurersLogoCarousel";
import { Advantages } from "@/components/landing/Advantages";
import { MascotAdvice } from "@/components/landing/MascotAdvice";
import { PricingGuide } from "@/components/landing/PricingGuide";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoverageShowcase } from "@/components/landing/CoverageShowcase";
import { Articles } from "@/components/landing/Articles";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <InsurersLogoCarousel />
        <HowItWorks />
        <Advantages />
        <MascotAdvice />
        <PricingGuide />
        <SavingsCalculator />
        <CoverageShowcase />
        <Faq />
        <Articles />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
