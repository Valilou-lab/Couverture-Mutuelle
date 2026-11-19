"use client";

import { useCallback, useState } from "react";
import type { FormStepId } from "@/components/form/types";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { TranchesAgeDesktopAside } from "@/components/landing/senior/TranchesAgeDesktopAside";
import { HomeFormTrustButtons } from "@/components/landing/home/HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "@/components/landing/home/HomeHowItWorksSchema";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { RacPageTitle } from "./ResteAChargeHero";
import { RacCta, RacFaq } from "./ResteAChargeSections";

/** RAC title is two long lines — keep it smaller than home/devis so Q1 + Google fit. */
const DESKTOP_H1 =
  "mx-auto max-w-[26rem] font-extrabold leading-[1.12] tracking-[-0.03em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(1.2rem,1.45vw,1.45rem)]";

function isPastFirstQuestion(
  step: FormStepId,
  questionNumber: number | null,
): boolean {
  if (step === "analyzing" || step === "confirmation") return true;
  return questionNumber != null && questionNumber >= 2;
}

/**
 * `/reste-a-charge`: own copy + care-needs questionnaire + mobile.
 * Desktop (`lg`) matches `/devis` chrome (pastel header, white form, pastel how-it-works).
 * One quote form in the DOM.
 */
export function ResteAChargeLanding({
  className,
}: {
  className?: string;
} = {}) {
  const [formFocused, setFormFocused] = useState(false);
  const onStepChange = useCallback(
    (step: FormStepId, questionNumber: number | null) => {
      setFormFocused(isPastFirstQuestion(step, questionNumber));
    },
    [],
  );

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55] text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0 lg:bg-white">
          <div className="bg-[#ede9fe]">
            <SeniorHeader
              bordered={false}
              logoCentered
              showWhatsApp={false}
              showLogo={false}
              backgroundClassName="bg-transparent"
            />
            <div className="lg:hidden">
              <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
                <div className="mx-auto grid max-w-[760px] pb-2 pt-2 text-center">
                  <h1 className="text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif]">
                    <RacPageTitle />
                  </h1>
                </div>
              </div>
            </div>
            <div className="hidden px-6 pb-1.5 pt-1.5 text-center lg:block xl:px-10">
              <h1 className={DESKTOP_H1}>
                <RacPageTitle />
              </h1>
            </div>
          </div>

          <section className="bg-white">
            <div className="lg:mx-auto lg:max-w-[34rem] lg:px-6">
              <div
                id="devis"
                className="mx-auto w-full max-w-[560px] scroll-mt-4 px-4 pb-5 pt-4 lg:max-w-none lg:px-0 lg:pb-2 lg:pt-1.5"
              >
                <TikTokFunnelTracker />
                <SeniorQuoteForm
                  redesignIntro="mobile"
                  askCareNeedsFirst
                  lpV2Desktop
                  onStepChange={onStepChange}
                />
              </div>
            </div>
          </section>

          <div className="hidden bg-white px-4 pb-2 pt-2 lg:block xl:px-8">
            <HomeFormTrustButtons />
          </div>
          {!formFocused ? (
            <div className="hidden bg-[#ede9fe] px-4 pb-6 pt-0 lg:block xl:px-8">
              <HomeHowItWorksSchema
                headingId="comment-ca-se-passe-schema-desktop"
                needsText="en 2 minutes"
              />
            </div>
          ) : null}
        </div>

        <TranchesAgeDesktopAside />
      </div>

      <div className="hidden bg-white px-6 pb-16 lg:block xl:px-10">
        <RacFaq headingId="faq-titre-desktop" />
        <RacCta label="DEVIS GRATUIT" />
      </div>

      <div className="lg:hidden">
        <HomeLpBelowForm
          needsText="en 2 minutes"
          howItWorksPastel
          showHowItWorks={!formFocused}
        />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
          <RacFaq />
          <RacCta label="MON DEVIS GRATUIT" />
        </div>
      </div>

      <SeniorFooter />
    </div>
  );
}
