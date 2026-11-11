import Image from "next/image";
import Link from "next/link";
import { WhatsAppHeaderButton } from "@/components/landing/WhatsAppHeaderButton";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorPartners } from "@/components/landing/senior/SeniorSections";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
  RacPeople,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { HomeHeroForm } from "./HomeHero";
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

/** Header as on / between 27 Oct and 4 Nov (logo left, WhatsApp « Nous contacter » right). */
function HomeClassicHeader() {
  return (
    <header className="border-b border-[#ddd6fe] bg-white">
      <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Couverture Mutuelle">
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={782}
            height={357}
            loading="eager"
            fetchPriority="high"
            className="block h-11 w-auto"
          />
        </Link>
        <WhatsAppHeaderButton classicSize />
      </div>
    </header>
  );
}

/** Hero as on / between 27 Oct and 4 Nov: headline + subline, then the form, centred. */
function HomeClassicHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="mx-auto grid max-w-[760px] gap-2.5 pb-4 pt-[22px] text-center min-[900px]:pt-9">
        <h1 className="text-balance font-poppins text-[clamp(1.55rem,6.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
          Anticipez la hausse de votre mutuelle et{" "}
          <span className="text-brand">économisez dès maintenant</span>
        </h1>
        <p className="text-balance font-poppins text-[clamp(1.1rem,4.4vw,1.4rem)] font-bold leading-snug text-[#3b0764]">
          Comparez en 1 minute.{" "}
          <span className="text-brand">Un conseiller vous rappelle</span> avec les
          offres adaptées à votre âge.
        </p>
      </div>
      {/*
        Current lead form block exactly as HomeLanding renders it on main:
        same HomeHeroForm wrapper (id="devis", SeniorQuoteForm redesignIntro,
        no side photo), same desktop width, same Tahoma font scope
        (main-lp-redesign) and the Google rating line right under it.
      */}
      <div className="main-lp-redesign">
        <div className="lg:mx-auto lg:max-w-[34rem]">
          <HomeHeroForm showPhoto={false} />
        </div>
      </div>
    </>
  );
}

/**
 * Homepage (/) — page layout restored to the version live 27 Oct–4 Nov 2026
 * (PR #7 « reste à charge » layout, state at f04bca9), around the current
 * lead form. `/tiktok` keeps the redesigned `HomeLanding`.
 */
export function HomeClassicLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <HomeClassicHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px]">
        <HomeClassicHero />
        <SeniorPartners />
        <RacAdvantages />
        <HomeWhy />
        <RacCta label={CTA_LABEL} />
        <RacFaq items={FAQ} />
        <RacCta label={CTA_LABEL} />
        <RacPeople mariePrice={74} />
      </main>
      <SeniorFooter />
      <SeniorStickyCta ctaLabel={CTA_LABEL} />
    </div>
  );
}
