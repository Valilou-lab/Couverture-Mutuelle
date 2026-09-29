/**
 * Liste des partenaires (popup + page /partenaires).
 * Modifiez simplement ce tableau pour ajouter, retirer ou corriger une entrée.
 */
export type Partner = {
  name: string;
  orias: string;
};

export const PARTNERS: Partner[] = [
  { name: "Skarlett", orias: "23004755" },
  { name: "Majelis", orias: "17001968" },
  { name: "L’Aveyronnaise", orias: "18001058" },
  { name: "Santiane", orias: "07006282" },
  { name: "IKI / FDM", orias: "10056778" },
  { name: "Assurances de l’Adour", orias: "14005826" },
];

export const PARTNERS_INTRO =
  "Votre demande pourra être transmise à l’un de nos courtiers partenaires ci-dessous. Tous sont des professionnels identifiés et immatriculés.";

export const PARTNERS_INTRO_NOTE =
  "Vous savez ainsi précisément qui peut vous rappeler.";
