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
  bubbleTone?: "violet" | "mint" | "cream" | "sky" | "green";
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
      "Votre priorité m’aide à",
      "trouver des offres vraiment",
      "adaptées.",
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
      "disponibles adaptées.",
    ],
    bubbleTone: "sky",
  },
  identity: {
    pose: "enveloppe",
    title: "Presque terminé !",
    lines: [
      "Indiquez votre nom et votre e-mail",
      "pour préparer vos devis.",
    ],
    bubbleTone: "cream",
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
    title: "Bonne nouvelle !",
    lines: [
      "Vous êtes éligible à une économie allant jusqu’à 400€/an 🥳",
    ],
    bubbleTone: "green",
    reassurance:
      "Vos données sont sécurisées et ne seront utilisées que pour la réception de devis, sans engagement.",
  },
  confirmation: {
    pose: "enveloppe",
    title: "Félicitation, votre dossier est envoyé.",
    lines: [],
    bubbleTone: "cream",
  },
};

function contactTitle(firstName?: string): string {
  const name = firstName?.trim();
  return name ? `Bonne nouvelle ${name} !` : "Bonne nouvelle !";
}

export function getFormMascotContent(
  step: FormStepId,
  options?: {
    isFirstStep?: boolean;
    firstName?: string;
    /** `/devis` Q5 — phone + email, not the savings “Bonne nouvelle” copy. */
    devisContact?: boolean;
  },
): FormMascotContent | null {
  if (options?.isFirstStep && step === "currentMutualTariff") {
    return {
      pose: "sourit-et-salue",
      title: "Bienvenue !",
      lines: ["Répondez à 5 questions pour recevoir vos devis"],
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
  if (options?.devisContact && step === "contact") {
    return {
      pose: "enveloppe",
      title: "Presque terminé !",
      lines: [
        "Indiquez votre téléphone et votre e-mail",
        "pour préparer vos devis.",
      ],
      bubbleTone: "cream",
    };
  }

  const content = GUIDE_BY_STEP[step] ?? null;
  if (content && step === "contact") {
    return { ...content, title: contactTitle(options?.firstName) };
  }
  return content;
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
    identity: 90,
    analyzing: 94,
    contact: 97,
    confirmation: 100,
  };
  return map[step] ?? 10;
}

export function randomOffersCount(): number {
  return 4 + Math.floor(Math.random() * 6); // 4–9
}
