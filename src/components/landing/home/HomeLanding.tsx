"use client";

import { useCallback, useState } from "react";
import type { FormStepId } from "@/components/form/types";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { TranchesAgeDesktopAside } from "@/components/landing/senior/TranchesAgeDesktopAside";
import {
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { HomeHeroTitles } from "./HomeHero";
import { HomeFormTrustButtons } from "./HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "./HomeHowItWorksSchema";
import { HomeLpBelowForm } from "./HomeLpBelowForm";

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

const DESKTOP_H1 =
  "mx-auto font-extrabold leading-[1.12] tracking-[-0.03em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(2.25rem,3vw,3rem)]";

/** From question 2 onward — keep only « Comment ça se passe » under the form. */
function isPastFirstQuestion(
  step: FormStepId,
  questionNumber: number | null,
): boolean {
  if (step === "analyzing" || step === "confirmation") return true;
  return questionNumber != null && questionNumber >= 2;
}

/**
 * `/` and `/tiktok`: own copy + questionnaire + mobile.
 * Desktop (`lg`) matches `/devis` chrome (pastel header, white form, pastel how-it-works).
 * One quote form in the DOM.
 */
export function HomeLanding({
  desktopBlurBackdrop = false,
  className,
}: {
  /** Homepage (`/`) only — kept for the mobile title spacing; desktop no longer uses the photo. */
  desktopBlurBackdrop?: boolean;
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
      className={`main-lp-redesign flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55] text-foreground${
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
                <HomeHeroTitles
                  className={desktopBlurBackdrop ? "pb-2" : undefined}
                />
              </div>
            </div>
            <div className="hidden px-6 pb-3 pt-4 text-center lg:block xl:px-10 xl:pt-5">
              <h1 className={DESKTOP_H1}>
                <span className="block text-zinc-900">
                  Le bon tarif pour votre mutuelle
                </span>
                <span className="block text-[#9b4ff0]">
                  sans perdre les garanties qui comptent
                </span>
              </h1>
            </div>
          </div>

          <section className="bg-white">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px] lg:max-w-[34rem] lg:px-6 lg:pt-1">
              <div
                id="devis"
                className="mx-auto w-full max-w-[560px] scroll-mt-4 pb-5 pt-4 lg:max-w-none lg:pb-4 lg:pt-5"
              >
                <TikTokFunnelTracker />
                <SeniorQuoteForm
                  redesignIntro
                  lpV2Desktop
                  splitContact
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
              <HomeHowItWorksSchema headingId="comment-ca-se-passe-schema-desktop" />
            </div>
          ) : null}
        </div>

        <TranchesAgeDesktopAside />
      </div>

      <div className="hidden bg-white px-6 pb-16 lg:block xl:px-10">
        <RacFaq headingId="faq-titre-desktop" items={FAQ} />
        <RacCta label="DEVIS GRATUIT" />
      </div>

      <div className="lg:hidden">
        <HomeLpBelowForm howItWorksPastel showHowItWorks={!formFocused} />
        {!formFocused ? (
          <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
            <RacFaq items={FAQ} />
            <RacCta label="MON DEVIS GRATUIT" />
          </div>
        ) : null}
      </div>

      <SeniorFooter />
    </div>
  );
}
