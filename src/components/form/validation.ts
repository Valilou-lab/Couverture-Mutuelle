import type { FormStepId, QuoteFormData } from "./types";
import { COVERED_PERSONS } from "./types";

export type FieldErrors = Partial<Record<keyof QuoteFormData, string>>;

export function isValidBirthDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  if (date > now) return false;
  if (year < 1900) return false;
  return true;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^(?:0[1-9]\d{8}|33[1-9]\d{8})$/.test(digits);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function needsSpouseBirthDate(data: QuoteFormData): boolean {
  const option = COVERED_PERSONS.find((item) => item.id === data.coveredPersons);
  return Boolean(option?.needsSpouseDob);
}

export function validateStep(
  step: FormStepId,
  data: QuoteFormData,
): FieldErrors {
  const errors: FieldErrors = {};

  switch (step) {
    case "careNeeds":
      if (data.careNeeds.length === 0) {
        errors.careNeeds = "Sélectionnez au moins un soin prioritaire.";
      }
      break;

    case "coveredPersons":
      if (!data.coveredPersons) {
        errors.coveredPersons = "Indiquez qui vous souhaitez assurer.";
      } else if (needsSpouseBirthDate(data)) {
        if (!data.spouseBirthDate) {
          errors.spouseBirthDate =
            "Indiquez la date de naissance de votre conjoint.";
        } else if (!isValidBirthDate(data.spouseBirthDate)) {
          errors.spouseBirthDate = "Format attendu : JJ/MM/AAAA.";
        }
      }
      break;

    case "birthDate":
      if (!data.birthDate) {
        errors.birthDate = "Indiquez votre date de naissance.";
      } else if (!isValidBirthDate(data.birthDate)) {
        errors.birthDate = "Format attendu : JJ/MM/AAAA.";
      }
      break;

    case "familyStatus":
      if (!data.familyStatus) {
        errors.familyStatus = "Sélectionnez votre situation familiale.";
      }
      break;

    case "postalCode":
      if (!/^\d{5}$/.test(data.postalCode)) {
        errors.postalCode = "Saisissez un code postal à 5 chiffres.";
      } else if (data.citiesOptions.length > 0 && !data.city) {
        errors.city = "Sélectionnez votre ville.";
      } else if (!data.city) {
        errors.city = "Nous n’avons pas trouvé de ville pour ce code postal.";
      }
      break;

    case "healthRegime":
      if (!data.healthRegime) {
        errors.healthRegime = "Sélectionnez votre régime de santé.";
      }
      break;

    case "alreadyInsured":
      if (!data.alreadyInsured) {
        errors.alreadyInsured = "Indiquez si vous êtes déjà assuré(e).";
      }
      break;

    case "insurer":
      if (data.alreadyInsured === "oui" && !data.insurer) {
        errors.insurer = "Sélectionnez votre assureur actuel.";
      }
      break;

    case "contact":
      if (!data.civility) errors.civility = "Sélectionnez votre civilité.";
      if (!data.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
      if (!data.lastName.trim()) errors.lastName = "Indiquez votre nom.";
      if (!data.phone.trim()) {
        errors.phone = "Indiquez votre numéro de téléphone.";
      } else if (!isValidPhone(data.phone)) {
        errors.phone = "Numéro de téléphone invalide.";
      }
      if (!data.email.trim()) {
        errors.email = "Indiquez votre adresse e-mail.";
      } else if (!isValidEmail(data.email)) {
        errors.email = "Adresse e-mail invalide.";
      }
      if (!data.callbackSlot) {
        errors.callbackSlot = "Choisissez un créneau de rappel.";
      }
      if (!data.consent) {
        errors.consent =
          "Le consentement est nécessaire pour être recontacté(e).";
      }
      break;

    default:
      break;
  }

  return errors;
}

export function formatBirthDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
  return parts.filter(Boolean).join("/");
}
