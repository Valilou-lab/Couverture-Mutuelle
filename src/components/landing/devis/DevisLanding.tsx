"use client";

import { useCallback, useState } from "react";
import { QuoteFormV2 } from "@/components/form/v2/QuoteFormV2";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { TranchesAgeDesktopAside } from "@/components/landing/senior/TranchesAgeDesktopAside";
import {
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { HomeHeroTitles } from "@/components/landing/home/HomeHero";
import { HomeFormTrustButtons } from "@/components/landing/home/HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "@/components/landing/home/HomeHowItWorksSchema";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";

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

/**
 * `/devis`: homepage `/` chrome (mobile + desktop) with QuoteFormV2 inside.
 * One form in the DOM. V2 steps, APIs and tracking stay in QuoteFormV2.
 */
export function DevisLanding({
  className,
}: {
  className?: string;
} = {}) {
  const [formFocused, setFormFocused] = useState(false);
  const onFocusChange = useCallback((focused: boolean) => {
    setFormFocused(focused);
  }, []);

  return (
    <div
      className={`main-lp-redesign flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55] text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0 lg:bg-white">
          <div className="lg:hidden">
            <div className="bg-white">
              <SeniorHeader bordered={false} logoCentered showWhatsApp={false} />
              <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
                <HomeHeroTitles className="pb-2" />
              </div>
            </div>
          </div>

          <div className="hidden bg-white px-6 pb-3 pt-8 text-center lg:block xl:px-10 xl:pt-10">
            <h1 className={DESKTOP_H1}>
              <span className="block text-zinc-900">
                Le bon tarif pour votre mutuelle
              </span>
              <span className="block text-[#9b4ff0]">
                sans perdre les garanties qui comptent
              </span>
            </h1>
          </div>

          <section className="bg-[#ede9fe]">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px] lg:max-w-[34rem] lg:px-6 lg:pt-1">
              <div
                id="devis"
                className="mx-auto w-full max-w-[560px] scroll-mt-4 pb-5 pt-4 lg:max-w-none lg:pb-8 lg:pt-5"
              >
                <QuoteFormV2 onFocusChange={onFocusChange} />
              </div>
            </div>
          </section>

          <div className="hidden bg-white px-4 pb-6 pt-4 lg:block xl:px-8">
            <HomeFormTrustButtons />
            <HomeHowItWorksSchema headingId="comment-ca-se-passe-schema-desktop" />
          </div>
        </div>

        <TranchesAgeDesktopAside showBrandLogo={false} />
      </div>

      <div className="hidden bg-white px-6 pb-16 lg:block xl:px-10">
        <RacFaq headingId="faq-titre-desktop" items={FAQ} />
        <RacCta label="DEVIS GRATUIT" />
      </div>

      <div className="lg:hidden">
        <HomeLpBelowForm />
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
