"use client";

import type { FormStepId } from "@/components/form/types";
import { ConversionQuoteForm } from "@/components/form/ConversionQuoteForm";
import { DesktopFormWithPhoto } from "@/components/landing/DesktopFormWithPhoto";
import { FormReassuranceSteps } from "@/components/landing/FormReassuranceSteps";
import { PartnerLogoCarousel } from "@/components/landing/primary/PartnerLogoCarousel";
import { PrimaryTrustSection } from "@/components/landing/primary/PrimaryTrustSection";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

type PrimaryHeroProps = {
  formFocused?: boolean;
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
};

export function PrimaryHero({
  formFocused = false,
  onStepChange,
}: PrimaryHeroProps = {}) {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="relative">
        {/* White band: titles only — stops just above the form */}
        <section className="border-b border-[#ddd6fe] bg-white">
          <div className="mx-auto max-w-[84rem] px-4 pb-5 pt-8 text-center sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pb-5 lg:pt-3 lg:text-left">
            <div className="mx-auto grid max-w-[760px] gap-2.5 lg:mx-0 lg:max-w-xl xl:max-w-[44rem]">
              <h1 className="text-balance font-poppins text-[clamp(1.55rem,6.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
                MUTUELLE SENIOR
              </h1>
              <p className="text-balance font-poppins text-[clamp(1.1rem,4.4vw,1.4rem)] font-bold leading-snug text-[#3b0764]">
                VÉRIFIEZ SI VOUS POUVEZ PAYER MOINS SANS RÉDUIRE VOS GARANTIES
              </p>
            </div>
          </div>
        </section>

        {/* Pastel blue behind the form — desktop: faded photo + form centered */}
        <section className="bg-[#e8f2fb]">
          <div className="mx-auto max-w-[84rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            <DesktopFormWithPhoto className="pt-0 lg:pt-0">
              <ConversionQuoteForm onStepChange={onStepChange} />
            </DesktopFormWithPhoto>

            <div className="mx-auto mt-2 max-w-[56rem] lg:mt-4">
              <FormReassuranceSteps />
            </div>
          </div>
        </section>
        {!formFocused ? (
          <>
            <PrimaryTrustSection />
            <PartnerLogoCarousel />
          </>
        ) : null}
      </div>
    </>
  );
}
