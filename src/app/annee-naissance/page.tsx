import type { Metadata } from "next";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE =
  "Votre année de naissance change le prix de votre mutuelle — Couverture Mutuelle";
const DESCRIPTION =
  "Les assureurs fixent leurs tarifs selon l’âge, avec de gros écarts entre eux. Comparez gratuitement les offres adaptées à votre âge, sans engagement.";

/**
 * Paid landing for the Meta ad « A02 | Année de naissance ».
 * Same page and form as the homepage; only the hero (ad headline and subline)
 * and CTA label differ.
 * Not indexed: duplicate of the homepage content, meant for ad traffic only.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function AnneeNaissancePage() {
  return (
    <SeniorLanding
      ctaLabel="Je demande mon devis"
      mariePrice={39}
      hidePricing
      hero={
        <SeniorHero
          title={
            <>
              Votre année de naissance{" "}
              <span className="text-brand">
                change le prix de votre mutuelle
              </span>
            </>
          }
          subtitle={
            <>
              Les assureurs calculent leurs tarifs selon l’âge, et pour une
              même année de naissance, les écarts entre eux peuvent être
              importants. Indiquez la vôtre dans le formulaire :{" "}
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
