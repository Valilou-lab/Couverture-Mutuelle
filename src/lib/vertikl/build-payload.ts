import type { QuoteFormData } from "@/components/form/types";
import {
  CONSENT_CAMPAIGN,
  CONSENT_CHANNELS,
  CONSENT_OPTIN_TEXT_FULL,
  CONSENT_OPTIN_TEXT_VERSION,
  CONSENT_SOURCE,
  CONSENT_STATUS_ACTIVE,
  LANDING_PAGE_VERSION,
  LEGAL_NOTICE_VERSION,
} from "@/lib/consent";
import {
  mapCostHealth,
  mapCurrentlyInsured,
  mapGender,
  mapInsurerTenure,
  mapPeopleToCover,
  mapPriorityCare,
  mapProfessionalStatut,
  VertiklMappingError,
} from "./mappers";
import {
  addMonthsUtc,
  formatVertiklDateTime,
  frenchDateToIso,
  toInternationalFrenchPhone,
} from "./normalize";
import type { LeadSubmissionMeta, VertiklLeadFields } from "./types";

export type BuildVertiklFieldsInput = {
  form: QuoteFormData;
  meta?: LeadSubmissionMeta;
  consentAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

export function buildVertiklFields(
  input: BuildVertiklFieldsInput,
): VertiklLeadFields {
  const { form, meta, consentAt, ipAddress, userAgent } = input;

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

  const consentDatetime = formatVertiklDateTime(consentAt);
  const consentExpiration = formatVertiklDateTime(
    addMonthsUtc(consentAt, 12),
  );

  const fields: VertiklLeadFields = {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    phone,
    email: form.email.trim(),
    date_of_birth: dateOfBirth,
    postal_code: form.postalCode.trim(),
    currently_insured: mapCurrentlyInsured(form.alreadyInsured),
    people_to_cover: mapPeopleToCover(form.coveredPersons),
    consent_whatsapp: Boolean(form.whatsappAvailable),
    consent_given: true,
    consent_campaign: CONSENT_CAMPAIGN,
    consent_datetime: consentDatetime,
    consent_expiration_date: consentExpiration,
    consent_channels: [...CONSENT_CHANNELS],
    consent_landing_page_version: LANDING_PAGE_VERSION,
    consent_optin_text: CONSENT_OPTIN_TEXT_FULL,
    consent_optin_text_version: CONSENT_OPTIN_TEXT_VERSION,
    consent_legal_notice_version: LEGAL_NOTICE_VERSION,
    consent_source: CONSENT_SOURCE,
    consent_status: CONSENT_STATUS_ACTIVE,
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

  const tariffCost = mapCostHealth(form.currentMutualTariff);
  if (tariffCost !== undefined) {
    fields.cost_health = tariffCost;
  }

  if (ipAddress) {
    fields.consent_ip_address = ipAddress;
  }

  const landingUrl = meta?.landingPageUrl?.trim();
  if (landingUrl) {
    fields.consent_landing_page_url = landingUrl;
  }

  const referrer = meta?.referrer?.trim();
  if (referrer) {
    fields.consent_referrer = referrer;
  }

  if (userAgent) {
    fields.consent_user_agent = userAgent;
  }

  const timeInsured = mapInsurerTenure(meta?.calculator?.insurerTenure);
  if (timeInsured) {
    fields.time_insured = timeInsured;
  }

  // Intentionally omitted when unanswered / not collected:
  // familyStatus, insurer, citiesOptions, civility/gender, health_scheme,
  // spouse DOB, care priorities, marital_status, number_of_children.
  // professional_statut is mapped from professionalStatus when present.
  // cost_health is the selected tariff enum id (under_60, 60_90, …).
  // currently_insured is derived from the tariff step (no_insurance → false).
  // priority_care is omitted when unanswered (step can be hidden).
  // health_scheme is optional on Vertikl and no longer collected.
  // WhatsApp is ONLY consent_whatsapp — never added to consent_channels.
  // Acquisition (utm_*, fbclid, gclid) not mapped to Vertikl fields yet.

  return fields;
}
