import type {
  CareNeedId,
  CivilityId,
  CoveredPersonId,
  CurrentMutualTariffId,
  ProfessionalStatusId,
} from "@/components/form/types";
import type { SavingsTenureId } from "@/lib/savings-engine";
import type {
  VertiklCostHealth,
  VertiklGender,
  VertiklPeopleToCover,
  VertiklPriorityCare,
  VertiklProfessionalStatut,
  VertiklTimeInsured,
} from "./types";

export class VertiklMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VertiklMappingError";
  }
}

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

const TIME_INSURED_MAP: Record<SavingsTenureId, VertiklTimeInsured> = {
  "moins-2-ans": "moinsde2ans",
  "2-5-ans": "entre2et5ans",
  "plus-5-ans": "plusde5ans",
};

const GENDER_MAP: Record<CivilityId, VertiklGender> = {
  mme: "Madame",
  m: "Monsieur",
};

/** Returns undefined when empty — field is optional on Vertikl. */
export function mapGender(
  value: CivilityId | "" | undefined,
): VertiklGender | undefined {
  if (!value) return undefined;
  const mapped = GENDER_MAP[value];
  if (!mapped) {
    throw new VertiklMappingError(`Unmapped civility: ${value}`);
  }
  return mapped;
}

/** Returns undefined when empty — field is optional on Vertikl. */
export function mapInsurerTenure(
  value: SavingsTenureId | "" | undefined,
): VertiklTimeInsured | undefined {
  if (!value) return undefined;
  const mapped = TIME_INSURED_MAP[value];
  if (!mapped) {
    throw new VertiklMappingError(`Unmapped insurerTenure: ${value}`);
  }
  return mapped;
}

const PROFESSIONAL_STATUT_MAP: Record<
  ProfessionalStatusId,
  VertiklProfessionalStatut
> = {
  retired: "retraité",
  employee: "salarié",
  not_working: "sans emploi",
  other: "autre",
};

/** Returns undefined when empty — field is optional on Vertikl. */
export function mapProfessionalStatut(
  value: ProfessionalStatusId | "",
): VertiklProfessionalStatut | undefined {
  if (!value) return undefined;
  const mapped = PROFESSIONAL_STATUT_MAP[value];
  if (!mapped) {
    throw new VertiklMappingError(`Unmapped professionalStatus: ${value}`);
  }
  return mapped;
}

/** Returns the selected tariff id. Empty answers are omitted. */
export function mapCostHealth(
  value: CurrentMutualTariffId | "",
): VertiklCostHealth | undefined {
  if (!value) return undefined;
  return value;
}
