import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Retirer mon consentement — Couverture Mutuelle",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="!mt-8 !mb-3 font-manrope text-lg font-bold tracking-tight text-brand sm:text-xl">
      {children}
    </h2>
  );
}

export default function RetirerConsentementPage() {
  return (
    <LegalPage title="Retirer mon consentement" titleClassName="text-brand">
      <p>
        Vous pouvez retirer votre consentement à tout moment et gratuitement en
        nous adressant un email à{" "}
        <a
          href="mailto:conseiller.couverturemutuelle@gmail.com?subject=Retrait%20de%20mon%20consentement"
          className="font-medium text-brand hover:underline"
        >
          conseiller.couverturemutuelle@gmail.com
        </a>
        .
      </p>

      <SectionTitle>
        Afin que nous puissions identifier votre demande
      </SectionTitle>
      <p>
        Afin que nous puissions identifier votre demande et le consentement
        concerné, merci d’indiquer dans votre email&nbsp;:
      </p>
      <ul>
        <li>Nom et prénom</li>
        <li>Numéro de téléphone renseigné lors de votre demande</li>
        <li>Adresse email renseignée lors de votre demande</li>
        <li>
          Objet&nbsp;: «&nbsp;Retrait de mon consentement&nbsp;»
        </li>
      </ul>

      <SectionTitle>Important</SectionTitle>
      <p>
        La demande pourra être traitée lorsque les informations communiquées
        nous permettent d’identifier de manière suffisamment fiable la demande
        initiale. Nous vous invitons donc à renseigner les mêmes coordonnées que
        celles utilisées lors de votre demande sur Couverture Mutuelle. En cas
        d’informations différentes, incomplètes ou erronées, nous pourrons vous
        demander des éléments complémentaires nécessaires à l’identification de
        la demande concernée.
      </p>

      <SectionTitle>Traitement de votre retrait</SectionTitle>
      <p>
        Une fois celle-ci identifiée, votre retrait sera enregistré dans les
        meilleurs délais. Si vos données ont déjà été transmises à un ou
        plusieurs partenaires dans le cadre de votre demande, les mesures
        nécessaires seront prises afin que votre retrait soit également pris en
        compte par les partenaires concernés, conformément à la réglementation
        applicable.
      </p>
    </LegalPage>
  );
}
