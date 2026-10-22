import type { Metadata } from "next";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE = "Votre tarif mutuelle selon votre âge — Couverture Mutuelle";
const DESCRIPTION =
  "55 ans et plus : comparez gratuitement les tarifs de mutuelle santé selon votre tranche d’âge. Service sans engagement.";

/**
 * Paid landing for the Meta ad « A01 | Tranches d’âge ».
 * Same page and form as the homepage; only the hero (ad headline and subline)
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
              Après 55 ans, le prix d’une mutuelle augmente avec l’âge, et les
              écarts entre assureurs aussi.{" "}
              <strong className="text-brand">
                Comparez gratuitement le tarif adapté à votre âge.
              </strong>
            </>
          }
        />
      }
    />
  );
}
