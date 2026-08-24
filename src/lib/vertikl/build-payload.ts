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
  mapCurrentlyInsured,
  mapHealthScheme,
  mapInsurerTenure,
  mapPeopleToCover,
  mapPriorityCare,
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
    health_scheme: mapHealthScheme(form.healthRegime),
    currently_insured: mapCurrentlyInsured(form.alreadyInsured),
    people_to_cover: mapPeopleToCover(form.coveredPersons),
    priority_care: mapPriorityCare(form.careNeeds),
    "consent-whatsapp": Boolean(form.whatsappAvailable),
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

  if (partnerDateOfBirth) {
    fields.partner_date_of_birth = partnerDateOfBirth;
  }

  const city = form.city.trim();
  if (city) {
    fields.city = city;
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

  // Savings calculator only — optional Vertikl fields (never for QuoteForm).
  const premium = meta?.calculator?.currentMonthlyPremium;
  if (typeof premium === "number" && Number.isFinite(premium)) {
    fields.health_insurance_budget = premium;
  }

  const timeInsured = mapInsurerTenure(meta?.calculator?.insurerTenure);
  if (timeInsured) {
    fields["time-insured"] = timeInsured;
  }

  // Intentionally omitted: familyStatus, insurer, citiesOptions, civility.
  // WhatsApp is ONLY consent-whatsapp — never added to consent_channels.
  // Acquisition (utm_*, fbclid, gclid) not mapped to Vertikl fields yet.

  return fields;
}
