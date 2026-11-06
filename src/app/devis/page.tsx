import type { Metadata } from "next";
import { DevisLanding } from "@/components/landing/devis/DevisLanding";

const TITLE = "Devis mutuelle — Couverture Mutuelle";
const DESCRIPTION =
  "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.";

/**
 * Future production LP at /devis.
 * Scaffold only on Preview — noindex until go-live.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function DevisPage() {
  return <DevisLanding />;
}
