import type {
  CoveredPersonId,
  ProfessionalStatusId,
  QuoteFormData,
} from "@/components/form/types";
import { isValidFrenchPostalCode } from "@/lib/location-service";
import {
  mapCurrentlyInsured,
  mapPeopleToCover,
  mapProfessionalStatut,
  VertiklMappingError,
} from "@/lib/vertikl/mappers";
import {
  frenchDateToIso,
  toInternationalFrenchPhone,
} from "@/lib/vertikl/normalize";
import type {
  VertiklLeadFields,
  VertiklPeopleToCover,
  VertiklProfessionalStatut,
} from "@/lib/vertikl/types";

/**
 * Exact qualification set Vertikl requires on precheck (and identical on acquire).
 * Do not add city / consent_* / extras here — those belong on acquire only.
 */
export const V2_VERTIKL_CORE_FIELD_KEYS = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "date_of_birth",
  "postal_code",
  "currently_insured",
  "people_to_cover",
  "professional_statut",
] as const;

export type V2VertiklCoreFieldKey = (typeof V2_VERTIKL_CORE_FIELD_KEYS)[number];

export type V2VertiklCoreFields = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  postal_code: string;
  currently_insured: boolean;
  people_to_cover: VertiklPeopleToCover;
  professional_statut: VertiklProfessionalStatut;
};

/** Documented Vertikl acquire extras beyond the 9 core keys (omit if unanswered). */
export const V2_VERTIKL_ACQUIRE_EXTRA_KEYS = [
  "gender",
  "partner_date_of_birth",
  "city",
  "priority_care",
  "cost_health",
  "health_insurance_goal",
  "time_insured",
  "consent_partners_cm",
] as const;

export type V2VertiklCoreFieldsInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  postalCode: string;
  alreadyInsured: "oui" | "non" | "";
  coveredPersons: CoveredPersonId | "";
  professionalStatus: ProfessionalStatusId | "";
};

/**
 * Build the exact 9 Vertikl qualification fields with the same normalization
 * used by `/api/v2/eligibility` (precheck) and `buildVertiklFields` (acquire).
 */
export function buildV2VertiklCoreFields(
  input: V2VertiklCoreFieldsInput,
): V2VertiklCoreFields {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  if (!firstName) {
    throw new VertiklMappingError("firstName is required for Vertikl precheck.");
  }
  if (!lastName) {
    throw new VertiklMappingError("lastName is required for Vertikl precheck.");
  }

  const email = input.email.trim();
  if (!email) {
    throw new VertiklMappingError("email is required for Vertikl precheck.");
  }

  const phone = toInternationalFrenchPhone(input.phone);
  if (!phone) {
    throw new VertiklMappingError("Invalid French phone number.");
  }

  const dateOfBirth = frenchDateToIso(input.birthDate);
  if (!dateOfBirth) {
    throw new VertiklMappingError("Invalid birthDate; expected JJ/MM/AAAA.");
  }

  const postalCode = input.postalCode.trim();
  if (!isValidFrenchPostalCode(postalCode)) {
    throw new VertiklMappingError("Invalid French postal code.");
  }

  const professionalStatut = mapProfessionalStatut(input.professionalStatus);
  if (!professionalStatut) {
    throw new VertiklMappingError(
      "professionalStatus is required for Vertikl precheck.",
    );
  }

  return {
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    date_of_birth: dateOfBirth,
    postal_code: postalCode,
    currently_insured: mapCurrentlyInsured(input.alreadyInsured),
    people_to_cover: mapPeopleToCover(input.coveredPersons),
    professional_statut: professionalStatut,
  };
}

export function buildV2VertiklCoreFieldsFromForm(
  form: Pick<
    QuoteFormData,
    | "firstName"
    | "lastName"
    | "phone"
    | "email"
    | "birthDate"
    | "postalCode"
    | "alreadyInsured"
    | "coveredPersons"
    | "professionalStatus"
  >,
): V2VertiklCoreFields {
  return buildV2VertiklCoreFields({
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    email: form.email,
    birthDate: form.birthDate,
    postalCode: form.postalCode,
    alreadyInsured: form.alreadyInsured,
    coveredPersons: form.coveredPersons,
    professionalStatus: form.professionalStatus,
  });
}

export function pickV2VertiklCoreFields(
  fields: Record<string, unknown>,
): V2VertiklCoreFields | null {
  const out: Partial<V2VertiklCoreFields> = {};
  for (const key of V2_VERTIKL_CORE_FIELD_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(fields, key)) return null;
    const value = fields[key];
    if (value === undefined || value === null) return null;
    (out as Record<string, unknown>)[key] = value;
  }
  return out as V2VertiklCoreFields;
}

export function listFieldNames(fields: Record<string, unknown>): string[] {
  return Object.keys(fields).sort();
}

export function compareV2VertiklCoreFields(
  left: V2VertiklCoreFields,
  right: V2VertiklCoreFields,
): {
  identical: boolean;
  differentKeys: V2VertiklCoreFieldKey[];
} {
  const differentKeys: V2VertiklCoreFieldKey[] = [];
  for (const key of V2_VERTIKL_CORE_FIELD_KEYS) {
    if (left[key] !== right[key]) differentKeys.push(key);
  }
  return { identical: differentKeys.length === 0, differentKeys };
}

/** Acquire may add documented extras; core 9 must stay byte-identical to precheck. */
export function splitVertiklAcquireFields(fields: VertiklLeadFields): {
  core: V2VertiklCoreFields | null;
  extraKeys: string[];
  unknownKeys: string[];
} {
  const record = fields as Record<string, unknown>;
  const core = pickV2VertiklCoreFields(record);
  const allowedExtras = new Set<string>(V2_VERTIKL_ACQUIRE_EXTRA_KEYS);
  const extraKeys: string[] = [];
  const unknownKeys: string[] = [];
  for (const key of Object.keys(record).sort()) {
    if ((V2_VERTIKL_CORE_FIELD_KEYS as readonly string[]).includes(key)) {
      continue;
    }
    if (allowedExtras.has(key)) extraKeys.push(key);
    else unknownKeys.push(key);
  }
  return { core, extraKeys, unknownKeys };
}
