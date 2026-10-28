import type { Metadata } from "next";
import { NouveauParcoursLanding } from "@/components/landing/nouveau-parcours/NouveauParcoursLanding";

const TITLE =
  "Nouveau parcours (démo) — Couverture Mutuelle";
const DESCRIPTION =
  "Parcours expérimental de génération de leads : éligibilité partenaires avant consentement. Démonstration uniquement.";

/**
 * Isolated experimental LP. Must not affect production funnels.
 * noindex: preview / client demo only.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function NouveauParcoursPage() {
  return <NouveauParcoursLanding />;
}
