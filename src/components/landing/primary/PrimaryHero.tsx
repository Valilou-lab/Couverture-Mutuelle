"use client";

import Image from "next/image";
import { ConversionQuoteForm } from "@/components/form/ConversionQuoteForm";
import { PartnerLogoCarousel } from "@/components/landing/primary/PartnerLogoCarousel";
import { PrimaryTrustSection } from "@/components/landing/primary/PrimaryTrustSection";
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

function DesktopTrustCheck() {
  return (
    <Image
      src="/images/Pictos/picto-check-vert.webp"
      alt=""
      width={28}
      height={28}
      className="mt-0.5 h-7 w-7 shrink-0 object-contain"
    />
  );
}

const DESKTOP_TRUST_ITEMS = [
  "Gratuit",
  "Sans engagement",
  "Données sécurisées",
  "Partenaires professionnels sélectionnés",
] as const;

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

function PartnersSelectedBadge() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-[#ede9fe] px-3.5 py-1.5 text-sm font-medium text-[#5b21b6]">
      <Image
        src="/images/Pictos/picto-partenaires-v3.png"
        alt=""
        width={56}
        height={43}
        className="h-5 w-auto shrink-0 object-contain"
      />
      Partenaires sélectionnés
    </p>
  );
}

export function PrimaryHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="relative">
        <div className="relative isolate lg:min-h-[715px] lg:bg-[#f4f1fa]">
          {/* Desktop décor only: fixed band, never tied to form height. */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-[715px] overflow-hidden lg:block"
            aria-hidden="true"
          >
            <Image
              src="/images/hero-couple-canape-v4.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 100vw, 1px"
              className="object-cover object-[36%_center] brightness-[0.99] saturate-[0.93] contrast-[1]"
              quality={100}
              unoptimized
            />
            <div className="absolute inset-y-0 left-0 w-[34%] bg-gradient-to-r from-[#f4f1fa] via-[#f4f1fa]/55 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fbfaff] to-transparent" />
          </div>

          <div className="primary-hero-desktop relative z-10 lg:mx-auto lg:max-w-[84rem] lg:px-10 lg:py-8">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(24.5rem,26.5rem)] lg:items-start lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,27rem)] xl:gap-x-12">
              <section className="relative bg-gradient-to-b from-brand-soft/80 via-[#f5f2ff] to-white lg:z-10 lg:bg-none">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.55),transparent_60%)] lg:hidden" />

                <div className="relative mx-auto flex min-h-[calc(100svh-3.75rem)] w-full max-w-lg flex-col items-center px-5 pt-8 text-center sm:min-h-[calc(100svh-5.5rem)] sm:max-w-xl sm:px-6 sm:pt-10 md:min-h-[calc(100svh-6rem)] lg:min-h-0 lg:max-w-none lg:items-start lg:px-0 lg:pt-0 lg:text-left">
                  <div className="relative z-10 hidden w-full lg:block">
                    <PartnersSelectedBadge />

                    <h1 className="hero-display mt-3 max-w-[26rem] font-manrope text-[2.25rem] font-semibold leading-[1.12] tracking-tight text-[#3b0764] xl:max-w-[28rem] xl:text-[2.5rem]">
                      Payez-vous encore le juste prix pour{" "}
                      <span className="text-[#c026d3]">votre mutuelle</span>
                      &nbsp;?
                    </h1>

                    <p className="mt-2 max-w-md text-[1.05rem] font-medium leading-snug text-zinc-600">
                      Comparez gratuitement les tarifs et garanties adaptés à
                      votre profil.
                    </p>

                    <div className="mt-3 inline-flex w-fit max-w-none items-center rounded-2xl bg-[#c026d3]/16 px-3 py-1">
                      <p className="hero-display whitespace-nowrap font-manrope text-[1.5rem] font-semibold leading-[1.12] tracking-tight text-[#3b0764] xl:text-[1.625rem]">
                        Jusqu’à{" "}
                        <span className="text-[#c026d3]">
                          450&nbsp;€ d’économies
                        </span>
                        /an
                        <span className="font-normal">*</span>
                      </p>
                    </div>
                    <p className="mt-1.5 max-w-sm text-[0.6875rem] leading-tight text-zinc-500">
                      *Économie potentielle variable selon le profil, le
                      contrat actuel et les offres disponibles.
                    </p>

                    <ul className="mt-3.5 space-y-2">
                      {DESKTOP_TRUST_ITEMS.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-[1.05rem] font-medium leading-snug text-[#3b0764]"
                        >
                          <DesktopTrustCheck />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex min-h-0 w-full flex-1 flex-col items-center lg:hidden">
                  <h1 className="hero-display mt-6 w-full max-w-md font-manrope text-[1.5rem] font-medium leading-[1.2] tracking-tight text-[#3b0764] sm:mt-7 sm:max-w-lg sm:text-[2.15rem]">
                    Payez-vous encore le{" "}
                    <span className="whitespace-nowrap">juste prix</span>
                    <br />
                    pour{" "}
                    <span className="text-[#c026d3]">votre mutuelle</span>
                    &nbsp;?
                  </h1>

                  <div className="mt-3 box-border w-full max-w-md px-4 sm:max-w-lg sm:px-5">
                    <p className="hero-display w-full max-w-full text-center font-manrope text-[clamp(1.85rem,8.4vw,3rem)] font-semibold leading-[1.12] tracking-tight text-[#3b0764]">
                      Jusqu’à{" "}
                      <span className="text-[#c026d3]">
                        450&nbsp;€ d’économies
                      </span>
                      /an
                      <span className="font-normal">*</span>
                    </p>
                    <p className="mt-0.5 text-[0.625rem] italic leading-tight text-zinc-400 sm:text-[0.6875rem]">
                      *Économie potentielle variable selon le profil, le contrat
                      actuel et les offres disponibles.
                    </p>
                  </div>

                  <div className="mt-auto flex w-full flex-col items-center">
                    <a
                      href="#formulaire-devis"
                      className="mt-6 inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-full bg-brand px-5 font-sora text-base font-semibold uppercase tracking-wide text-white shadow-[0_14px_32px_-10px_rgba(109,40,217,0.55)] transition hover:bg-[#5b21b6] sm:mt-7 sm:min-h-[3.75rem] sm:px-7 sm:text-lg"
                      onClick={() => {
                        trackTikTokCtaClick();
                      }}
                    >
                      Comparer mes tarifs
                    </a>

                    <p className="mt-2 inline-flex max-w-sm flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-sm font-semibold leading-none text-[#2e1065]">
                      <span className="inline-flex items-center gap-1.5">
                        <TrustCheckIcon />
                        Gratuit
                      </span>
                      <span
                        className="select-none text-[#2e1065]/35"
                        aria-hidden="true"
                      >
                        •
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <TrustCheckIcon />
                        Sans engagement
                      </span>
                    </p>
                  </div>

                  <div
                    className="relative z-20 mt-auto flex w-full justify-center pt-5 leading-none"
                    aria-hidden="true"
                  >
                    <AdvisorPhoto />
                  </div>
                  </div>
                </div>
              </section>

              <section
                id="devis"
                className="relative bg-gradient-to-b from-white via-[#f5f2ff] to-white lg:z-20 lg:bg-none lg:pt-0"
              >
                <div className="relative mx-auto w-full max-w-6xl min-w-0 px-4 pb-6 pt-0 sm:px-6 sm:pb-8 lg:max-w-none lg:px-0 lg:pb-0 lg:pt-0">
                  <div className="relative z-20 mx-auto w-full min-w-0 max-w-xl overflow-x-clip lg:ml-0 lg:max-w-none">
                    <ConversionQuoteForm />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <PrimaryTrustSection />
        <PartnerLogoCarousel />
      </div>
    </>
  );
}
