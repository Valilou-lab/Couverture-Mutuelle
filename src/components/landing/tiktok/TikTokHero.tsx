"use client";

import Image from "next/image";
import { QuoteForm } from "@/components/form/QuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import {
  trackTikTokCtaClick,
  trackTikTokFormStart,
  trackTikTokFormStepCompleted,
  trackTikTokSubmitForm,
} from "@/lib/tiktok-funnel";

const TIKTOK_FORM_FUNNEL = {
  onInteract: trackTikTokFormStart,
  onStepCompleted: trackTikTokFormStepCompleted,
  onSubmitSuccess: trackTikTokSubmitForm,
} as const;

/**
 * TikTok landing hero — isolated from the main Hero.
 * First screen: intro + advisor photo; QuoteForm starts just below the fold.
 */

export function TikTokHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <section className="relative bg-gradient-to-b from-brand-soft/80 via-[#f5f2ff] to-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.55),transparent_60%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-3.75rem)] w-full max-w-lg flex-col items-center px-5 pt-8 text-center sm:min-h-[calc(100svh-5.5rem)] sm:max-w-xl sm:px-6 sm:pt-10 md:min-h-[calc(100svh-6rem)]">
          <p className="inline-flex max-w-sm rounded-full bg-white px-4 py-1.5 text-sm leading-snug text-brand shadow-sm ring-1 ring-brand/20 sm:px-5 sm:py-2 sm:text-base">
            Le comparateur n°1 de vos économies
          </p>

          <h1 className="mt-6 max-w-[26rem] font-manrope text-[1.75rem] font-extrabold leading-[1.2] tracking-tight text-[#3b0764] sm:mt-7 sm:max-w-md sm:text-[2.15rem]">
            Jusqu’à{" "}
            <span className="font-extrabold text-[#c026d3]">450 euros</span>
            <br />
            d’économies / an
            <br />
            sur votre mutuelle
          </h1>

          <div className="mt-3 max-w-md space-y-1.5 text-[0.9375rem] leading-snug sm:mt-4 sm:text-base">
            <p className="font-semibold text-[#c026d3]">
              Devis 100 % gratuit et sans engagement
            </p>
            <p className="text-zinc-600">
              Nos courtiers partenaires recherchent parmi de nombreuses
              mutuelles une offre adaptée à vos besoins, au meilleur tarif
              possible.
            </p>
          </div>

          <a
            href="#formulaire-devis"
            className="mt-6 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full bg-brand px-5 font-sora text-base font-semibold uppercase tracking-wide text-white shadow-[0_14px_32px_-10px_rgba(109,40,217,0.55)] transition hover:bg-[#5b21b6] sm:mt-7 sm:min-h-[3.75rem] sm:px-7 sm:text-lg"
            onClick={() => {
              trackTikTokCtaClick();
            }}
          >
            Obtenir mon tarif
          </a>

          <p className="mt-3 inline-flex items-center gap-1 text-[0.6875rem] font-medium tracking-wide text-zinc-500 sm:text-xs">
            Données sécurisées • En moins d’une minute{" "}
            <span aria-hidden="true">⏱️</span>
          </p>

          <div
            className="relative z-20 mt-auto flex w-full justify-center pt-5 leading-none"
            aria-hidden="true"
          >
            <Image
              src="/images/tiktok-conseillere.png"
              alt=""
              width={574}
              height={670}
              className="block h-[18.5rem] w-auto object-contain object-bottom sm:h-[21.5rem]"
            />
          </div>
        </div>
      </section>

      <section
        id="devis"
        className="relative bg-gradient-to-b from-white via-[#f5f2ff] to-white"
      >
        <div className="relative mx-auto w-full max-w-6xl min-w-0 px-4 pb-6 pt-0 sm:px-6 sm:pb-8 lg:pb-10">
          <div className="relative z-10 mx-auto w-full min-w-0 max-w-xl overflow-x-clip lg:max-w-2xl">
            <QuoteForm
              firstStep="currentMutualTariff"
              firstStepIntro="Votre nouveau tarif en 1 minute"
              careNeedsTitle="Qu’est-ce qui compte le plus pour vous dans votre mutuelle ?"
              coveredPersonsTitle="Qui doit-être assuré ?"
              accentQuestions
              funnel={TIKTOK_FORM_FUNNEL}
            />
          </div>
        </div>
      </section>
    </>
  );
}
