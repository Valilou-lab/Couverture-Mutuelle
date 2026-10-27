import type { Metadata } from "next";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE = "Votre âge fixe le prix de votre mutuelle — Couverture Mutuelle";
const DESCRIPTION =
  "Après 55 ans, les tarifs augmentent à chaque tranche d’âge, avec de gros écarts entre assureurs. Comparez gratuitement les offres, sans engagement.";

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
          imageSrc="/images/hero-couple-canape-v4.jpg"
          imageAlt="Couple de retraités souriants assis sur un canapé"
          title={
            <>
              Votre âge{" "}
              <span className="text-brand">fixe le prix de votre mutuelle</span>
            </>
          }
          subtitle={
            <>
              Après 55 ans, les tarifs augmentent à chaque tranche d’âge, et
              pour un même âge, les écarts entre assureurs peuvent être
              importants. Indiquez votre date de naissance dans le formulaire :{" "}
              <strong className="text-brand">
                nous comparons pour vous les offres adaptées à votre âge
              </strong>
              , gratuitement et sans engagement.
            </>
          }
        />
      }
    />
  );
}
