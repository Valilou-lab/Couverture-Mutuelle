import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Couverture Mutuelle",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        Contenu temporaire. Cette page décrira bientôt en détail le traitement
        de vos données personnelles dans le cadre des demandes de devis.
      </p>
      <p>
        Dès à présent : vos données ne sont pas réutilisées à des fins
        commerciales tierces. Vous pouvez demander leur retrait à{" "}
        <a
          href="mailto:conseiller.couverturemutuelle@gmail.com"
          className="font-medium text-brand hover:underline"
        >
          conseiller.couverturemutuelle@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
