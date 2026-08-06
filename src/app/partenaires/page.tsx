import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Partenaires — Couverture Mutuelle",
};

export default function PartenairesPage() {
  return (
    <LegalPage title="Partenaires">
      <p>
        Contenu temporaire. La liste officielle des partenaires (courtiers /
        assureurs) sera publiée ici.
      </p>
      <p>
        Couverture Mutuelle collabore avec des partenaires spécialisés en
        mutuelle santé afin de préparer des propositions adaptées à votre
        profil. Aucun logo partenaire n’est affiché sur cette version.
      </p>
    </LegalPage>
  );
}
