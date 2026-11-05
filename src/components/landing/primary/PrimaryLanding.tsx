"use client";

import { useCallback, useState } from "react";
import type { FormStepId } from "@/components/form/types";
import { Advantages } from "@/components/landing/Advantages";
import { AdvisorValue } from "@/components/landing/AdvisorValue";
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

/** From question 2 onward — keep only « Comment ça se passe » under the form. */
function isPastFirstQuestion(
  step: FormStepId,
  questionNumber: number | null,
): boolean {
  if (step === "analyzing" || step === "confirmation") return true;
  return questionNumber != null && questionNumber >= 2;
}

export function PrimaryLanding({ homeHref }: PrimaryLandingProps) {
  const [formFocused, setFormFocused] = useState(false);

  const onStepChange = useCallback(
    (step: FormStepId, questionNumber: number | null) => {
      setFormFocused(isPastFirstQuestion(step, questionNumber));
    },
    [],
  );

  return (
    <div className="primary-lp flex min-h-0 flex-1 flex-col bg-[#e8f2fb]">
      <PrimaryHeader homeHref={homeHref} />
      <main className="flex-1">
        <PrimaryHero formFocused={formFocused} onStepChange={onStepChange} />
        {!formFocused ? (
          <>
            <HowItWorks />
            <Advantages />
            <MascotAdvice />
            <PricingGuide />
            <AdvisorValue />
            <Faq />
            <FinalCta />
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
