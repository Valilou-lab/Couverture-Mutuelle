import type {
  CareNeedId,
  CoveredPersonId,
  HealthRegimeId,
} from "@/components/form/types";
import type {
  VertiklHealthScheme,
  VertiklPeopleToCover,
  VertiklPriorityCare,
} from "./types";

export class VertiklMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VertiklMappingError";
  }
}

const HEALTH_SCHEME_MAP: Record<HealthRegimeId, VertiklHealthScheme> = {
  general: "regime_general",
  tns: "travailleur_non_salarie",
  agricole: "regime_agricole",
  "alsace-moselle": "alsace_moselle",
};

const PEOPLE_TO_COVER_MAP: Record<CoveredPersonId, VertiklPeopleToCover> = {
  moi: "moi",
  "moi-enfants": "moi_enfants",
  "moi-conjoint": "moi_conjoint",
  "moi-conjoint-enfants": "moi_conjoint_enfants",
};

const PRIORITY_CARE_MAP: Record<CareNeedId, VertiklPriorityCare> = {
  hospitalisation: "hospitalisation",
  optique: "optique",
  dentaire: "dentaire",
  audition: "audition",
  "medecines-douces": "medecines_douces",
  "soins-courants": "soins_courants",
  "je-ne-sais-pas": "je_ne_sais_pas",
};

export function mapHealthScheme(value: HealthRegimeId | ""): VertiklHealthScheme {
  if (!value) {
    throw new VertiklMappingError("healthRegime is required.");
  }
  const mapped = HEALTH_SCHEME_MAP[value];
  if (!mapped) {
    throw new VertiklMappingError(`Unmapped healthRegime: ${value}`);
  }
  return mapped;
}

export function mapPeopleToCover(
  value: CoveredPersonId | "",
): VertiklPeopleToCover {
  if (!value) {
    throw new VertiklMappingError("coveredPersons is required.");
  }
  const mapped = PEOPLE_TO_COVER_MAP[value];
  if (!mapped) {
    throw new VertiklMappingError(`Unmapped coveredPersons: ${value}`);
  }
  return mapped;
}

export function mapPriorityCare(values: CareNeedId[]): VertiklPriorityCare[] {
  if (values.length === 0) {
    throw new VertiklMappingError("careNeeds must not be empty.");
  }
  return values.map((id) => {
    const mapped = PRIORITY_CARE_MAP[id];
    if (!mapped) {
      throw new VertiklMappingError(`Unmapped careNeed: ${id}`);
    }
    return mapped;
  });
}

export function mapCurrentlyInsured(value: "oui" | "non" | ""): boolean {
  if (value === "oui") return true;
  if (value === "non") return false;
  throw new VertiklMappingError("alreadyInsured must be oui or non.");
}
