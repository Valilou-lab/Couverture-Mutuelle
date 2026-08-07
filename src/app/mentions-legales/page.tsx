import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales — Couverture Mutuelle",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="!mt-8 !mb-3 font-manrope text-lg font-bold tracking-tight text-brand sm:text-xl">
      {children}
    </h2>
  );
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" titleClassName="text-brand">
      <p className="text-sm text-zinc-500">
        Dernière mise à jour&nbsp;: 7 août 2026
      </p>

      <SectionTitle>1. Éditeur du site</SectionTitle>
      <p>Le site Couverture Mutuelle est édité et exploité par&nbsp;:</p>
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
        <li>
          Siège social&nbsp;:{" "}
          <strong>
            Carrer Palma de Sant Just, 5, 08002 Barcelone, Espagne
          </strong>
        </li>
        <li>
          E-mail&nbsp;:{" "}
          <a
            href="mailto:conseiller.couverturemutuelle@gmail.com"
            className="font-medium text-brand hover:underline"
          >
            conseiller.couverturemutuelle@gmail.com
          </a>
        </li>
      </ul>
      <p>VALEADATA SL est une société de droit espagnol.</p>
      <p>
        Le site Couverture Mutuelle a pour objet de permettre aux utilisateurs de
        renseigner leur situation et leurs besoins en matière de complémentaire
        santé afin d’obtenir une comparaison et d’être mis en relation avec des
        professionnels susceptibles de leur proposer des offres adaptées à leur
        profil.
      </p>
      <p>
        <strong>
          Couverture Mutuelle n’est pas un organisme assureur et ne commercialise
          pas directement de contrats d’assurance.
        </strong>
      </p>
      <p>
        La réalisation d’une demande sur le site ne constitue ni la souscription
        d’un contrat d’assurance, ni l’acceptation d’une offre d’assurance.
      </p>

      <SectionTitle>2. Hébergement</SectionTitle>
      <p>Le site Couverture Mutuelle est hébergé par&nbsp;:</p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong>
        </li>
        <li>440 N Barranca Avenue #4133</li>
        <li>Covina, CA 91723</li>
        <li>États-Unis</li>
        <li>
          Site internet&nbsp;:{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:underline"
          >
            vercel.com
          </a>
        </li>
      </ul>
      <p>
        Vercel assure l’hébergement et le déploiement technique du site.
      </p>
      <p>
        L’hébergement du site est distinct du traitement et du stockage éventuel
        des données personnelles collectées au travers des formulaires. Les
        informations relatives au traitement des données personnelles sont
        détaillées dans notre{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-brand hover:underline"
        >
          Politique de confidentialité
        </Link>
        .
      </p>

      <SectionTitle>3. Objet du site</SectionTitle>
      <p>
        Couverture Mutuelle propose gratuitement un service permettant aux
        utilisateurs de renseigner leur situation et leurs besoins afin
        d’identifier des solutions de complémentaire santé susceptibles de leur
        correspondre.
      </p>
      <p>Le service peut notamment permettre&nbsp;:</p>
      <ul>
        <li>
          d’identifier les besoins de l’utilisateur en matière de complémentaire
          santé&nbsp;;
        </li>
        <li>d’obtenir des estimations indicatives&nbsp;;</li>
        <li>
          de comparer sa situation actuelle avec les caractéristiques générales
          d’offres disponibles&nbsp;;
        </li>
        <li>
          d’être mis en relation avec un ou plusieurs professionnels partenaires
          susceptibles de proposer une complémentaire santé adaptée à sa
          situation.
        </li>
      </ul>
      <p>
        Les offres définitives, garanties, exclusions, tarifs et conditions
        contractuelles sont exclusivement déterminés par les professionnels et
        organismes proposant les contrats concernés.
      </p>

      <SectionTitle>4. Gratuité et absence d’engagement</SectionTitle>
      <p>
        L’utilisation du service Couverture Mutuelle est gratuite pour
        l’utilisateur et sans engagement de souscription.
      </p>
      <p>
        La réalisation d’une demande de comparaison n’oblige en aucun cas
        l’utilisateur à souscrire l’une des offres qui pourront lui être
        présentées.
      </p>
      <p>
        Couverture Mutuelle peut être rémunérée dans le cadre de ses relations
        commerciales avec ses partenaires.
      </p>

      <SectionTitle>5. Conditions d’utilisation</SectionTitle>
      <p>
        En accédant au site Couverture Mutuelle, l’utilisateur s’engage à en faire
        une utilisation conforme à la loi et aux présentes conditions.
      </p>
      <p>
        Lorsqu’il renseigne un formulaire, l’utilisateur s’engage notamment à
        fournir des informations exactes, sincères et à jour.
      </p>
      <p>Il est notamment interdit&nbsp;:</p>
      <ul>
        <li>
          de fournir volontairement des informations fausses, inexactes ou
          appartenant à un tiers sans son autorisation&nbsp;;
        </li>
        <li>
          d’utiliser le site à des fins frauduleuses ou illicites&nbsp;;
        </li>
        <li>
          de perturber ou tenter de perturber le fonctionnement du site&nbsp;;
        </li>
        <li>
          d’introduire des virus, logiciels malveillants ou tout autre élément
          susceptible de porter atteinte au fonctionnement du site&nbsp;;
        </li>
        <li>
          de tenter d’accéder sans autorisation aux systèmes, serveurs ou données
          liés au site&nbsp;;
        </li>
        <li>
          de contourner ou tenter de contourner les dispositifs de sécurité mis
          en place.
        </li>
      </ul>
      <p>
        VALEADATA SL se réserve le droit de prendre toute mesure nécessaire en
        cas d’utilisation abusive ou frauduleuse du site.
      </p>

      <SectionTitle>6. Comparaisons, estimations et calculateur</SectionTitle>
      <p>
        Couverture Mutuelle peut proposer des outils permettant d’obtenir des
        résultats ou estimations à partir des informations renseignées par
        l’utilisateur.
      </p>
      <p>
        Ces résultats sont fournis exclusivement à titre indicatif.
      </p>
      <p>
        En particulier, une estimation d’économie éventuellement affichée par le
        site ne constitue&nbsp;:
      </p>
      <ul>
        <li>ni un devis contractuel&nbsp;;</li>
        <li>ni une offre d’assurance&nbsp;;</li>
        <li>ni une garantie d’économie&nbsp;;</li>
        <li>ni une garantie de tarif&nbsp;;</li>
        <li>
          ni une décision prise par un assureur ou une mutuelle.
        </li>
      </ul>
      <p>
        Les économies effectivement réalisables dépendent notamment de la
        situation de l’assuré, de son âge, de sa localisation, de ses besoins,
        des garanties sélectionnées et des conditions tarifaires proposées par
        les organismes concernés.
      </p>
      <p>
        Seules les propositions communiquées par les professionnels et organismes
        habilités permettent de connaître les garanties et tarifs réellement
        applicables.
      </p>

      <SectionTitle>7. Mise en relation avec des professionnels</SectionTitle>
      <p>
        Lorsque l’utilisateur effectue une demande et donne son consentement
        lorsque celui-ci est nécessaire, certaines informations peuvent être
        transmises aux partenaires concernés afin qu’ils puissent traiter sa
        demande et lui présenter des offres de complémentaire santé.
      </p>
      <p>
        Il peut notamment s’agir de courtiers en assurance, intermédiaires
        d’assurance, assureurs, mutuelles ou autres professionnels habilités.
      </p>
      <p>
        La liste des partenaires susceptibles de recevoir les données de
        l’utilisateur est accessible depuis le site et au moment du recueil du
        consentement (
        <Link
          href="/partenaires"
          className="font-medium text-brand hover:underline"
        >
          voir la page Partenaires
        </Link>
        ).
      </p>
      <p>
        Les professionnels partenaires sont responsables des offres, conseils,
        garanties, tarifs et contrats qu’ils proposent à l’utilisateur dans le
        cadre de leur propre activité.
      </p>
      <p>
        Les modalités précises relatives à la transmission et au traitement des
        données sont détaillées dans notre{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-brand hover:underline"
        >
          Politique de confidentialité
        </Link>
        .
      </p>

      <SectionTitle>8. Propriété intellectuelle</SectionTitle>
      <p>
        VALEADATA SL est propriétaire ou dispose des droits nécessaires à
        l’utilisation des éléments présents sur le site Couverture Mutuelle.
      </p>
      <p>
        Cela comprend notamment, sans que cette liste soit exhaustive&nbsp;:
      </p>
      <ul>
        <li>le nom Couverture Mutuelle&nbsp;;</li>
        <li>les éléments graphiques&nbsp;;</li>
        <li>les textes&nbsp;;</li>
        <li>les illustrations&nbsp;;</li>
        <li>la mascotte&nbsp;;</li>
        <li>les interfaces&nbsp;;</li>
        <li>les éléments de design&nbsp;;</li>
        <li>les contenus&nbsp;;</li>
        <li>
          les développements informatiques appartenant à VALEADATA SL.
        </li>
      </ul>
      <p>
        Toute reproduction, représentation, adaptation, modification, diffusion
        ou exploitation, totale ou partielle, de ces éléments sans autorisation
        préalable est interdite, sauf dans les cas expressément autorisés par la
        loi.
      </p>
      <p>
        Les marques, logos et signes distinctifs appartenant à des tiers et
        éventuellement présentés sur le site demeurent la propriété de leurs
        titulaires respectifs.
      </p>
      <p>
        Leur présence sur Couverture Mutuelle ne saurait, à elle seule, être
        interprétée comme l’existence d’un partenariat, d’une recommandation ou
        d’une validation du service par les organismes concernés.
      </p>

      <SectionTitle>9. Responsabilité</SectionTitle>
      <p>
        VALEADATA SL met en œuvre les moyens raisonnables nécessaires afin
        d’assurer le fonctionnement, la sécurité et la disponibilité du site.
      </p>
      <p>
        Toutefois, VALEADATA SL ne peut garantir une disponibilité permanente et
        sans interruption du site.
      </p>
      <p>
        Le site peut notamment être temporairement indisponible en raison&nbsp;:
      </p>
      <ul>
        <li>d’une opération de maintenance&nbsp;;</li>
        <li>d’un incident technique&nbsp;;</li>
        <li>d’une mise à jour&nbsp;;</li>
        <li>d’une interruption provenant d’un prestataire&nbsp;;</li>
        <li>
          ou de circonstances indépendantes de la volonté de VALEADATA SL.
        </li>
      </ul>
      <p>
        VALEADATA SL ne saurait être tenue responsable des offres, garanties,
        exclusions, tarifs, conseils ou contrats proposés directement par les
        partenaires ou organismes avec lesquels l’utilisateur est mis en
        relation.
      </p>

      <SectionTitle>10. Liens vers des sites tiers</SectionTitle>
      <p>
        Le site Couverture Mutuelle peut contenir des liens vers des sites
        internet ou services exploités par des tiers.
      </p>
      <p>
        VALEADATA SL n’exerce aucun contrôle sur le contenu et le fonctionnement
        de ces sites externes et ne saurait être tenue responsable de leur
        disponibilité, de leur contenu ou de leurs propres pratiques.
      </p>
      <p>
        L’utilisateur est invité à consulter les conditions d’utilisation et
        politiques de confidentialité applicables aux sites tiers qu’il visite.
      </p>

      <SectionTitle>11. Protection des données personnelles</SectionTitle>
      <p>
        VALEADATA SL accorde une importance particulière à la protection des
        données personnelles des utilisateurs.
      </p>
      <p>
        Les données collectées au travers de Couverture Mutuelle sont traitées
        conformément à la réglementation applicable en matière de protection des
        données personnelles.
      </p>
      <p>
        Les informations concernant notamment&nbsp;:
      </p>
      <ul>
        <li>les données collectées&nbsp;;</li>
        <li>les finalités des traitements&nbsp;;</li>
        <li>les bases juridiques utilisées&nbsp;;</li>
        <li>les destinataires des données&nbsp;;</li>
        <li>les partenaires susceptibles de recevoir une demande&nbsp;;</li>
        <li>les durées de conservation&nbsp;;</li>
        <li>le consentement à la prospection&nbsp;;</li>
        <li>la preuve du consentement&nbsp;;</li>
        <li>
          les modalités permettant de retirer son consentement&nbsp;;
        </li>
        <li>et l’exercice des droits prévus par le RGPD</li>
      </ul>
      <p>
        sont détaillées dans notre{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-brand hover:underline"
        >
          Politique de confidentialité
        </Link>
        .
      </p>
      <p>
        Pour toute question relative à vos données personnelles&nbsp;:{" "}
        <a
          href="mailto:conseiller.couverturemutuelle@gmail.com"
          className="font-medium text-brand hover:underline"
        >
          conseiller.couverturemutuelle@gmail.com
        </a>
      </p>

      <SectionTitle>12. Consentement et communications commerciales</SectionTitle>
      <p>
        Lorsque la réglementation applicable exige le consentement préalable de
        l’utilisateur, aucune prospection utilisant les canaux concernés n’est
        réalisée sur la base du formulaire sans que ce consentement ait été
        recueilli.
      </p>
      <p>
        Lorsque l’utilisateur donne son consentement pour être contacté dans le
        cadre de sa demande de complémentaire santé, les modalités de ce
        consentement sont présentées au moment de sa collecte.
      </p>
      <p>
        L’utilisateur peut notamment être contacté, selon les choix et
        informations présentés lors de la collecte, par téléphone, SMS, WhatsApp
        ou email.
      </p>
      <p>
        L’utilisateur peut retirer son consentement à tout moment et gratuitement
        selon les modalités détaillées dans la{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-brand hover:underline"
        >
          Politique de confidentialité
        </Link>{" "}
        et via les moyens mis à sa disposition sur Couverture Mutuelle.
      </p>
      <p>
        Pour toute demande de retrait du consentement, l’utilisateur peut
        également écrire à&nbsp;:{" "}
        <a
          href="mailto:conseiller.couverturemutuelle@gmail.com"
          className="font-medium text-brand hover:underline"
        >
          conseiller.couverturemutuelle@gmail.com
        </a>
      </p>

      <SectionTitle>13. Cookies et traceurs</SectionTitle>
      <p>
        Couverture Mutuelle peut utiliser des cookies et autres technologies
        similaires.
      </p>
      <p>
        Certains cookies sont strictement nécessaires au fonctionnement du site.
      </p>
      <p>
        D’autres traceurs, notamment ceux utilisés à des fins de mesure
        d’audience ou de publicité, sont soumis au consentement de l’utilisateur
        lorsque la réglementation l’exige.
      </p>
      <p>
        L’utilisateur peut accepter, refuser ou modifier ses choix concernant
        ces cookies depuis l’outil de gestion des cookies disponible sur le site.
      </p>
      <p>
        Les informations détaillées concernant les cookies utilisés sont
        disponibles dans notre{" "}
        <Link href="/cookies" className="font-medium text-brand hover:underline">
          Politique de cookies
        </Link>
        .
      </p>

      <SectionTitle>14. Modification des mentions légales</SectionTitle>
      <p>
        VALEADATA SL peut modifier les présentes mentions légales afin notamment
        de tenir compte&nbsp;:
      </p>
      <ul>
        <li>des évolutions législatives et réglementaires&nbsp;;</li>
        <li>
          de modifications apportées au fonctionnement du site&nbsp;;
        </li>
        <li>de l’évolution des services proposés&nbsp;;</li>
        <li>
          ou de modifications concernant ses partenaires et prestataires.
        </li>
      </ul>
      <p>
        La date de dernière mise à jour indiquée en haut de cette page permet
        d’identifier la version applicable.
      </p>

      <SectionTitle>15. Contact</SectionTitle>
      <p>
        Pour toute question concernant Couverture Mutuelle ou les présentes
        mentions légales&nbsp;:
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
          E-mail&nbsp;:{" "}
          <a
            href="mailto:conseiller.couverturemutuelle@gmail.com"
            className="font-medium text-brand hover:underline"
          >
            conseiller.couverturemutuelle@gmail.com
          </a>
        </li>
      </ul>

      <SectionTitle>16. Droit applicable</SectionTitle>
      <p>
        Les présentes mentions légales sont régies par le droit espagnol, sans
        préjudice des dispositions impératives de protection dont peut bénéficier
        un consommateur en vertu de la législation applicable dans son pays de
        résidence.
      </p>
      <p>
        Tout litige sera soumis aux juridictions compétentes conformément aux
        règles légales applicables.
      </p>
      <p>
        La{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-medium text-brand hover:underline"
        >
          Politique de confidentialité
        </Link>{" "}
        et la{" "}
        <Link href="/cookies" className="font-medium text-brand hover:underline">
          Politique de cookies
        </Link>{" "}
        complètent les présentes mentions légales.
      </p>
    </LegalPage>
  );
}
