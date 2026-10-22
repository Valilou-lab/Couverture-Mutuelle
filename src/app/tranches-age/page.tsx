import type { Metadata } from "next";
import { AgeBracketChips } from "@/components/landing/senior/AgeBracketChips";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE = "Votre tarif mutuelle selon votre âge — Couverture Mutuelle";
const DESCRIPTION =
  "55 ans et plus : comparez gratuitement les tarifs de mutuelle santé selon votre tranche d’âge. Service sans engagement.";

/**
 * Paid landing for the Meta ad « A01 | Tranches d’âge ».
 * Same page and form as the homepage; only the hero (ad headline + age bracket chips)
 * and CTA label differ.
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
      ctaLabel="Je compare mon tarif"
      mariePrice={39}
      hidePricing
      hero={
        <SeniorHero
          title={
            <>
              Quel tarif pour{" "}
              <span className="text-brand">{"votre âge\u00a0?"}</span>
            </>
          }
          subtitle={
            <>
              Pour les 55 ans et plus.{" "}
              <strong className="text-brand">
                Gratuit et sans engagement.
              </strong>
            </>
          }
          belowTitle={<AgeBracketChips />}
        />
      }
    />
  );
}
