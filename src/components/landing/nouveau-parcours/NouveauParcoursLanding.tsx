import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorPartners } from "@/components/landing/senior/SeniorSections";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { NouveauParcoursHero } from "./NouveauParcoursHero";

const CTA_LABEL = "Je vérifie mes offres";

const FAQ = [
  {
    question: "En quoi ce parcours est-il différent ?",
    answer:
      "Vous voyez d’abord quels organismes sont susceptibles de vous contacter, puis vous donnez votre accord. Aucun lead n’est envoyé dans cette démonstration.",
  },
  {
    question: "Mes données sont-elles transmises à Vertikl ?",
    answer:
      "Non sur cette page de démonstration. Aucun lead n’est vendu ni transmis à un partenaire.",
  },
  {
    question: "Le comparatif est-il vraiment gratuit ?",
    answer: "Oui, entièrement gratuit et sans engagement.",
  },
] as const;

/**
 * Isolated demo landing for /nouveau-parcours.
 * Reuses CM visual chrome; does not use QuoteForm or production lead APIs.
 */
export function NouveauParcoursLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <SeniorHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px]">
        <NouveauParcoursHero />
        <SeniorPartners />
        <RacAdvantages />
        <RacCta label={CTA_LABEL} />
        <RacFaq items={[...FAQ]} />
        <RacCta label={CTA_LABEL} />
      </main>
      <SeniorFooter />
      <SeniorStickyCta ctaLabel={CTA_LABEL} />
    </div>
  );
}
