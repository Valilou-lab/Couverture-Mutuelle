import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Politique de cookies — Couverture Mutuelle",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="!mt-8 !mb-3 font-manrope text-lg font-bold tracking-tight text-brand sm:text-xl">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="!mt-5 !mb-2 font-manrope text-base font-bold text-brand">
      {children}
    </h3>
  );
}

export default function CookiesPage() {
  return (
    <LegalPage title="Politique de cookies" titleClassName="text-brand">
      <p className="text-sm text-zinc-500">
        Dernière mise à jour&nbsp;: 7 août 2026
      </p>

      <SectionTitle>1. Introduction</SectionTitle>
      <p>
        La présente Politique de cookies explique comment le site{" "}
        <strong>Couverture Mutuelle</strong>, édité par{" "}
        <strong>VALEADATA SL</strong>, utilise des cookies et autres technologies
        similaires lors de votre navigation.
      </p>
      <p>Elle vous informe notamment sur&nbsp;:</p>
      <ul>
        <li>ce qu’est un cookie&nbsp;;</li>
        <li>les catégories de cookies susceptibles d’être utilisées&nbsp;;</li>
        <li>leurs finalités&nbsp;;</li>
        <li>les tiers susceptibles de les déposer&nbsp;;</li>
        <li>
          et les moyens dont vous disposez pour accepter, refuser ou modifier
          vos choix.
        </li>
      </ul>
      <p>
        Cette Politique de cookies complète notre{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-brand hover:underline"
        >
          Politique de confidentialité
        </Link>{" "}
        et nos{" "}
        <Link
          href="/mentions-legales"
          className="font-medium text-brand hover:underline"
        >
          Mentions légales
        </Link>
        .
      </p>

      <SectionTitle>2. Responsable du traitement</SectionTitle>
      <p>Le site Couverture Mutuelle est édité par&nbsp;:</p>
      <ul>
        <li>
          <strong>VALEADATA SL</strong>
        </li>
        <li>
          Nom commercial&nbsp;: <strong>Couverture Mutuelle</strong>
        </li>
        <li>
          NIF&nbsp;: <strong>B88944939</strong>
        </li>
        <li>Carrer Palma de Sant Just, 5</li>
        <li>08002 Barcelone</li>
        <li>Espagne</li>
        <li>
          Email&nbsp;:{" "}
          <a
            href="mailto:conseiller.couverturemutuelle@gmail.com"
            className="font-medium text-brand hover:underline"
          >
            conseiller.couverturemutuelle@gmail.com
          </a>
        </li>
      </ul>
      <p>
        Pour toute question relative aux cookies ou à la protection de vos
        données personnelles, vous pouvez nous contacter à cette adresse.
      </p>

      <SectionTitle>3. Qu’est-ce qu’un cookie&nbsp;?</SectionTitle>
      <p>
        Un cookie est un petit fichier ou élément d’information susceptible
        d’être enregistré sur votre ordinateur, smartphone, tablette ou autre
        terminal lorsque vous consultez un site internet.
      </p>
      <p>
        Les cookies et technologies similaires peuvent notamment permettre&nbsp;:
      </p>
      <ul>
        <li>d’assurer le fonctionnement technique du site&nbsp;;</li>
        <li>de mémoriser certains choix&nbsp;;</li>
        <li>de mesurer l’audience et les performances du site&nbsp;;</li>
        <li>
          de comprendre la manière dont les visiteurs utilisent le site&nbsp;;
        </li>
        <li>de mesurer l’efficacité de nos campagnes publicitaires&nbsp;;</li>
        <li>
          sous réserve de votre consentement, de personnaliser ou mesurer
          certaines actions publicitaires.
        </li>
      </ul>
      <p>
        Certains cookies sont déposés directement par Couverture Mutuelle.
        D’autres peuvent être déposés par des services tiers intégrés au site.
      </p>

      <SectionTitle>4. Les différentes catégories de cookies</SectionTitle>

      <SubTitle>Cookies strictement nécessaires</SubTitle>
      <p>
        Ces cookies sont indispensables au fonctionnement du site et à la
        fourniture des services demandés par l’utilisateur.
      </p>
      <p>Ils peuvent notamment permettre&nbsp;:</p>
      <ul>
        <li>le fonctionnement technique du site&nbsp;;</li>
        <li>la sécurité du site&nbsp;;</li>
        <li>le fonctionnement des formulaires&nbsp;;</li>
        <li>
          la conservation temporaire des informations nécessaires au
          parcours&nbsp;;
        </li>
        <li>la mémorisation de vos choix concernant les cookies.</li>
      </ul>
      <p>
        Ces cookies ne nécessitent pas votre consentement lorsqu’ils sont
        strictement nécessaires au fonctionnement du service.
      </p>
      <p>
        Ils ne peuvent pas toujours être désactivés depuis notre outil de
        gestion des cookies.
      </p>

      <SubTitle>Cookies de préférence ou de fonctionnalité</SubTitle>
      <p>
        Ces cookies permettent de mémoriser certains choix afin d’améliorer
        votre expérience de navigation.
      </p>
      <p>
        Ils peuvent par exemple mémoriser certaines préférences d’affichage ou
        informations nécessaires au fonctionnement d’une fonctionnalité.
      </p>
      <p>
        Lorsqu’ils ne sont pas strictement nécessaires au service demandé, ils
        ne sont utilisés qu’après recueil de votre consentement lorsque
        celui-ci est requis.
      </p>

      <SubTitle>Cookies de mesure d’audience</SubTitle>
      <p>
        Ces cookies permettent de comprendre la manière dont les visiteurs
        utilisent Couverture Mutuelle.
      </p>
      <p>Ils peuvent notamment permettre de mesurer&nbsp;:</p>
      <ul>
        <li>le nombre de visiteurs&nbsp;;</li>
        <li>les pages consultées&nbsp;;</li>
        <li>les parcours réalisés sur le site&nbsp;;</li>
        <li>les interactions avec les formulaires&nbsp;;</li>
        <li>les sources de trafic&nbsp;;</li>
        <li>les performances générales du site.</li>
      </ul>
      <p>
        Selon leur configuration et la réglementation applicable, certains
        outils de mesure d’audience peuvent nécessiter votre consentement avant
        leur activation.
      </p>

      <SubTitle>Cookies publicitaires</SubTitle>
      <p>
        Ces cookies permettent de mesurer l’efficacité de nos campagnes
        publicitaires et, lorsque cela est applicable, d’adapter la publicité
        diffusée sur des plateformes tierces.
      </p>
      <p>Ils peuvent notamment permettre&nbsp;:</p>
      <ul>
        <li>
          d’identifier qu’une visite provient d’une campagne publicitaire&nbsp;;
        </li>
        <li>de mesurer une conversion après une publicité&nbsp;;</li>
        <li>d’éviter certaines répétitions publicitaires&nbsp;;</li>
        <li>de créer des audiences publicitaires&nbsp;;</li>
        <li>de mesurer les performances de nos campagnes&nbsp;;</li>
        <li>
          de proposer des publicités susceptibles d’être plus pertinentes.
        </li>
      </ul>
      <p>
        <strong>
          Ces cookies et traceurs ne sont activés qu’après votre consentement
          lorsque celui-ci est requis.
        </strong>
      </p>

      <SectionTitle>5. Pixels et technologies publicitaires</SectionTitle>
      <p>
        Couverture Mutuelle peut utiliser des technologies similaires aux
        cookies, notamment des pixels ou balises de mesure.
      </p>
      <p>
        Ces technologies peuvent être fournies par les plateformes sur
        lesquelles VALEADATA SL réalise ses campagnes publicitaires.
      </p>
      <p>
        Selon les campagnes effectivement utilisées, il peut notamment s’agir
        de services proposés par&nbsp;:
      </p>
      <ul>
        <li>
          <strong>Meta (Facebook et Instagram)</strong>&nbsp;;
        </li>
        <li>
          <strong>Google</strong>&nbsp;;
        </li>
        <li>
          <strong>TikTok</strong>&nbsp;;
        </li>
        <li>
          ou d’autres plateformes publicitaires utilisées par Couverture
          Mutuelle.
        </li>
      </ul>
      <p>
        Ces outils peuvent notamment permettre de déterminer si un utilisateur
        ayant vu ou cliqué sur une publicité a ensuite réalisé une action sur
        Couverture Mutuelle, telle que l’utilisation d’un formulaire.
      </p>
      <p>
        Ils peuvent également permettre, lorsque vous y avez consenti, de
        constituer ou d’utiliser des audiences publicitaires selon les
        fonctionnalités proposées par les plateformes concernées.
      </p>
      <p>
        Les pixels et traceurs publicitaires soumis au consentement{" "}
        <strong>
          ne doivent pas être activés avant que vous ayez accepté les cookies
          publicitaires
        </strong>
        .
      </p>

      <SectionTitle>
        6. Cookies et services susceptibles d’être utilisés
      </SectionTitle>
      <p>
        Les cookies effectivement utilisés sur Couverture Mutuelle dépendent des
        fonctionnalités et outils actifs sur le site.
      </p>
      <p>
        Ils peuvent notamment appartenir aux catégories suivantes&nbsp;:
      </p>

      <SubTitle>Fonctionnement du site</SubTitle>
      <p>
        <strong>
          Fournisseur&nbsp;: Couverture Mutuelle / VALEADATA SL / prestataires
          techniques
        </strong>
      </p>
      <p>
        Finalité&nbsp;: fonctionnement du site, formulaires, sécurité, gestion
        de session et mémorisation des choix concernant les cookies.
      </p>
      <p>
        Durée&nbsp;: variable selon le cookie et limitée à la durée nécessaire à
        sa finalité.
      </p>

      <SubTitle>Meta Pixel</SubTitle>
      <p>
        <strong>Fournisseur&nbsp;: Meta Platforms</strong>
      </p>
      <p>
        Lorsqu’il est activé sur le site et que vous avez donné votre
        consentement lorsque celui-ci est requis, Meta Pixel peut permettre
        de&nbsp;:
      </p>
      <ul>
        <li>
          mesurer les visites provenant de Facebook ou Instagram&nbsp;;
        </li>
        <li>mesurer les conversions&nbsp;;</li>
        <li>analyser les performances de nos campagnes&nbsp;;</li>
        <li>créer ou mesurer des audiences publicitaires.</li>
      </ul>
      <p>
        Les cookies susceptibles d’être associés à ce service peuvent notamment
        comprendre <code>_fbp</code>.
      </p>
      <p>
        Leur durée dépend des paramètres et politiques définis par Meta.
      </p>

      <SubTitle>Google</SubTitle>
      <p>
        <strong>Fournisseur&nbsp;: Google</strong>
      </p>
      <p>
        Lorsque les services correspondants sont installés et activés avec
        votre consentement lorsque celui-ci est requis, Google peut être
        utilisé notamment pour&nbsp;:
      </p>
      <ul>
        <li>mesurer l’audience du site&nbsp;;</li>
        <li>analyser les parcours de navigation&nbsp;;</li>
        <li>
          mesurer les conversions provenant de campagnes Google Ads&nbsp;;
        </li>
        <li>évaluer l’efficacité des campagnes publicitaires.</li>
      </ul>
      <p>
        Selon les services effectivement utilisés, des cookies tels que{" "}
        <code>_ga</code>, <code>_ga_*</code> ou <code>_gcl_*</code> peuvent être
        déposés.
      </p>
      <p>Leur durée dépend du service et de sa configuration.</p>

      <SubTitle>TikTok</SubTitle>
      <p>
        <strong>Fournisseur&nbsp;: TikTok</strong>
      </p>
      <p>
        Lorsque TikTok Pixel ou une technologie similaire est effectivement
        installé sur le site et que vous avez donné votre consentement lorsque
        celui-ci est requis, ce service peut permettre de&nbsp;:
      </p>
      <ul>
        <li>mesurer les visites provenant de TikTok&nbsp;;</li>
        <li>mesurer les conversions&nbsp;;</li>
        <li>analyser les performances des campagnes&nbsp;;</li>
        <li>constituer ou mesurer des audiences publicitaires.</li>
      </ul>
      <p>
        Les cookies utilisés et leur durée dépendent de la configuration du
        service TikTok.
      </p>

      <SectionTitle>7. Aucun cookie publicitaire avant votre choix</SectionTitle>
      <p>
        Lors de votre première visite sur Couverture Mutuelle, un module de
        gestion des cookies vous permet d’effectuer votre choix.
      </p>
      <p>Vous devez pouvoir&nbsp;:</p>
      <ul>
        <li>
          <strong>Tout accepter</strong>
        </li>
        <li>
          <strong>Tout refuser</strong>
        </li>
        <li>
          ou <strong>Personnaliser mes choix</strong>
        </li>
      </ul>
      <p>
        Le refus des cookies non essentiels doit être aussi facilement
        accessible que leur acceptation.
      </p>
      <p>
        <strong>
          En l’absence de choix positif de votre part, les cookies et traceurs
          soumis au consentement ne sont pas déposés.
        </strong>
      </p>
      <p>
        Le simple fait de continuer à naviguer sur Couverture Mutuelle ne vaut
        pas acceptation des cookies nécessitant votre consentement.
      </p>

      <SectionTitle>8. Comment modifier votre choix&nbsp;?</SectionTitle>
      <p>
        Vous pouvez modifier ou retirer votre consentement concernant les
        cookies à tout moment.
      </p>
      <p>
        Un lien permanent intitulé{" "}
        <strong>«&nbsp;Gérer mes cookies&nbsp;»</strong> est disponible depuis
        le site, notamment dans le pied de page.
      </p>
      <p>
        Il vous permet de rouvrir le module de gestion des cookies et de
        modifier vos préférences.
      </p>
      <p>
        Le retrait de votre consentement n’affecte pas la licéité des
        traitements effectués avant son retrait.
      </p>

      <SectionTitle>9. Gestion des cookies depuis votre navigateur</SectionTitle>
      <p>
        Vous pouvez également configurer votre navigateur afin de bloquer ou
        supprimer certains cookies.
      </p>
      <p>Les modalités dépendent du navigateur que vous utilisez.</p>
      <p>
        Vous pouvez consulter les pages d’assistance officielles de votre
        navigateur, notamment&nbsp;:
      </p>
      <ul>
        <li>Google Chrome&nbsp;;</li>
        <li>Mozilla Firefox&nbsp;;</li>
        <li>Microsoft Edge&nbsp;;</li>
        <li>Apple Safari&nbsp;;</li>
        <li>Opera.</li>
      </ul>
      <p>
        La désactivation de certains cookies strictement nécessaires peut
        empêcher certaines fonctionnalités du site de fonctionner correctement.
      </p>

      <SectionTitle>10. Durée de conservation de votre choix</SectionTitle>
      <p>
        Votre choix concernant l’acceptation ou le refus des cookies est
        conservé pendant une durée limitée.
      </p>
      <p>
        À l’expiration de cette durée, ou lorsque cela est nécessaire en raison
        d’une modification significative des cookies ou services utilisés, votre
        consentement pourra vous être demandé à nouveau.
      </p>

      <SectionTitle>11. Services tiers et transferts de données</SectionTitle>
      <p>
        Certains fournisseurs de technologies utilisés sur Couverture Mutuelle
        peuvent être établis ou traiter certaines données en dehors de
        l’Espace économique européen.
      </p>
      <p>
        Lorsque de tels transferts interviennent, VALEADATA SL veille à ce
        qu’ils soient réalisés conformément aux mécanismes prévus par la
        réglementation applicable en matière de protection des données.
      </p>
      <p>
        Les fournisseurs tiers disposent également de leurs propres politiques
        de confidentialité et de cookies.
      </p>

      <SectionTitle>12. Mise à jour de la Politique de cookies</SectionTitle>
      <p>
        VALEADATA SL peut modifier la présente Politique de cookies afin de
        tenir compte notamment&nbsp;:
      </p>
      <ul>
        <li>de l’ajout ou de la suppression d’un outil&nbsp;;</li>
        <li>de modifications apportées au site&nbsp;;</li>
        <li>de changements concernant les cookies utilisés&nbsp;;</li>
        <li>ou d’évolutions législatives ou réglementaires.</li>
      </ul>
      <p>
        La date indiquée en haut de cette page correspond à la dernière mise à
        jour de la Politique.
      </p>

      <SectionTitle>13. Contact</SectionTitle>
      <p>
        Pour toute question relative à l’utilisation des cookies sur Couverture
        Mutuelle&nbsp;:
      </p>
      <ul>
        <li>
          <strong>VALEADATA SL – Couverture Mutuelle</strong>
        </li>
        <li>
          NIF&nbsp;: <strong>B88944939</strong>
        </li>
        <li>Carrer Palma de Sant Just, 5</li>
        <li>08002 Barcelone</li>
        <li>Espagne</li>
        <li>
          <a
            href="mailto:conseiller.couverturemutuelle@gmail.com"
            className="font-medium text-brand hover:underline"
          >
            conseiller.couverturemutuelle@gmail.com
          </a>
        </li>
      </ul>
    </LegalPage>
  );
}
