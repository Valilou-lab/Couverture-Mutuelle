import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Gestion des cookies — Couverture Mutuelle",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Gestion des cookies">
      <p>
        Contenu temporaire. La politique cookies (mesure d’audience, pixels
        publicitaires Meta, préférences) sera précisée avant la mise en
        production des campagnes.
      </p>
      <p>
        Aucun bandeau cookies avancé n’est activé pour le moment sur cette
        version.
      </p>
    </LegalPage>
  );
}
