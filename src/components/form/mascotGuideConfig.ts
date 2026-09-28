import type { FormStepId } from "./types";
import { SHOW_CARE_PRIORITIES_STEP } from "./formConfig";

export type FormMascotPose =
  | "sourit-et-salue"
  | "pouce"
  | "loupe"
  | "satisfaite"
  | "travaille"
  | "curieuse"
  | "enveloppe"
  | "bras-leves";

export type FormMascotContent = {
  pose: FormMascotPose;
  title: string;
  /** Static lines, or use renderMessage for dynamic content. */
  lines: string[];
  bubbleTone?: "violet" | "mint" | "cream" | "sky";
  reassurance?: string;
};

const POSE_SRC: Record<FormMascotPose, string> = {
  "sourit-et-salue": "/images/mascotte-sourit-et-salue.png",
  pouce: "/images/mascotte-pouce.png",
  loupe: "/images/mascotte-loupe.png",
  satisfaite: "/images/mascotte-satisfaite.png",
  travaille: "/images/mascotte-travaille.png",
  curieuse: "/images/mascotte-curieuse.png",
  enveloppe: "/images/mascotte-enveloppe.png?v=3",
  "bras-leves": "/images/mascotte-bras-leves.png?v=2",
};

export function getMascotPoseSrc(pose: FormMascotPose): string {
  return POSE_SRC[pose];
}

const GUIDE_BY_STEP: Partial<Record<FormStepId, FormMascotContent>> = {
  currentMutualTariff: {
    pose: "curieuse",
    title: "C’est parti !",
    lines: [
      "Votre tarif actuel m’aide à",
      "trouver des offres plus",
      "avantageuses.",
    ],
    bubbleTone: "mint",
  },
  careNeeds: {
    pose: "sourit-et-salue",
    title: "Bienvenue !",
    lines: [
      "Commençons par identifier",
      "ce qui est le plus important",
      "pour vous.",
    ],
    bubbleTone: "mint",
  },
  coveredPersons: {
    pose: "pouce",
    title: "Super, merci !",
    lines: SHOW_CARE_PRIORITIES_STEP
      ? ["On avance bien, vous êtes à 25 % de votre devis 🎉"]
      : ["On avance bien, encore quelques questions."],
    bubbleTone: "cream",
  },
  birthDate: {
    pose: "loupe",
    title: "Excellent !",
    lines: [
      "L’âge est essentiel pour",
      "sélectionner les offres adaptées.",
    ],
    bubbleTone: "sky",
  },
  postalCode: {
    pose: "loupe",
    title: "Super !",
    lines: [
      "Je recherche maintenant",
      "les offres disponibles",
      "dans votre région.",
    ],
    bubbleTone: "sky",
  },
  professionalStatus: {
    pose: "travaille",
    title: "On avance !",
    lines: [
      "Les garanties et tarifs varient",
      "selon votre statut professionnel.",
    ],
    bubbleTone: "cream",
  },
  birthAndPostal: {
    pose: "loupe",
    title: "Excellent !",
    lines: [
      "Âge et code postal me permettent",
      "de sélectionner les offres",
      "disponibles près de chez vous.",
    ],
    bubbleTone: "sky",
  },
  alreadyInsured: {
    pose: "curieuse",
    title: "Parfait !",
    lines: [
      "Cela me permettra de comparer",
      "votre contrat actuel",
      "avec d’autres solutions.",
    ],
    bubbleTone: "mint",
  },
  analyzing: {
    pose: "travaille",
    title: "⏳ Analyse en cours…",
    lines: [
      "Je compare les garanties",
      "et les tarifs des",
      "principaux assureurs.",
    ],
    bubbleTone: "violet",
  },
  contact: {
    pose: "enveloppe",
    title: "🎉 Bonne nouvelle !",
    lines: [
      "Dernière étape ! Indiquez",
      "vos coordonnées pour recevoir",
      "votre comparaison personnalisée.",
    ],
    bubbleTone: "mint",
    reassurance:
      "🔒 Vos infos restent confidentielles et ne serviront qu’à votre demande.",
  },
  confirmation: {
    pose: "enveloppe",
    title: "Félicitation, votre dossier est envoyé.",
    lines: [],
    bubbleTone: "cream",
  },
};

export function getFormMascotContent(
  step: FormStepId,
  options?: { isFirstStep?: boolean },
): FormMascotContent | null {
  if (options?.isFirstStep && step === "currentMutualTariff") {
    return {
      pose: "sourit-et-salue",
      title: "Bienvenue !",
      lines: ["Commençons par le tarif", "de votre mutuelle actuelle."],
      bubbleTone: "mint",
    };
  }
  if (options?.isFirstStep && step === "professionalStatus") {
    return {
      pose: "sourit-et-salue",
      title: "Bienvenue !",
      lines: ["Commençons par votre", "profession."],
      bubbleTone: "mint",
    };
  }
  if (options?.isFirstStep && step === "coveredPersons") {
    return {
      pose: "sourit-et-salue",
      title: "Bienvenue !",
      lines: ["Commençons par qui", "vous souhaitez assurer."],
      bubbleTone: "mint",
    };
  }
  return GUIDE_BY_STEP[step] ?? null;
}

/** Narrative progress so étape 2 (coveredPersons) lands on 25%. */
export function getFormProgressPercent(step: FormStepId): number {
  const map: Partial<Record<FormStepId, number>> = {
    currentMutualTariff: 12,
    coveredPersons: 25,
    professionalStatus: 40,
    birthAndPostal: 55,
    birthDate: 70,
    postalCode: 70,
    alreadyInsured: 85,
    analyzing: 94,
    contact: 97,
    confirmation: 100,
  };
  return map[step] ?? 10;
}

export function randomOffersCount(): number {
  return 4 + Math.floor(Math.random() * 6); // 4–9
}
