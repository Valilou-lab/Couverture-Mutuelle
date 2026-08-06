import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales — Couverture Mutuelle",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <p>
        Contenu temporaire. Les mentions légales définitives (éditeur,
        hébergeur, responsable de publication, SIRET, etc.) seront ajoutées
        prochainement.
      </p>
      <p>
        Pour toute question :{" "}
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
