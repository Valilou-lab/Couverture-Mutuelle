import { NextResponse } from "next/server";
import type { QuoteFormData } from "@/components/form/types";
import { initialFormData } from "@/components/form/types";
import {
  needsSpouseBirthDate,
  validateStep,
  type FieldErrors,
} from "@/components/form/validation";
import { buildVertiklFields } from "@/lib/vertikl/build-payload";
import { sendLeadToVertikl } from "@/lib/vertikl/client";
import { VertiklMappingError } from "@/lib/vertikl/mappers";
import type {
  AcquisitionParams,
  LeadCalculatorMeta,
  LeadSubmissionMeta,
} from "@/lib/vertikl/types";

export const runtime = "nodejs";

type LeadRequestBody = {
  form?: Partial<QuoteFormData>;
  meta?: LeadSubmissionMeta;
};

const FORM_VALIDATION_STEPS = [
  "careNeeds",
  "coveredPersons",
  "birthDate",
  "postalCode",
  "healthRegime",
  "alreadyInsured",
  "contact",
] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const first = vercelIp.split(",")[0]?.trim();
    if (first) return first;
  }

  return undefined;
}

function sanitizeAcquisition(
  value: unknown,
): AcquisitionParams | undefined {
  if (!isPlainObject(value)) return undefined;
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
  ] as const;
  const result: AcquisitionParams = {};
  for (const key of keys) {
    const raw = value[key];
    if (typeof raw === "string" && raw.trim()) {
      result[key] = raw.trim().slice(0, 200);
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function sanitizeCalculator(value: unknown): LeadCalculatorMeta | undefined {
  if (!isPlainObject(value)) return undefined;

  const result: LeadCalculatorMeta = {};

  if (
    typeof value.currentMonthlyPremium === "number" &&
    Number.isFinite(value.currentMonthlyPremium)
  ) {
    result.currentMonthlyPremium = value.currentMonthlyPremium;
  }

  const tenure = value.insurerTenure;
  if (
    tenure === "moins-2-ans" ||
    tenure === "2-5-ans" ||
    tenure === "plus-5-ans"
  ) {
    result.insurerTenure = tenure;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function parseForm(raw: unknown): QuoteFormData | null {
  if (!isPlainObject(raw)) return null;

  return {
    ...initialFormData,
    careNeeds: Array.isArray(raw.careNeeds)
      ? (raw.careNeeds.filter((item) => typeof item === "string") as QuoteFormData["careNeeds"])
      : [],
    coveredPersons:
      typeof raw.coveredPersons === "string"
        ? (raw.coveredPersons as QuoteFormData["coveredPersons"])
        : "",
    spouseBirthDate:
      typeof raw.spouseBirthDate === "string" ? raw.spouseBirthDate : "",
    birthDate: typeof raw.birthDate === "string" ? raw.birthDate : "",
    familyStatus: "",
    postalCode: typeof raw.postalCode === "string" ? raw.postalCode : "",
    city: typeof raw.city === "string" ? raw.city : "",
    citiesOptions: [],
    healthRegime:
      typeof raw.healthRegime === "string"
        ? (raw.healthRegime as QuoteFormData["healthRegime"])
        : "",
    alreadyInsured:
      raw.alreadyInsured === "oui" || raw.alreadyInsured === "non"
        ? raw.alreadyInsured
        : "",
    insurer: "",
    civility:
      raw.civility === "mme" || raw.civility === "m" ? raw.civility : "",
    firstName: typeof raw.firstName === "string" ? raw.firstName : "",
    lastName: typeof raw.lastName === "string" ? raw.lastName : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    email: typeof raw.email === "string" ? raw.email : "",
    whatsappAvailable: Boolean(raw.whatsappAvailable),
    consent: Boolean(raw.consent),
  };
}

function validateLeadForm(form: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};

  for (const step of FORM_VALIDATION_STEPS) {
    if (
      step === "birthDate" &&
      form.birthDate &&
      !needsSpouseBirthDate(form)
    ) {
      // Still validate birth date when present.
    }
    Object.assign(errors, validateStep(step, form));
  }

  return errors;
}

function failure(status: number, error: string) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  if (!process.env.VERTIKL_API_KEY?.trim()) {
    console.error("[api/leads] VERTIKL_API_KEY missing");
    return failure(500, "SERVER_MISCONFIGURED");
  }

  let body: LeadRequestBody;
  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return failure(400, "INVALID_JSON");
  }

  const form = parseForm(body.form);
  if (!form) {
    return failure(400, "INVALID_FORM");
  }

  if (form.consent !== true) {
    return failure(400, "CONSENT_REQUIRED");
  }

  const validationErrors = validateLeadForm(form);
  if (Object.keys(validationErrors).length > 0) {
    console.info("[api/leads] validation failed", {
      fields: Object.keys(validationErrors),
    });
    return failure(400, "VALIDATION_FAILED");
  }

  const meta: LeadSubmissionMeta = {
    landingPageUrl:
      typeof body.meta?.landingPageUrl === "string"
        ? body.meta.landingPageUrl.slice(0, 2000)
        : undefined,
    referrer:
      typeof body.meta?.referrer === "string"
        ? body.meta.referrer.slice(0, 2000)
        : undefined,
    acquisition: sanitizeAcquisition(body.meta?.acquisition),
    calculator: sanitizeCalculator(body.meta?.calculator),
  };

  // Capture acquisition for future Vertikl fields — not sent today.
  if (meta.acquisition) {
    console.info("[api/leads] acquisition present", {
      keys: Object.keys(meta.acquisition),
    });
  }

  if (meta.calculator) {
    console.info("[api/leads] calculator meta present", {
      keys: Object.keys(meta.calculator),
    });
  }

  const consentAt = new Date();
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent")?.trim() || undefined;

  let fields;
  try {
    fields = buildVertiklFields({
      form,
      meta,
      consentAt,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    if (error instanceof VertiklMappingError) {
      console.error("[api/leads] mapping error", error.message);
      return failure(400, "MAPPING_FAILED");
    }
    console.error("[api/leads] unexpected mapping failure");
    return failure(500, "LEAD_SUBMISSION_FAILED");
  }

  const result = await sendLeadToVertikl(fields);
  console.info("[api/leads] vertikl result", {
    ok: result.ok,
    httpStatus: result.httpStatus,
    failureMessage: result.failureMessage,
    returnedFieldNames: result.returnedFieldNames,
    consentWhatsappReturned: result.consentWhatsappReturned,
    sentFieldNames: Object.keys(fields).sort(),
  });
  if (!result.ok) {
    return failure(502, "LEAD_SUBMISSION_FAILED");
  }

  return NextResponse.json({ success: true });
}
