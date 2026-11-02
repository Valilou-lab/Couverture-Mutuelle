import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { DevisHero } from "./DevisHero";
import { DevisPartners } from "./DevisPartners";

const CTA_LABEL = "Je vérifie mes offres";

const FAQ = [
  {
    question: "Comment fonctionne ce parcours ?",
    answer:
      "Vous renseignez votre profil, nous vérifions les organismes éligibles, puis vous validez votre dossier uniquement pour ceux qui s’affichent.",
  },
  {
    question: "Mes données sont-elles déjà transmises à un partenaire ?",
    answer:
      "Pas sur cette preview V2. Le scaffold confirme le parcours en local ; Vertikl et `/api/leads` seront branchés ensuite via les adapters.",
  },
  {
    question: "Le comparatif est-il vraiment gratuit ?",
    answer: "Oui, entièrement gratuit et sans engagement.",
  },
] as const;

/**
 * V2 landing for `/devis`.
 * Marketing below the form is hidden from Q2 via `useDevisLandingFocus`
 * inside QuoteFormV2 (DOM hide, natural scroll preserved).
 */
export function DevisLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <SeniorHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px]">
        <DevisHero />
        <DevisPartners />
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
