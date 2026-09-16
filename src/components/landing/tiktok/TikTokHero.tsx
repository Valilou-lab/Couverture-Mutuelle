import Image from "next/image";
import { QuoteForm } from "@/components/form/QuoteForm";

const REASSURANCE = [
  "Comparaison gratuite",
  "Sans engagement",
  "Adapté aux 55 ans et +",
] as const;

/**
 * TikTok landing hero — isolated from the main Hero.
 * First screen is an intro CTA; QuoteForm stays below the mobile fold.
 */

export function TikTokHero() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-brand-soft/80 via-[#f5f2ff] to-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.55),transparent_60%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-3.75rem)] w-full max-w-lg flex-col items-center justify-center px-5 py-8 text-center sm:min-h-[calc(100svh-5.5rem)] sm:px-6 sm:py-10 md:min-h-[calc(100svh-6rem)]">
          <p className="mb-3 inline-flex max-w-sm rounded-full bg-white px-4 py-1.5 text-sm italic leading-snug text-brand shadow-sm ring-1 ring-brand/20 sm:mb-4 sm:px-5 sm:py-2 sm:text-base">
            Le comparateur n°1 de vos économies
          </p>

          <Image
            src="/images/mascotte-sourit-et-salue.png"
            alt=""
            width={160}
            height={160}
            priority
            className="mb-3 h-16 w-auto select-none sm:mb-4 sm:h-[4.5rem]"
          />

          <h1 className="max-w-[20rem] font-manrope text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-[#3b0764] sm:max-w-md sm:text-[2.15rem]">
            Comparez les mutuelles en moins de{" "}
            <span className="font-extrabold text-[#c026d3]">1&nbsp;minute</span>
          </h1>

          <p className="mt-3 max-w-sm text-[0.9375rem] leading-snug text-zinc-600 sm:mt-4 sm:text-base">
            Votre devis gratuit et sans engagement parmi les meilleures offres du marché
          </p>

          <ul className="mt-5 flex max-w-sm flex-wrap items-center justify-center gap-2 sm:mt-6">
            {REASSURANCE.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3b0764] shadow-sm ring-1 ring-brand/15 sm:text-sm"
              >
                <span
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-[0.625rem] font-bold text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="#formulaire-devis"
            className="tiktok-cta mt-7 inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2.5 rounded-full bg-brand px-5 font-sora text-base font-semibold uppercase tracking-wide text-white sm:mt-8 sm:min-h-[3.75rem] sm:gap-3 sm:px-7 sm:text-lg"
          >
            <span
              aria-hidden="true"
              className="tiktok-cta-arrow text-lg leading-none sm:text-xl"
            >
              ↓
            </span>
            Obtenir mon devis
            <span
              aria-hidden="true"
              className="tiktok-cta-arrow text-lg leading-none sm:text-xl"
            >
              ↓
            </span>
          </a>

          <p className="mt-3 text-[0.6875rem] font-medium tracking-wide text-zinc-500 sm:text-xs">
            Gratuit • Données sécurisées • Demande rapide
          </p>
        </div>
      </section>

      <section
        id="devis"
        className="relative scroll-mt-24 bg-gradient-to-b from-white via-[#f5f2ff] to-white"
      >
        <div className="relative mx-auto w-full max-w-6xl min-w-0 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:pb-10 lg:pt-8">
          <div className="relative z-10 mx-auto w-full min-w-0 max-w-xl overflow-x-clip lg:max-w-2xl">
            <QuoteForm
              firstStep="healthRegime"
              firstStepIntro="Comparez en 1 minute"
              firstStepNote="couverturemutuelle.fr s’engage à vous mettre en relation avec des courtiers certifiés en moins de 30 minutes."
              careNeedsTitle="Qu’est-ce qui compte le plus pour vous dans votre mutuelle ?"
              coveredPersonsTitle="Qui doit-être assuré ?"
              accentQuestions
            />
          </div>
        </div>
      </section>
    </>
  );
}
