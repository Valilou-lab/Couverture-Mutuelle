import type { Metadata } from "next";
import { SeniorHero } from "@/components/landing/senior/SeniorHero";
import { SeniorLanding } from "@/components/landing/senior/SeniorLanding";

const TITLE =
  "Une mutuelle adaptée à votre année de naissance — Couverture Mutuelle";
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
              Une mutuelle adaptée à{" "}
              <span className="text-brand">votre année de naissance</span>
            </>
          }
          subtitle={
            <>
              Nés entre 1937 et 1970 :{" "}
              <strong className="text-brand">
                comparez gratuitement les offres faites pour votre âge
              </strong>
              , sans engagement.
            </>
          }
        />
      }
    />
  );
}
