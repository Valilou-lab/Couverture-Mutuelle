import type { QuoteFormData } from "@/components/form/types";
import { type ConsentVariantId } from "@/lib/consent";
import {
  mapCostHealth,
  mapCurrentlyInsured,
  mapGender,
  mapHealthInsuranceGoal,
  mapInsurerTenure,
  mapPeopleToCover,
  mapPriorityCare,
  mapProfessionalStatut,
  VertiklMappingError,
} from "./mappers";
import { frenchDateToIso, toInternationalFrenchPhone } from "./normalize";
import type { LeadSubmissionMeta, VertiklLeadFields } from "./types";

export type BuildVertiklFieldsInput = {
  form: QuoteFormData;
  meta?: LeadSubmissionMeta;
  /**
   * Consent collection clock (kept for callers that sync with
   * root `consent.collected_at`). No longer mapped into fields.*.
   */
  consentAt: Date;
  /** Allowlisted consent variant shown to the visitor (default: legacy text). */
  consentVariant?: ConsentVariantId;
  /** Kept for callers; no longer mapped into Vertikl fields. */
  ipAddress?: string;
  /** Kept for callers; no longer mapped into Vertikl fields. */
  userAgent?: string;
};

/**
 * Vertikl rejects consent_landing_page_url when it includes long query strings
 * (utm_*, fbclid, …). Send origin + pathname only; attribution stays on
 * meta.acquisition for campaign routing / Meta CAPI.
 */
export function normalizeConsentLandingPageUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    return `${url.origin}${url.pathname}`;
  } catch {
    return trimmed.split(/[?#]/)[0] ?? trimmed;
  }
}

export function buildVertiklFields(
  input: BuildVertiklFieldsInput,
): VertiklLeadFields {
  const { form, meta } = input;

  if (form.consent !== true) {
    throw new VertiklMappingError("consent must be true before building payload.");
  }

  const dateOfBirth = frenchDateToIso(form.birthDate);
  if (!dateOfBirth) {
    throw new VertiklMappingError("Invalid birthDate; expected JJ/MM/AAAA.");
  }

  let partnerDateOfBirth: string | undefined;
  if (form.spouseBirthDate.trim()) {
    const partner = frenchDateToIso(form.spouseBirthDate);
    if (!partner) {
      throw new VertiklMappingError(
        "Invalid spouseBirthDate; expected JJ/MM/AAAA.",
      );
    }
    partnerDateOfBirth = partner;
  }

  const phone = toInternationalFrenchPhone(form.phone);
  if (!phone) {
    throw new VertiklMappingError("Invalid French phone number.");
  }

  const consentVariantId = input.consentVariant ?? "default";
  const ikiPartnerConsent = form.partnerConsent === true;

  // Do not send fields.consent_given — Vertikl rejects it. Acquire only runs
  // after LP + API consent gates; V2 proof is root consent.{buyer_ids, collected_at}.
  const fields: VertiklLeadFields = {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    phone,
    email: form.email.trim(),
    date_of_birth: dateOfBirth,
    postal_code: form.postalCode.trim(),
    currently_insured: mapCurrentlyInsured(form.alreadyInsured),
    people_to_cover: mapPeopleToCover(form.coveredPersons),
    ...(consentVariantId === "iki"
      ? { consent_partners_cm: ikiPartnerConsent }
      : {}),
  };

  const gender = mapGender(form.civility);
  if (gender) {
    fields.gender = gender;
  }

  if (partnerDateOfBirth) {
    fields.partner_date_of_birth = partnerDateOfBirth;
  }

  const city = form.city.trim();
  if (city) {
    fields.city = city;
  }

  // Keep mapPriorityCare for when the step is re-enabled; omit if unanswered.
  if (form.careNeeds.length > 0) {
    fields.priority_care = mapPriorityCare(form.careNeeds);
  }

  const professionalStatut = mapProfessionalStatut(form.professionalStatus);
  if (professionalStatut) {
    fields.professional_statut = professionalStatut;
  }

  // cost_health stays optional — only set when a tariff was collected
  // (legacy savings path / calculator). Primary LP no longer asks it.
  const tariffCost = mapCostHealth(form.currentMutualTariff);
  if (tariffCost !== undefined) {
    fields.cost_health = tariffCost;
  }

  // Form stores local ids; mapper emits Vertikl LIST codes (e.g. save_money).
  const healthGoal = mapHealthInsuranceGoal(form.healthInsuranceGoal);
  if (healthGoal !== undefined) {
    fields.health_insurance_goal = healthGoal;
  }

  // Consent metadata (consent_given, ip, landing url, referrer, ua, optin
  // text, channels, …) is intentionally omitted from fields.
  // V2 acquire proof uses root consent.{buyer_ids, collected_at}.

  const timeInsured = mapInsurerTenure(meta?.calculator?.insurerTenure);
  if (timeInsured) {
    fields.time_insured = timeInsured;
  }

  // Intentionally omitted when unanswered / not collected:
  // familyStatus, insurer, citiesOptions, civility/gender, health_scheme,
  // spouse DOB, care priorities, marital_status, number_of_children.
  // professional_statut is mapped from professionalStatus when present.
  // cost_health is the selected tariff enum id when present (under_60, …).
  // health_insurance_goal is a Vertikl LIST of mapped codes (save_money, …).
  // currently_insured comes from LP Q1 (alreadyInsured oui/non).
  // priority_care is omitted when unanswered (step can be hidden).
  // health_scheme is optional on Vertikl and no longer collected.
  // IKI partner opt-in is consent_partners_cm (boolean from the 2nd checkbox).
  // Acquisition (utm_*, fbclid, gclid) not mapped to Vertikl fields yet.

  return fields;
}
