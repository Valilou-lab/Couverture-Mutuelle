"use client";

import { useCallback, useState } from "react";
import type { FormStepId } from "@/components/form/types";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorPartners } from "@/components/landing/senior/SeniorSections";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { FormReassuranceSteps } from "@/components/landing/FormReassuranceSteps";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { HomeHeroForm, HomeHeroTitles } from "./HomeHero";
import { HomeWhy } from "./HomeWhy";

const CTA_LABEL = "Je compare gratuitement";

const FAQ = [
  {
    question: "Le comparatif est-il vraiment gratuit ?",
    answer: "Oui, entièrement gratuit et sans engagement.",
  },
  {
    question: "Êtes-vous une mutuelle ?",
    answer:
      "Non. Nous vous mettons en relation avec des partenaires qui comparent les offres pour vous.",
  },
  {
    question: "Puis-je comparer si j’ai déjà une mutuelle ?",
    answer: "Oui. Après un an de contrat, vous pouvez changer à tout moment.",
  },
  {
    question: "Comment sont utilisées mes données ?",
    answer:
      "Uniquement pour vous proposer des offres de complémentaire santé. Vous pouvez retirer votre accord à tout moment.",
  },
] as const;

/** From question 2 onward — keep only « Comment ça se passe » under the form. */
function isPastFirstQuestion(
  step: FormStepId,
  questionNumber: number | null,
): boolean {
  if (step === "analyzing" || step === "confirmation") return true;
  return questionNumber != null && questionNumber >= 2;
}

/**
 * Homepage (/) with the /reste-a-charge layout: short, form-first page,
 * then supporting blocks. Same form, header, footer and sticky CTA.
 * White band runs from the header through the titles, stopping just above the form.
 */
export function HomeLanding() {
  const [formFocused, setFormFocused] = useState(false);

  const onStepChange = useCallback(
    (step: FormStepId, questionNumber: number | null) => {
      setFormFocused(isPastFirstQuestion(step, questionNumber));
    },
    [],
  );

  return (
    <div className="main-lp-redesign flex min-h-0 flex-1 flex-col bg-[#e8f2fb] text-[18px] leading-[1.55] text-foreground">
      <div className="border-b border-[#ddd6fe] bg-white">
        <SeniorHeader
          bordered={false}
          whatsappShowLabel={false}
          logoCentered
        />
        <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
          <HomeHeroTitles />
        </div>
      </div>
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px] lg:max-w-[1220px]">
        <TikTokFunnelTracker />
        <HomeHeroForm onStepChange={onStepChange} />
        <div className="mx-auto w-full max-w-[640px] min-[700px]:max-w-[1000px]">
          <FormReassuranceSteps />
          {!formFocused ? (
            <>
              <SeniorPartners />
              <RacAdvantages />
              <HomeWhy />
              <RacCta label={CTA_LABEL} />
              <RacFaq items={FAQ} />
              <RacCta label={CTA_LABEL} />
            </>
          ) : null}
        </div>
      </main>
      <SeniorFooter />
      {!formFocused ? <SeniorStickyCta ctaLabel={CTA_LABEL} /> : null}
    </div>
  );
}
