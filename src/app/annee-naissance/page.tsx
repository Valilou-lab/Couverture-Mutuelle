import type { Metadata } from "next";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE = "Quelle est votre année de naissance ? — Couverture Mutuelle";
const DESCRIPTION =
  "Nés entre 1937 et 1970 : comparez gratuitement les offres de mutuelle santé faites pour votre âge. Service sans engagement.";

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
              Quelle est{" "}
              <span className="text-brand">votre année de naissance</span>
              {"\u00A0?"}
            </>
          }
          subtitle={
            <>
              Indiquez l’année de naissance de la personne à assurer et vos
              priorités :{" "}
              <strong className="text-brand">
                vous recevez des offres adaptées à votre budget
              </strong>
              .
            </>
          }
        />
      }
    />
  );
}
