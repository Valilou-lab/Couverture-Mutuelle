"use client";

import { useCallback, useState } from "react";
import type { FormStepId } from "@/components/form/types";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { HomeHeroTitles } from "@/components/landing/home/HomeHero";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import {
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { LpV2SplitShell } from "./LpV2SplitShell";

const HOME_FAQ = [
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

function isPastFirstQuestion(
  step: FormStepId,
  questionNumber: number | null,
): boolean {
  if (step === "analyzing" || step === "confirmation") return true;
  return questionNumber != null && questionNumber >= 2;
}

const DESKTOP_H1 =
  "mx-auto font-extrabold leading-[1.12] tracking-[-0.03em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(2.25rem,3vw,3rem)]";

/**
 * `/home-2` and `/tiktok-2`: homepage copy + questionnaire + mobile,
 * `/tranches-age` desktop chrome. Does not replace `/` or `/tiktok`.
 */
export function HomeV2Landing({ className }: { className?: string } = {}) {
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
      mobileHeader={
        <SeniorHeader bordered={false} logoCentered showWhatsApp={false} />
      }
      mobileTitle={
        <HomeHeroTitles className="pb-2" />
      }
      desktopTitle={
        <h1 className={DESKTOP_H1}>
          <span className="block text-zinc-900">
            Le bon tarif pour votre mutuelle
          </span>
          <span className="block text-[#9b4ff0]">
            sans perdre les garanties qui comptent
          </span>
        </h1>
      }
      form={
        <>
          <TikTokFunnelTracker />
          <SeniorQuoteForm
            redesignIntro
            lpV2Desktop
            splitContact
            onStepChange={onStepChange}
          />
        </>
      }
      desktopFaq={<RacFaq headingId="faq-titre-desktop" items={HOME_FAQ} />}
      desktopCtaLabel="DEVIS GRATUIT"
      mobileBelow={
        <>
          <HomeLpBelowForm />
          {!formFocused ? (
            <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
              <RacFaq items={HOME_FAQ} />
              <RacCta label="MON DEVIS GRATUIT" />
            </div>
          ) : null}
        </>
      }
    />
  );
}
