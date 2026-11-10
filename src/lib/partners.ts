/**
 * Liste des partenaires (popup + page /partenaires + mentions légales §7).
 * Modifiez simplement ce tableau pour ajouter, retirer ou corriger une entrée.
 */
export type Partner = {
  name: string;
  orias: string;
  /** Official partner privacy / data-protection policy URL. */
  privacyPolicyUrl: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "Skarlett",
    orias: "23004755",
    privacyPolicyUrl: "https://www.skarlett.fr/politique-de-confidentialite1",
  },
  {
    name: "Majelis",
    orias: "17001968",
    privacyPolicyUrl: "https://majelis-expertconseil.fr/n1241",
  },
  {
    name: "L’Aveyronnaise",
    orias: "18001058",
    privacyPolicyUrl: "https://www.laveyronnaisedassurances.fr/",
  },
  {
    name: "Santiane",
    orias: "07006282",
    privacyPolicyUrl: "https://www.santiane.fr/politique-de-confidentialite",
  },
  {
    name: "IKI / FDM",
    orias: "10056778",
    privacyPolicyUrl:
      "https://iki-assurances.fr/politique-de-protection-des-donnees",
  },
  {
    name: "2A L'Adour",
    orias: "14005826",
    privacyPolicyUrl: "https://2a-assurances.fr/politique-de-confidentialite/",
  },
];

export const PARTNERS_INTRO =
  "Votre demande pourra être transmise à l’un de nos courtiers partenaires ci-dessous. Tous sont des professionnels identifiés et immatriculés.";

export const PARTNERS_INTRO_NOTE =
  "Vous savez ainsi précisément qui peut vous rappeler.";
