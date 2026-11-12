import type { ReactNode } from "react";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { RacCta, RacFaq } from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { TrustpilotMini } from "@/components/trustpilot/TrustpilotMini";
import { SeniorFooter } from "./SeniorFooter";
import { SeniorHeader } from "./SeniorHeader";
import { SeniorHero } from "./SeniorHero";
import {
  SeniorFaq,
  SeniorFinalCta,
  SeniorGuarantees,
  SeniorPartners,
  SeniorPeople,
  SeniorPricing,
  SeniorSteps,
} from "./SeniorSections";
import { SeniorStickyCta } from "./SeniorStickyCta";

const TRANCHES_FAQ = [
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
  {
    question: "Combien de temps prend le formulaire ?",
    answer: "Moins d’une minute : 6 questions.",
  },
] as const;

type SeniorLandingProps = {
  /** Extra classes (used by `/tranches-age` for the Inter type scale). */
  className?: string;
  /** Defaults to the homepage hero (/). */
  hero?: ReactNode;
  /** Main CTA label (final + sticky). Defaults to « Je compare gratuitement ». */
  ctaLabel?: string;
  /** New monthly price shown in Marie's testimonial. Defaults to 74. */
  mariePrice?: number;
  /** Hide the pricing table section. Defaults to false (shown). */
  hidePricing?: boolean;
};

/** /tranches-age: homepage mobile template, existing desktop layout. One form. */
export function SeniorLanding({
  className,
  hero = <SeniorHero />,
  ctaLabel,
  mariePrice,
  hidePricing = false,
}: SeniorLandingProps = {}) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="lg:hidden">
        <SeniorHeader bordered={false} logoCentered showWhatsApp={false} />
      </div>
      <div className="hidden lg:block">
        <SeniorHeader showWhatsApp={false} />
      </div>

      <div className="bg-white lg:hidden">
        <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
          <div className="mx-auto grid max-w-[760px] pb-2 pt-2 text-center">
            <h1 className="text-balance text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif]">
              <span className="block text-zinc-900">
                Quel tarif pour votre âge&nbsp;?
              </span>
              <span className="block text-[#9b4ff0]">
                Recevez vos propositions gratuitement
              </span>
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-[#ede9fe] lg:bg-transparent">
        <div className="mx-auto w-full max-w-[640px] px-4 min-[900px]:max-w-[1100px] lg:grid lg:grid-cols-[1fr_470px] lg:items-start lg:gap-10 lg:pt-3">
          <div className="hidden lg:block">{hero}</div>
          <div id="devis" className="scroll-mt-4 pb-5 pt-4 lg:pb-0 lg:pt-0">
            <TikTokFunnelTracker />
            <SeniorQuoteForm
              redesignIntro="mobile"
              askAgeInsteadOfBirthDate
            />
          </div>
        </div>
      </section>

      <div className="lg:hidden">
        <HomeLpBelowForm
          needsText="en 1 minute"
          quotesTitle="Vos devis adaptés :"
          quotesText="selon vos informations"
          signText="Nous nous occupons des démarches de résiliation"
        />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
          <RacFaq items={TRANCHES_FAQ} />
          <RacCta label="MON DEVIS GRATUIT" />
        </div>
        <TrustpilotMini />
      </div>

      <main className="mx-auto hidden w-full max-w-[640px] flex-1 px-4 min-[900px]:max-w-[1100px] lg:block">
        <SeniorPartners />
        <SeniorSteps />
        <SeniorPeople mariePrice={mariePrice} />
        {!hidePricing && <SeniorPricing />}
        <SeniorGuarantees />
        <SeniorFaq />
        <SeniorFinalCta ctaLabel={ctaLabel} />
      </main>
      <SeniorFooter />
      <SeniorStickyCta ctaLabel={ctaLabel} />
    </div>
  );
}
