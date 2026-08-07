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
  { name: "Tessoria", orias: "25007309" },
  { name: "Santiane", orias: "07006282" },
  { name: "IKI / FDM", orias: "10056778" },
  { name: "ECG Assurances", orias: "07009027" },
];

export const PARTNERS_INTRO =
  "Nous travaillons avec les meilleurs assureurs pour vous trouver l’offre la plus adaptée.";
