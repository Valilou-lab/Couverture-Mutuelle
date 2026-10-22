import type { Metadata } from "next";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE = "Votre tarif mutuelle selon votre âge — Couverture Mutuelle";
const DESCRIPTION =
  "55 ans et plus : comparez gratuitement les tarifs de mutuelle santé selon votre tranche d’âge. Service sans engagement.";

/**
 * Paid landing for the Meta ad « A01 | Tranches d’âge ».
 * Same page and form as the homepage, with an age-bracket first question.
 * Not indexed: duplicate of the homepage content, meant for ad traffic only.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function TranchesAgePage() {
  return (
    <SeniorLanding
      questionsCount={6}
      ctaLabel="Je compare mon tarif"
      hero={
        <SeniorHero
          title={
            <>
              Votre tarif mutuelle{" "}
              <span className="text-[#a78bfa]">selon votre âge</span>
            </>
          }
          subtitle={
            <>
              Pour les 55 ans et plus.{" "}
              <strong className="text-brand">
                Comparaison gratuite et sans engagement
              </strong>
              , un conseiller vous rappelle avec les offres adaptées.
            </>
          }
          form={
            <SeniorQuoteForm
              askAgeBracket
              ageBracketTitle="Quel tarif pour votre âge ?"
              firstStepIntro="Votre tarif en 1 minute"
            />
          }
        />
      }
    />
  );
}
