import type { Metadata } from "next";
import { NouveauParcoursLanding } from "@/components/landing/nouveau-parcours/NouveauParcoursLanding";

const TITLE =
  "Nouveau parcours (démo) — Couverture Mutuelle";
const DESCRIPTION =
  "Parcours expérimental de génération de leads : éligibilité partenaires avant consentement. Démonstration uniquement.";

/**
 * Public demo LP at /nouveau-parcours-demo.
 * Isolated from production funnels (no Vertikl / CAPI Lead / Twilio Verify).
 * noindex: shareable link, not for search indexing.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function NouveauParcoursDemoPage() {
  return <NouveauParcoursLanding />;
}
