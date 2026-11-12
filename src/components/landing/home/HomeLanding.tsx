"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { FormStepId } from "@/components/form/types";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorPartners } from "@/components/landing/senior/SeniorSections";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import {
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { FormReassuranceSteps } from "@/components/landing/FormReassuranceSteps";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import type { PhotoBadgeVariant } from "@/components/landing/DesktopFormWithPhoto";
import { HomeHeroForm, HomeHeroTitles } from "./HomeHero";
import {
  HomeFormTrustButtons,
  HomeHeaderTrustBar,
} from "./HomeFormTrustButtons";
import { HomeLpBelowForm } from "./HomeLpBelowForm";
import { TrustpilotMini } from "@/components/trustpilot/TrustpilotMini";

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
 * White band runs from the header through the titles and behind the form,
 * then the photo starts just below.
 * `/` can opt into a full-width blurred desktop photo behind the form.
 */
export function HomeLanding({
  photoBadge = "free",
  desktopBlurBackdrop = false,
}: {
  photoBadge?: PhotoBadgeVariant;
  /** Homepage (/) only: blurred full-width photo behind the form on desktop. */
  desktopBlurBackdrop?: boolean;
} = {}) {
  const [formFocused, setFormFocused] = useState(false);

  const onStepChange = useCallback(
    (step: FormStepId, questionNumber: number | null) => {
      setFormFocused(isPastFirstQuestion(step, questionNumber));
    },
    [],
  );

  const form = (
    <>
      <TikTokFunnelTracker />
      <div className="lg:mx-auto lg:max-w-[34rem]">
        <HomeHeroForm
          onStepChange={onStepChange}
          photoBadge={photoBadge}
          showPhoto={false}
        />
      </div>
    </>
  );

  return (
    <div className="main-lp-redesign flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55] text-foreground">
      <div className="bg-white">
        <SeniorHeader
          bordered={false}
          whatsappShowLabel={false}
          logoCentered
        />
        <HomeHeaderTrustBar />
        <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
          <HomeHeroTitles
            className={desktopBlurBackdrop ? "pb-2 lg:pb-3" : undefined}
          />
        </div>
      </div>
      {desktopBlurBackdrop ? (
        <>
          <section className="relative w-full overflow-hidden bg-[#ede9fe] lg:bg-transparent">
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <Image
                src="/images/hero-couple-laptops.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_40%]"
              />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[640px] px-4 pb-5 pt-4 min-[700px]:max-w-[1000px] lg:max-w-[1220px] lg:pb-8 lg:pt-12">
              {form}
            </div>
          </section>
          <HomeLpBelowForm />
        </>
      ) : (
        <>
          <section className="bg-[#ede9fe] lg:bg-white">
            <div className="mx-auto w-full max-w-[640px] px-4 pb-5 pt-4 min-[700px]:max-w-[1000px] lg:max-w-[1220px] lg:pb-0 lg:pt-0">
              {form}
            </div>
          </section>
          <div className="lg:hidden">
            <HomeLpBelowForm />
          </div>
          <section className="relative hidden overflow-hidden lg:block">
            <Image
              src="/images/hero-couple-cour.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_68%] lg:object-[center_58%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/15"
            />
            <div className="relative z-10 mx-auto w-full max-w-[640px] px-4 pb-[12rem] pt-3 min-[700px]:max-w-[1000px] lg:max-w-[1220px] lg:pb-16 lg:pt-5">
              <HomeFormTrustButtons onPhoto />
            </div>
          </section>
        </>
      )}
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px] lg:max-w-[1220px]">
        <div className="mx-auto w-full max-w-[640px] min-[700px]:max-w-[1000px]">
          {desktopBlurBackdrop ? null : (
            <div className="hidden lg:block">
              <FormReassuranceSteps />
            </div>
          )}
          {!formFocused ? (
            <>
              {desktopBlurBackdrop ? null : (
                <div className="hidden lg:block">
                  <SeniorPartners />
                </div>
              )}
              <RacFaq items={FAQ} />
              <RacCta label="MON DEVIS GRATUIT" />
            </>
          ) : null}
        </div>
      </main>
      <TrustpilotMini />
      <SeniorFooter />
      {!formFocused ? <SeniorStickyCta ctaLabel={CTA_LABEL} /> : null}
    </div>
  );
}
