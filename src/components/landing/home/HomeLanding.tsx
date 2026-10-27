import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorPartners } from "@/components/landing/senior/SeniorSections";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
  RacPeople,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { HomeHero } from "./HomeHero";
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

/**
 * Homepage (/) with the /reste-a-charge layout: short, form-first page,
 * then supporting blocks. Same form, header, footer and sticky CTA.
 */
export function HomeLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <SeniorHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px]">
        <HomeHero />
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
