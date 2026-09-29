"use client";

import Image from "next/image";
import { ConversionQuoteForm } from "@/components/form/ConversionQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { trackTikTokCtaClick } from "@/lib/tiktok-funnel";

function TrustCheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-[#5b21b6]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.4 8.2 6.3 11l6.3-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdvisorPhoto({ className }: { className?: string }) {
  return (
    <Image
      src="/images/tiktok-conseillere.png"
      alt=""
      width={574}
      height={670}
      className={
        className ??
        "block h-[18.5rem] w-auto object-contain object-bottom sm:h-[21.5rem]"
      }
    />
  );
}

export function PrimaryHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="relative lg:bg-gradient-to-b lg:from-brand-soft/80 lg:via-[#f5f2ff] lg:to-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-80 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.55),transparent_60%)] lg:block" />

        <div className="relative lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:items-start lg:gap-x-12 lg:px-8 lg:pb-12 lg:pt-8">
          <section className="relative bg-gradient-to-b from-brand-soft/80 via-[#f5f2ff] to-white lg:bg-none">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.55),transparent_60%)] lg:hidden" />

            <div className="relative mx-auto flex min-h-[calc(100svh-3.75rem)] w-full max-w-lg flex-col items-center px-5 pt-8 text-center sm:min-h-[calc(100svh-5.5rem)] sm:max-w-xl sm:px-6 sm:pt-10 md:min-h-[calc(100svh-6rem)] lg:min-h-0 lg:max-w-none lg:items-start lg:px-0 lg:pt-4 lg:text-left">
              <p className="inline-flex max-w-sm rounded-full bg-white px-4 py-1.5 text-sm leading-snug text-brand shadow-sm ring-1 ring-brand/20 sm:px-5 sm:py-2 sm:text-base">
                Le comparateur n°1 de vos économies
              </p>

              <h1 className="mt-6 max-w-[19rem] font-manrope text-[1.75rem] font-extrabold leading-[1.18] tracking-tight text-[#3b0764] sm:mt-7 sm:max-w-lg sm:text-[2.15rem] lg:max-w-[36rem] lg:text-[2.85rem] lg:leading-[1.1]">
                Payez-vous encore le{" "}
                <span className="whitespace-nowrap font-extrabold text-[#c026d3]">
                  juste prix
                </span>
                <br />
                pour votre mutuelle&nbsp;?
              </h1>

              <div className="mt-3 max-w-sm space-y-0 text-center lg:max-w-md lg:text-left">
                <p className="text-base font-bold tracking-tight text-[#c026d3] sm:text-[1.0625rem] lg:text-lg">
                  Jusqu’à 450&nbsp;€ d’économies/an*
                </p>
                <p className="mt-0.5 text-[0.625rem] italic leading-tight text-zinc-400 sm:text-[0.6875rem]">
                  *Économie potentielle variable selon le profil, le contrat
                  actuel et les offres disponibles.
                </p>
              </div>

              <p className="mt-3 max-w-md text-[0.9375rem] font-medium leading-snug text-zinc-600 sm:mt-4 sm:text-base lg:max-w-lg lg:text-[1.0625rem]">
                Comparez gratuitement les tarifs et garanties adaptés à votre
                profil.
              </p>

              <a
                href="#formulaire-devis"
                className="mt-6 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full bg-brand px-5 font-sora text-base font-semibold uppercase tracking-wide text-white shadow-[0_14px_32px_-10px_rgba(109,40,217,0.55)] transition hover:bg-[#5b21b6] sm:mt-7 sm:min-h-[3.75rem] sm:px-7 sm:text-lg lg:w-auto lg:min-w-[17rem]"
                onClick={() => {
                  trackTikTokCtaClick();
                }}
              >
                Comparer mes tarifs
              </a>

              <p className="mt-2.5 inline-flex max-w-sm items-center justify-center gap-1.5 text-[0.75rem] font-medium leading-none text-zinc-600 lg:justify-start lg:max-w-md sm:text-[0.8125rem]">
                <Image
                  src="/images/Pictos/picto-securite-donnees.png"
                  alt=""
                  width={20}
                  height={18}
                  className="h-5 w-5 shrink-0 object-contain"
                />
                Vos données sont sécurisées
              </p>

              <p className="mt-2 inline-flex max-w-sm flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-sm font-semibold leading-none text-[#2e1065] lg:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <TrustCheckIcon />
                  Gratuit
                </span>
                <span className="select-none text-[#2e1065]/35" aria-hidden="true">
                  •
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TrustCheckIcon />
                  Sans engagement
                </span>
              </p>

              <div
                className="relative z-20 mt-auto flex w-full justify-center pt-5 leading-none lg:hidden"
                aria-hidden="true"
              >
                <AdvisorPhoto />
              </div>
            </div>
          </section>

          <section
            id="devis"
            className="relative bg-gradient-to-b from-white via-[#f5f2ff] to-white lg:bg-none"
          >
            <div
              className="relative z-20 hidden w-full justify-center leading-none lg:flex"
              aria-hidden="true"
            >
              <AdvisorPhoto className="block h-[22rem] w-auto object-contain object-bottom" />
            </div>
            <div className="relative mx-auto w-full max-w-6xl min-w-0 px-4 pb-6 pt-0 sm:px-6 sm:pb-8 lg:max-w-none lg:px-0 lg:pb-0">
              <div className="relative z-10 mx-auto w-full min-w-0 max-w-xl overflow-x-clip lg:max-w-none">
                <ConversionQuoteForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
