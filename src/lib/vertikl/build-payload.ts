import type { QuoteFormData } from "@/components/form/types";
import { type ConsentVariantId } from "@/lib/consent";
import {
  mapCostHealth,
  mapGender,
  mapHealthInsuranceGoal,
  mapInsurerTenure,
  mapPriorityCare,
  VertiklMappingError,
} from "./mappers";
import { frenchDateToIso } from "./normalize";
import type { LeadSubmissionMeta, VertiklLeadFields } from "./types";
import { buildV2VertiklCoreFieldsFromForm } from "./v2-core-fields";

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

  const consentVariantId = input.consentVariant ?? "default";
  const ikiPartnerConsent = form.partnerConsent === true;

  // Same 9 core fields as Vertikl precheck (identical normalization).
  // Do not send fields.consent_given — Vertikl rejects it.
  const core = buildV2VertiklCoreFieldsFromForm(form);
  const fields: VertiklLeadFields = {
    ...core,
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

  // cost_health stays optional — only set when a tariff was collected
  // (legacy savings path / calculator). Primary LP Q1 is alreadyInsured.
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
  // health_scheme is optional on Vertikl and no longer collected.
  // IKI partner opt-in is consent_partners_cm (boolean from the 2nd checkbox).
  // Acquisition (utm_*, fbclid, gclid) not mapped to Vertikl fields yet.

  return fields;
}
