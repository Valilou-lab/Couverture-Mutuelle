"use client";

import { useCallback, useState } from "react";
import type { FormStepId } from "@/components/form/types";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { RacPageTitle } from "@/components/landing/reste-a-charge/ResteAChargeHero";
import {
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { LpV2SplitShell } from "./LpV2SplitShell";

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
 * `/reste-a-charge-2`: RAC copy + questionnaire + mobile,
 * `/tranches-age` desktop chrome. Does not replace `/reste-a-charge`.
 */
export function ResteAChargeV2Landing({
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
    <LpV2SplitShell
      className={className}
      mobileTitle={
        <div className="mx-auto grid max-w-[760px] pb-2 pt-2 text-center">
          <h1 className="text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif]">
            <RacPageTitle />
          </h1>
        </div>
      }
      desktopTitle={
        <h1 className={DESKTOP_H1}>
          <RacPageTitle />
        </h1>
      }
      form={
        <>
          <TikTokFunnelTracker />
          <SeniorQuoteForm
            redesignIntro="mobile"
            askCareNeedsFirst
            lpV2Desktop
            onStepChange={onStepChange}
          />
        </>
      }
      schemaCopy={{ needsText: "en 2 minutes" }}
      desktopFaq={<RacFaq headingId="faq-titre-desktop" />}
      desktopCtaLabel="DEVIS GRATUIT"
      showHowItWorks={!formFocused}
      compactChrome
      mobileBelow={
        <>
          <HomeLpBelowForm
            needsText="en 2 minutes"
            howItWorksPastel
            showHowItWorks={!formFocused}
          />
          <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
            <RacFaq />
            <RacCta label="MON DEVIS GRATUIT" />
          </div>
        </>
      }
    />
  );
}
