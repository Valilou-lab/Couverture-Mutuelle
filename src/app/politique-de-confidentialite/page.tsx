import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Couverture Mutuelle",
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

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité – Couverture Mutuelle"
      titleClassName="text-brand"
    >
      <p className="text-sm text-zinc-500">
        Dernière mise à jour&nbsp;: 7 août 2026
      </p>

      <SectionTitle>1. Qui sommes-nous&nbsp;?</SectionTitle>
      <p>
        Le site Couverture Mutuelle est édité et exploité par&nbsp;:
      </p>
      <ul>
        <li>VALEADATA SL</li>
        <li>B88944939</li>
        <li>Nom commercial&nbsp;: Couverture Mutuelle</li>
        <li>
          Adresse&nbsp;: Carrer Palma de Sant Just, 5, 08002 Barcelone, Espagne
        </li>
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
        VALEADATA SL est responsable du traitement des données personnelles
        collectées sur le site Couverture Mutuelle.
      </p>
      <p>
        Couverture Mutuelle permet aux utilisateurs de renseigner leur situation
        et leurs besoins afin d’obtenir une comparaison et d’être mis en relation
        avec des professionnels susceptibles de leur proposer des offres de
        complémentaire santé adaptées à leur profil.
      </p>
      <p>
        La présente politique vous informe sur la manière dont nous collectons,
        utilisons, transmettons, conservons et protégeons vos données
        personnelles.
      </p>
      <p>
        Les traitements sont réalisés conformément au Règlement (UE) 2016/679 du
        27 avril 2016 («&nbsp;RGPD&nbsp;»), ainsi qu’aux réglementations
        espagnoles et françaises applicables en matière de protection des
        données personnelles et de prospection commerciale.
      </p>

      <SectionTitle>2. Quelles données collectons-nous&nbsp;?</SectionTitle>
      <p>
        Lorsque vous utilisez Couverture Mutuelle et remplissez nos formulaires,
        nous pouvons notamment collecter les données suivantes&nbsp;:
      </p>
      <ul>
        <li>civilité&nbsp;;</li>
        <li>nom et prénom&nbsp;;</li>
        <li>date de naissance&nbsp;;</li>
        <li>date de naissance du conjoint lorsque nécessaire&nbsp;;</li>
        <li>code postal et ville&nbsp;;</li>
        <li>régime de santé&nbsp;;</li>
        <li>personnes à assurer&nbsp;;</li>
        <li>besoins et priorités en matière de couverture&nbsp;;</li>
        <li>niveau de couverture souhaité&nbsp;;</li>
        <li>
          situation actuelle concernant votre complémentaire santé&nbsp;;
        </li>
        <li>nom de votre assureur actuel&nbsp;;</li>
        <li>
          montant de votre cotisation actuelle lorsque cette information est
          demandée&nbsp;;
        </li>
        <li>
          ancienneté auprès de votre mutuelle lorsque cette information est
          demandée&nbsp;;
        </li>
        <li>numéro de téléphone&nbsp;;</li>
        <li>adresse email&nbsp;;</li>
        <li>préférence ou créneau de rappel&nbsp;;</li>
        <li>informations relatives à votre consentement.</li>
      </ul>
      <p>
        Nous pouvons également collecter certaines données techniques nécessaires
        au fonctionnement, à la sécurité et à la mesure des performances du site,
        telles que l’adresse IP, le type de navigateur, le type d’appareil, la
        source de trafic ou certaines informations issues des cookies et
        traceurs lorsque leur utilisation nécessite votre consentement.
      </p>
      <p>
        Certaines réponses relatives à vos besoins de couverture peuvent être
        susceptibles de révéler indirectement des informations concernant votre
        santé. Lorsque de telles données sont traitées, elles bénéficient des
        protections renforcées prévues par la réglementation applicable.
      </p>

      <SectionTitle>3. Pourquoi utilisons-nous vos données&nbsp;?</SectionTitle>
      <p>
        Les données collectées peuvent être utilisées afin de&nbsp;:
      </p>
      <ul>
        <li>traiter votre demande de comparaison de complémentaire santé&nbsp;;</li>
        <li>comprendre votre situation et vos besoins&nbsp;;</li>
        <li>
          identifier les offres susceptibles de correspondre à votre
          profil&nbsp;;
        </li>
        <li>
          réaliser une estimation indicative des économies éventuellement
          réalisables&nbsp;;
        </li>
        <li>
          transmettre votre demande aux partenaires concernés lorsque vous y avez
          consenti&nbsp;;
        </li>
        <li>
          permettre à Couverture Mutuelle et à ses partenaires de vous contacter
          dans le cadre de votre demande&nbsp;;
        </li>
        <li>
          vous contacter par téléphone, SMS, WhatsApp ou email lorsque vous avez
          donné votre consentement&nbsp;;
        </li>
        <li>assurer le suivi de votre demande&nbsp;;</li>
        <li>éviter les doublons et les demandes frauduleuses&nbsp;;</li>
        <li>
          améliorer le fonctionnement et les performances de nos formulaires et
          services&nbsp;;
        </li>
        <li>réaliser des statistiques et analyses de performance&nbsp;;</li>
        <li>respecter nos obligations légales et réglementaires&nbsp;;</li>
        <li>
          enregistrer, conserver et être en mesure de restituer la preuve de
          votre consentement.
        </li>
      </ul>

      <SectionTitle>
        4. Sur quelle base utilisons-nous vos données&nbsp;?
      </SectionTitle>
      <p>
        Selon la finalité concernée, le traitement de vos données repose sur
        différentes bases juridiques.
      </p>

      <SubTitle>Votre consentement</SubTitle>
      <p>
        Lorsque vous acceptez expressément d’être contacté(e) par Couverture
        Mutuelle et ses partenaires pour recevoir des offres de complémentaire
        santé.
      </p>
      <p>
        Ce consentement concerne notamment, lorsque cela est applicable, les
        communications par téléphone, SMS, WhatsApp et email.
      </p>

      <SubTitle>Votre demande de service</SubTitle>
      <p>
        Lorsque le traitement de certaines informations est nécessaire pour
        répondre à votre demande de comparaison et identifier les offres
        susceptibles de correspondre à votre situation.
      </p>

      <SubTitle>Notre intérêt légitime</SubTitle>
      <p>
        Pour assurer notamment la sécurité du site, prévenir la fraude et les
        doublons, mesurer les performances de notre service et améliorer
        l’expérience utilisateur, dans le respect de vos droits et libertés.
      </p>

      <SubTitle>Nos obligations légales</SubTitle>
      <p>
        Lorsque nous devons conserver certaines informations ou preuves afin de
        respecter les obligations réglementaires auxquelles nous sommes soumis.
      </p>

      <SectionTitle>
        5. Transmission de vos données à nos partenaires
      </SectionTitle>
      <p>
        Couverture Mutuelle travaille avec différents professionnels susceptibles
        de proposer des solutions de complémentaire santé.
      </p>
      <p>
        Lorsque vous y avez expressément consenti, les informations nécessaires
        au traitement de votre demande peuvent être transmises aux partenaires
        concernés.
      </p>
      <p>Il peut notamment s’agir&nbsp;:</p>
      <ul>
        <li>de courtiers en assurance&nbsp;;</li>
        <li>d’intermédiaires d’assurance&nbsp;;</li>
        <li>de compagnies d’assurance&nbsp;;</li>
        <li>de mutuelles&nbsp;;</li>
        <li>
          ou d’autres professionnels habilités à proposer des contrats de
          complémentaire santé.
        </li>
      </ul>
      <p>
        La liste des partenaires susceptibles de recevoir vos données est
        accessible depuis le formulaire au moment où votre consentement est
        demandé, ainsi que depuis le site Couverture Mutuelle.
      </p>
      <p>
        La liste des partenaires peut évoluer. Nous conservons les informations
        permettant d’identifier les partenaires associés à votre consentement et
        à votre demande.
      </p>
      <p>
        Vos données ne sont pas transmises à des partenaires pour des finalités
        incompatibles avec celles qui vous ont été présentées lors de leur
        collecte.
      </p>

      <SectionTitle>
        6. Votre consentement à être contacté(e)
      </SectionTitle>
      <p>
        Lorsque vous cochez la case de consentement présente dans notre
        formulaire, vous acceptez expressément d’être contacté(e) par Couverture
        Mutuelle et ses partenaires afin de recevoir et comparer des offres de
        complémentaire santé.
      </p>
      <p>
        Selon les modalités indiquées lors de la collecte, vous pouvez être
        contacté(e) par&nbsp;:
      </p>
      <ul>
        <li>téléphone&nbsp;;</li>
        <li>SMS&nbsp;;</li>
        <li>WhatsApp&nbsp;;</li>
        <li>email.</li>
      </ul>
      <p>
        La case permettant de recueillir votre consentement n’est jamais
        précochée.
      </p>
      <p>
        Votre consentement résulte d’une action volontaire de votre part.
      </p>
      <p>
        Vous pouvez consulter la liste des partenaires avant de donner votre
        consentement.
      </p>

      <SectionTitle>7. Consentement au démarchage téléphonique</SectionTitle>
      <p>
        À compter du 11 août 2026, le démarchage téléphonique d’un consommateur
        est, sauf exceptions prévues par la loi, subordonné à l’obtention
        préalable de son consentement.
      </p>
      <p>
        Couverture Mutuelle recueille donc votre consentement avant que votre
        numéro de téléphone soit utilisé à cette fin.
      </p>
      <p>Lors de la collecte, nous vous informons notamment&nbsp;:</p>
      <ul>
        <li>de l’identité du professionnel concerné&nbsp;;</li>
        <li>de la finalité du contact&nbsp;;</li>
        <li>de la nature des services concernés&nbsp;;</li>
        <li>de la durée de votre consentement&nbsp;;</li>
        <li>de votre droit de retirer votre consentement&nbsp;;</li>
        <li>de votre possibilité d’obtenir la preuve de votre consentement.</li>
      </ul>

      <SubTitle>Durée du consentement</SubTitle>
      <p>
        Lorsque vous consentez au démarchage téléphonique, votre consentement
        est valable pendant une durée maximale de&nbsp;:
      </p>
      <p>
        12 mois à compter de la date à laquelle il a été recueilli.
      </p>
      <p>
        Le consentement n’est pas renouvelé ou reconduit automatiquement.
      </p>
      <p>
        À son expiration, un nouveau consentement devra être recueilli si un
        nouveau démarchage nécessitant votre consentement est envisagé.
      </p>

      <SectionTitle>
        8. Comment retirer votre consentement&nbsp;?
      </SectionTitle>
      <p>
        Vous pouvez retirer votre consentement à tout moment et gratuitement.
      </p>
      <p>
        Le retrait de votre consentement n’affecte pas la licéité des traitements
        réalisés avant son retrait.
      </p>

      <SubTitle>Par email</SubTitle>
      <p>Vous pouvez adresser votre demande à&nbsp;:</p>
      <p>
        <a
          href="mailto:conseiller.couverturemutuelle@gmail.com"
          className="font-medium text-brand hover:underline"
        >
          conseiller.couverturemutuelle@gmail.com
        </a>
      </p>
      <p>
        Afin de retrouver votre demande, nous vous invitons à indiquer le numéro
        de téléphone et/ou l’adresse email utilisés lors de votre demande de
        devis.
      </p>

      <SubTitle>Directement auprès d’un professionnel</SubTitle>
      <p>
        Si vous êtes contacté(e) par téléphone, vous pouvez également indiquer
        directement au professionnel que vous souhaitez retirer votre
        consentement et ne plus être démarché(e).
      </p>

      <SubTitle>En ligne</SubTitle>
      <p>
        Vous pouvez utiliser la page dédiée&nbsp;:{" "}
        <a
          href="/retirer-mon-consentement"
          className="font-medium text-brand hover:underline"
        >
          Retirer mon consentement
        </a>
        .
      </p>

      <SubTitle>Pour les SMS, WhatsApp et emails</SubTitle>
      <p>
        Vous pouvez également utiliser les mécanismes de désinscription ou
        d’opposition proposés dans les communications reçues lorsqu’ils sont
        disponibles.
      </p>
      <p>
        Une fois votre retrait enregistré, vos coordonnées sont placées dans les
        dispositifs d’exclusion appropriés afin d’empêcher leur utilisation pour
        les opérations de prospection concernées.
      </p>

      <SectionTitle>9. Preuve de votre consentement</SectionTitle>
      <p>
        Afin de respecter nos obligations réglementaires et de protéger vos
        droits, Couverture Mutuelle conserve une preuve du consentement
        recueilli.
      </p>
      <p>Cette preuve peut notamment contenir&nbsp;:</p>
      <ul>
        <li>la date et l’heure du consentement&nbsp;;</li>
        <li>l’identification de la demande&nbsp;;</li>
        <li>les coordonnées associées à la demande&nbsp;;</li>
        <li>
          le texte ou la version du texte de consentement présenté au moment de
          sa validation&nbsp;;
        </li>
        <li>la durée du consentement&nbsp;;</li>
        <li>la finalité du consentement&nbsp;;</li>
        <li>les canaux de communication concernés&nbsp;;</li>
        <li>l’identification des partenaires concernés&nbsp;;</li>
        <li>
          les informations techniques permettant d’établir les conditions dans
          lesquelles le consentement a été recueilli.
        </li>
      </ul>

      <SubTitle>Combien de temps conservons-nous cette preuve&nbsp;?</SubTitle>
      <p>
        La preuve du consentement au démarchage téléphonique est conservée
        pendant 3 ans à compter de la date de son recueil, conformément à la
        réglementation applicable.
      </p>
      <p>
        Certaines informations peuvent être conservées au-delà lorsque cela est
        nécessaire à la constatation, à l’exercice ou à la défense de droits en
        justice.
      </p>

      <SectionTitle>
        10. Comment obtenir la preuve de votre consentement&nbsp;?
      </SectionTitle>
      <p>
        Vous pouvez demander gratuitement à obtenir la preuve du consentement que
        vous avez donné sur Couverture Mutuelle.
      </p>
      <p>Pour cela, adressez votre demande à&nbsp;:</p>
      <p>
        <a
          href="mailto:conseiller.couverturemutuelle@gmail.com"
          className="font-medium text-brand hover:underline"
        >
          conseiller.couverturemutuelle@gmail.com
        </a>
      </p>
      <p>
        en indiquant le numéro de téléphone et/ou l’adresse email utilisés lors
        de votre demande afin que nous puissions identifier le consentement
        concerné.
      </p>
      <p>
        La preuve vous sera communiquée de manière individualisée sur un support
        durable et dans un délai raisonnable, conformément à la réglementation
        applicable.
      </p>

      <SectionTitle>
        11. Combien de temps conservons-nous vos données&nbsp;?
      </SectionTitle>
      <p>
        Vos données personnelles sont conservées uniquement pendant la durée
        nécessaire aux finalités pour lesquelles elles ont été collectées.
      </p>
      <p>
        Les données nécessaires au traitement de votre demande sont conservées
        pendant la durée nécessaire à son traitement et peuvent ensuite être
        archivées lorsque cela est nécessaire pour respecter nos obligations
        légales ou défendre nos droits.
      </p>
      <p>
        La preuve de votre consentement au démarchage téléphonique est conservée
        pendant 3 ans à compter de son recueil.
      </p>
      <p>
        Lorsque vous retirez votre consentement, certaines informations peuvent
        continuer à être conservées afin notamment&nbsp;:
      </p>
      <ul>
        <li>de conserver la preuve du retrait&nbsp;;</li>
        <li>de respecter nos obligations légales&nbsp;;</li>
        <li>
          d’empêcher que vous soyez sollicité(e) à nouveau sur la base du
          consentement retiré&nbsp;;
        </li>
        <li>
          d’assurer la défense de nos droits en cas de litige.
        </li>
      </ul>

      <SectionTitle>
        12. Vos droits concernant vos données personnelles
      </SectionTitle>
      <p>
        Conformément au RGPD, vous disposez, selon les conditions prévues par la
        réglementation, des droits suivants&nbsp;:
      </p>
      <ul>
        <li>droit d’accès à vos données personnelles&nbsp;;</li>
        <li>
          droit de rectification des données inexactes ou incomplètes&nbsp;;
        </li>
        <li>droit à l’effacement de vos données&nbsp;;</li>
        <li>droit à la limitation du traitement&nbsp;;</li>
        <li>droit d’opposition à certains traitements&nbsp;;</li>
        <li>
          droit à la portabilité lorsque celui-ci est applicable&nbsp;;
        </li>
        <li>droit de retirer votre consentement à tout moment&nbsp;;</li>
        <li>
          droit de ne pas faire l’objet d’une décision exclusivement automatisée
          produisant des effets juridiques ou vous affectant significativement,
          dans les conditions prévues par le RGPD.
        </li>
      </ul>
      <p>Pour exercer vos droits, contactez&nbsp;:</p>
      <ul>
        <li>VALEADATA SL – Couverture Mutuelle</li>
        <li>Carrer Palma de Sant Just, 5, 08002 Barcelone, Espagne</li>
        <li>
          <a
            href="mailto:conseiller.couverturemutuelle@gmail.com"
            className="font-medium text-brand hover:underline"
          >
            conseiller.couverturemutuelle@gmail.com
          </a>
        </li>
      </ul>
      <p>
        Afin de protéger vos données, nous pouvons vous demander des informations
        supplémentaires permettant de vérifier votre identité lorsque cela est
        nécessaire.
      </p>
      <p>
        L’exercice de vos droits est gratuit, sous réserve des exceptions
        prévues par la réglementation.
      </p>

      <SectionTitle>
        13. Réclamation auprès d’une autorité de contrôle
      </SectionTitle>
      <p>
        Si vous considérez que le traitement de vos données personnelles ne
        respecte pas la réglementation applicable, vous disposez du droit
        d’introduire une réclamation auprès d’une autorité de contrôle.
      </p>
      <p>
        VALEADATA SL étant établie en Espagne, vous pouvez notamment contacter
        l’Agencia Española de Protección de Datos (AEPD).
      </p>
      <p>
        Si vous résidez en France, vous pouvez également vous rapprocher de la
        Commission nationale de l’informatique et des libertés (CNIL) dans les
        conditions prévues par la réglementation européenne.
      </p>

      <SectionTitle>14. Prestataires techniques</SectionTitle>
      <p>
        Pour assurer le fonctionnement de Couverture Mutuelle, VALEADATA SL peut
        recourir à des prestataires techniques.
      </p>
      <p>Ils peuvent notamment intervenir pour&nbsp;:</p>
      <ul>
        <li>l’hébergement du site&nbsp;;</li>
        <li>le fonctionnement des formulaires&nbsp;;</li>
        <li>le stockage et la sécurisation des données&nbsp;;</li>
        <li>la gestion et la transmission des demandes&nbsp;;</li>
        <li>
          l’envoi de SMS, emails ou autres communications&nbsp;;
        </li>
        <li>la mesure d’audience&nbsp;;</li>
        <li>les outils publicitaires&nbsp;;</li>
        <li>la prévention de la fraude&nbsp;;</li>
        <li>
          le fonctionnement des outils internes nécessaires au traitement des
          demandes.
        </li>
      </ul>
      <p>
        Ces prestataires n’accèdent aux données que dans la mesure nécessaire à
        l’exécution de leurs prestations et selon leur rôle au regard de la
        réglementation applicable.
      </p>
      <p>
        Lorsque des données sont transférées en dehors de l’Espace économique
        européen, nous veillons à ce que le transfert repose sur un mécanisme
        autorisé par la réglementation applicable et bénéficie des garanties
        appropriées.
      </p>

      <SectionTitle>15. Cookies et traceurs</SectionTitle>
      <p>
        Couverture Mutuelle peut utiliser des cookies et technologies similaires.
      </p>
      <p>
        Certains cookies sont strictement nécessaires au fonctionnement du site.
      </p>
      <p>
        D’autres cookies, notamment ceux relatifs à la mesure d’audience ou à la
        publicité, ne sont déposés que lorsque votre consentement est requis et
        que vous l’avez donné.
      </p>
      <p>
        Vous pouvez accepter, refuser ou modifier vos choix depuis l’outil de
        gestion des cookies disponible sur le site.
      </p>
      <p>
        Pour plus d’informations, consultez notre{" "}
        <Link href="/cookies" className="font-medium text-brand hover:underline">
          Politique relative aux cookies
        </Link>
        .
      </p>

      <SectionTitle>16. Sécurité de vos données</SectionTitle>
      <p>
        VALEADATA SL met en œuvre les mesures techniques et organisationnelles
        appropriées afin de protéger vos données personnelles contre
        notamment&nbsp;:
      </p>
      <ul>
        <li>l’accès non autorisé&nbsp;;</li>
        <li>la divulgation&nbsp;;</li>
        <li>l’altération&nbsp;;</li>
        <li>la perte&nbsp;;</li>
        <li>la destruction accidentelle ou illicite.</li>
      </ul>
      <p>
        L’accès aux données est limité aux personnes, partenaires et
        prestataires qui en ont besoin dans le cadre du traitement de votre
        demande ou de leurs missions.
      </p>

      <SectionTitle>17. Calculateur et estimations</SectionTitle>
      <p>
        Couverture Mutuelle peut proposer des outils permettant d’obtenir une
        estimation indicative à partir des informations renseignées par
        l’utilisateur.
      </p>
      <p>
        Ces outils peuvent notamment estimer les économies éventuellement
        réalisables ou aider à identifier le niveau de couverture correspondant
        au profil renseigné.
      </p>
      <p>
        Les résultats présentés sont exclusivement indicatifs.
      </p>
      <p>Ils ne constituent&nbsp;:</p>
      <ul>
        <li>ni un devis contractuel&nbsp;;</li>
        <li>ni une offre d’assurance&nbsp;;</li>
        <li>ni une garantie d’économie&nbsp;;</li>
        <li>ni une décision prise par un assureur ou une mutuelle.</li>
      </ul>
      <p>
        Les conditions, garanties et tarifs définitifs dépendent notamment du
        profil de l’assuré et de l’offre proposée par le professionnel concerné.
      </p>

      <SectionTitle>
        18. Modification de la présente politique
      </SectionTitle>
      <p>
        VALEADATA SL peut modifier la présente politique de confidentialité afin
        notamment de tenir compte&nbsp;:
      </p>
      <ul>
        <li>des évolutions législatives ou réglementaires&nbsp;;</li>
        <li>
          de modifications apportées au fonctionnement de Couverture
          Mutuelle&nbsp;;
        </li>
        <li>de l’évolution de nos traitements de données&nbsp;;</li>
        <li>de l’évolution de nos partenaires ou prestataires.</li>
      </ul>
      <p>
        La date figurant en haut de cette page indique la dernière mise à jour
        de la politique.
      </p>

      <SectionTitle>Contact relatif aux données personnelles</SectionTitle>
      <ul>
        <li>VALEADATA SL – Couverture Mutuelle</li>
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
