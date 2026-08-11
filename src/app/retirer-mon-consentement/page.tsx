import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Gérer mon consentement — Couverture Mutuelle",
};

function BlockTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-manrope text-xl font-bold tracking-tight text-brand sm:text-2xl">
      {children}
    </h2>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="!mt-6 !mb-2 font-manrope text-base font-bold tracking-tight text-brand sm:text-lg">
      {children}
    </h3>
  );
}

export default function RetirerConsentementPage() {
  return (
    <LegalPage title="Gérer mon consentement" titleClassName="text-brand">
      <p>
        Sur cette page, vous pouvez demander le retrait de votre consentement
        ou accéder à la preuve du consentement donné lors de votre demande sur
        Couverture Mutuelle.
      </p>

      <section className="!mt-8 rounded-[1.5rem] border border-brand/20 bg-brand-soft/40 px-4 py-5 sm:px-5 sm:py-6">
        <BlockTitle>1. Retirer mon consentement</BlockTitle>

        <div className="mt-4 space-y-4">
          <p>
            Vous pouvez retirer votre consentement à tout moment et
            gratuitement en nous adressant un email à{" "}
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
            Afin que nous puissions identifier votre demande et le
            consentement concerné, merci d’indiquer dans votre email&nbsp;:
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
            La demande pourra être traitée lorsque les informations
            communiquées nous permettent d’identifier de manière suffisamment
            fiable la demande initiale. Nous vous invitons donc à renseigner
            les mêmes coordonnées que celles utilisées lors de votre demande
            sur Couverture Mutuelle. En cas d’informations différentes,
            incomplètes ou erronées, nous pourrons vous demander des éléments
            complémentaires nécessaires à l’identification de la demande
            concernée.
          </p>

          <SectionTitle>Traitement de votre retrait</SectionTitle>
          <p>
            Une fois celle-ci identifiée, votre retrait sera enregistré dans
            les meilleurs délais. Si vos données ont déjà été transmises à un
            ou plusieurs partenaires dans le cadre de votre demande, les
            mesures nécessaires seront prises afin que votre retrait soit
            également pris en compte par les partenaires concernés,
            conformément à la réglementation applicable.
          </p>
        </div>
      </section>

      <section className="!mt-6 rounded-[1.5rem] border border-brand/20 bg-brand-soft/40 px-4 py-5 sm:px-5 sm:py-6">
        <BlockTitle>2. Accéder à la preuve de mon consentement</BlockTitle>

        <div className="mt-4 space-y-4">
          <p>
            Vous pouvez également demander, à tout moment et gratuitement, à
            accéder à la preuve du consentement que vous avez donné lors de
            votre demande sur Couverture Mutuelle. Cette preuve vous sera
            communiquée sur un support durable.
          </p>

          <p>
            Afin que nous puissions identifier le consentement concerné,
            adressez votre demande par email à&nbsp;:{" "}
            <a
              href="mailto:conseiller.couverturemutuelle@gmail.com?subject=Demande%20de%20preuve%20de%20mon%20consentement"
              className="font-medium text-brand hover:underline"
            >
              conseiller.couverturemutuelle@gmail.com
            </a>
          </p>

          <SectionTitle>Dans votre email, merci d’indiquer</SectionTitle>
          <ul>
            <li>Nom et prénom</li>
            <li>Numéro de téléphone renseigné lors de votre demande</li>
            <li>Adresse email renseignée lors de votre demande</li>
            <li>
              Objet&nbsp;: «&nbsp;Demande de preuve de mon
              consentement&nbsp;»
            </li>
          </ul>

          <SectionTitle>Important</SectionTitle>
          <p>
            Afin de protéger vos données et de retrouver la bonne demande, les
            informations communiquées doivent nous permettre de vous identifier
            de manière suffisamment fiable.
          </p>
          <p>
            Nous vous invitons donc à utiliser les mêmes coordonnées que celles
            renseignées lors de votre demande sur Couverture Mutuelle.
          </p>
          <p>
            En cas d’informations différentes, incomplètes ou erronées, nous
            pourrons vous demander des éléments complémentaires nécessaires à
            l’identification de la demande concernée.
          </p>

          <SectionTitle>Réception de votre preuve</SectionTitle>
          <p>
            Une fois votre demande identifiée, la preuve de votre consentement
            vous sera communiquée gratuitement, de manière individualisée et
            sur un support durable, dans un délai raisonnable.
          </p>
        </div>
      </section>
    </LegalPage>
  );
}
