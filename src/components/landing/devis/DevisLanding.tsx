import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorPartners } from "@/components/landing/senior/SeniorSections";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
} from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { FormReassuranceSteps } from "@/components/landing/FormReassuranceSteps";
import { HomeWhy } from "@/components/landing/home/HomeWhy";
import { DevisHero } from "./DevisHero";

const CTA_LABEL = "Je compare gratuitement";

/** V2-specific reassurance — explains pre-eligibility before consent. */
const DEVIS_REASSURANCE_STEPS = [
  {
    number: "1",
    title: "Vous nous indiquez vos besoins",
    text: "Vous renseignez votre profil, vos garanties actuelles et ce que vous souhaitez améliorer.",
  },
  {
    number: "2",
    title: "Nous recherchons les solutions disponibles",
    text: "Nous vérifions les organismes susceptibles de proposer une solution adaptée à votre profil avant de vous demander votre accord.",
  },
  {
    number: "3",
    title: "Vous gardez le contrôle",
    text: "Vous choisissez si vous souhaitez être contacté(e) par les organismes proposés. Vous restez libre de poursuivre, de comparer ou de ne rien changer.",
  },
] as const;

const DEVIS_REASSURANCE_NOTE =
  "Vos coordonnées ne sont transmises qu’aux organismes pour lesquels vous avez donné votre accord.";

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
    question: "Quand mes données sont-elles transmises ?",
    answer:
      "Uniquement après votre accord, et seulement aux organismes affichés comme pouvant vous proposer un devis.",
  },
  {
    question: "Puis-je comparer si j’ai déjà une mutuelle ?",
    answer: "Oui. Après un an de contrat, vous pouvez changer à tout moment.",
  },
] as const;

/**
 * V2 landing for `/devis`.
 * Same visual shell as `/` (HomeLanding); form stays QuoteFormV2.
 * Marketing below the form is hidden from Q2 via `useDevisLandingFocus`
 * inside QuoteFormV2 (DOM hide, natural scroll preserved).
 *
 * Layout note: « Comment ça se passe » sits in the form branch so it stays
 * visible after Q1 (same idea as `/`), while partners / SEO / footer hide.
 */
export function DevisLanding() {
  return (
    <div className="main-lp-redesign flex min-h-0 flex-1 flex-col bg-[#e8f2fb] text-[18px] leading-[1.55] text-foreground">
      <div className="border-b border-[#ddd6fe] bg-white">
        <SeniorHeader bordered={false} logoCentered />
        <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
          <DevisHero.Titles />
        </div>
      </div>
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px] lg:max-w-[1220px]">
        {/* Form branch: kept by useDevisLandingFocus when focused */}
        <div>
          <DevisHero.Form />
          <div className="mx-auto w-full max-w-[640px] min-[700px]:max-w-[1000px]">
            <FormReassuranceSteps
              steps={[...DEVIS_REASSURANCE_STEPS]}
              note={DEVIS_REASSURANCE_NOTE}
            />
          </div>
        </div>
        {/* Hidden from Q2 by useDevisLandingFocus */}
        <div className="mx-auto w-full max-w-[640px] min-[700px]:max-w-[1000px]">
          <SeniorPartners />
          <RacAdvantages />
          <HomeWhy />
          <RacCta label={CTA_LABEL} />
          <RacFaq items={[...FAQ]} />
          <RacCta label={CTA_LABEL} />
        </div>
      </main>
      <SeniorFooter />
    </div>
  );
}
