"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  COVERED_PERSONS,
  initialFormData,
  type CoveredPersonId,
  type FormStepId,
  type QuoteFormData,
} from "@/components/form/types";
import {
  validateStep,
  type FieldErrors,
} from "@/components/form/validation";
import { FormBackButton } from "@/components/form/FormBackButton";
import { ProgressBar } from "@/components/form/ProgressBar";
import { StepCoveredPersons } from "@/components/form/StepCoveredPersons";
import { StepProfessionalStatus } from "@/components/form/StepProfessionalStatus";
import { StepCurrentMutualTariff } from "@/components/form/StepCurrentMutualTariff";
import { StepBirthAndPostal } from "@/components/form/StepBirthAndPostal";
import { SeniorFormContext } from "@/components/form/seniorForm";
import { scrollQuoteFormIntoView } from "@/components/form/scrollQuoteFormIntoView";
import {
  COMPLIANCE_FLOW_STEPS,
  COMPLIANCE_QUESTION_STEPS,
  ELIGIBILITY_MIN_LOADING_MS,
  type ComplianceStepId,
  type EligiblePartner,
  type EligibilityResponse,
} from "./complianceTypes";
import { StepComplianceContact } from "./StepComplianceContact";
import { StepComplianceSearching } from "./StepComplianceSearching";
import { StepEligiblePartners } from "./StepEligiblePartners";
import { StepCompliancePhoneVerify } from "./StepCompliancePhoneVerify";
import { StepComplianceConfirmation } from "./StepComplianceConfirmation";

const ADVANCE_DELAY_MS = 320;
const ELIGIBILITY_ERROR =
  "Impossible de vérifier vos offres pour le moment. Merci de réessayer.";

/** Question 5 — email + phone only (reuse contact validators, drop the rest). */
function validateEmailPhone(data: QuoteFormData): FieldErrors {
  const all = validateStep("contact", data);
  const errors: FieldErrors = {};
  if (all.email) errors.email = all.email;
  if (all.phone) errors.phone = all.phone;
  return errors;
}

function validateIdentityAndConsent(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!data.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!data.consent) {
    errors.consent = "Le consentement est nécessaire pour être contacté(e).";
  }
  return errors;
}

export function ComplianceQuoteForm() {
  const formRootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<QuoteFormData>(initialFormData);
  const [step, setStep] = useState<ComplianceStepId>("currentMutualTariff");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [eligiblePartners, setEligiblePartners] = useState<EligiblePartner[]>(
    [],
  );
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const questionStepIndex = COMPLIANCE_QUESTION_STEPS.indexOf(step);
  const showProgress = questionStepIndex >= 0;
  const flowIndex = COMPLIANCE_FLOW_STEPS.indexOf(step);
  const canGoBack =
    step !== "confirmation" &&
    step !== "phoneVerify" &&
    !(step === "searching" && isCheckingEligibility) &&
    flowIndex > 0;

  const progressCurrent = useMemo(() => {
    if (!showProgress) return COMPLIANCE_QUESTION_STEPS.length;
    return questionStepIndex + 1;
  }, [questionStepIndex, showProgress]);

  const patch = useCallback((partial: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(partial) as (keyof QuoteFormData)[]) {
        delete next[key];
      }
      return next;
    });
  }, []);

  const goTo = useCallback((next: ComplianceStepId) => {
    setStep(next);
    setErrors({});
    setEligibilityError(null);
    setOtpError(null);
    scrollQuoteFormIntoView(formRootRef.current);
  }, []);

  const goBack = useCallback(() => {
    if (isAdvancing || isCheckingEligibility || otpVerifying) return;
    if (step === "eligiblePartners" || step === "searching") {
      goTo("contact");
      return;
    }
    const idx = COMPLIANCE_FLOW_STEPS.indexOf(step);
    if (idx <= 0) return;
    goTo(COMPLIANCE_FLOW_STEPS[idx - 1]!);
  }, [goTo, isAdvancing, isCheckingEligibility, otpVerifying, step]);

  const advanceAfterDelay = useCallback(
    (next: ComplianceStepId) => {
      setIsAdvancing(true);
      window.setTimeout(() => {
        setIsAdvancing(false);
        goTo(next);
      }, ADVANCE_DELAY_MS);
    },
    [goTo],
  );

  const selectAndAdvance = useCallback(
    (partial: Partial<QuoteFormData>, current: ComplianceStepId) => {
      if (isAdvancing) return;
      const nextData = { ...data, ...partial };
      setData(nextData);
      const formStep = current as FormStepId;
      const stepErrors = validateStep(formStep, nextData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      setErrors({});
      const idx = COMPLIANCE_QUESTION_STEPS.indexOf(current);
      const next = COMPLIANCE_QUESTION_STEPS[idx + 1];
      if (next) advanceAfterDelay(next);
    },
    [advanceAfterDelay, data, isAdvancing],
  );

  const goNextFromBirthAndPostal = useCallback(() => {
    if (isAdvancing) return;
    const stepErrors = validateStep("birthAndPostal", data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    advanceAfterDelay("contact");
  }, [advanceAfterDelay, data, isAdvancing]);

  const checkEligibility = useCallback(
    async (options?: { skipFieldValidation?: boolean }) => {
      if (isCheckingEligibility || isAdvancing) return;

      if (!options?.skipFieldValidation) {
        const stepErrors = validateEmailPhone(data);
        if (Object.keys(stepErrors).length > 0) {
          setErrors(stepErrors);
          return;
        }
      }

      setErrors({});
      setEligibilityError(null);
      setEligiblePartners([]);
      goTo("searching");
      setIsCheckingEligibility(true);

      try {
        const payload = {
          healthInsuranceGoal: data.healthInsuranceGoal,
          coveredPersons: data.coveredPersons,
          professionalStatus: data.professionalStatus,
          birthDate: data.birthDate,
          postalCode: data.postalCode,
          city: data.city,
          phone: data.phone,
          email: data.email,
        };

        const [response] = await Promise.all([
          fetch("/api/eligibility", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, ELIGIBILITY_MIN_LOADING_MS);
          }),
        ]);

        if (!response.ok) {
          setEligibilityError(ELIGIBILITY_ERROR);
          return;
        }

        const json = (await response.json()) as EligibilityResponse;
        const partners = Array.isArray(json.partners)
          ? json.partners.filter(
              (p): p is EligiblePartner =>
                typeof p?.id === "string" && typeof p?.name === "string",
            )
          : [];

        setEligiblePartners(partners);
        goTo("eligiblePartners");
      } catch {
        setEligibilityError(ELIGIBILITY_ERROR);
      } finally {
        setIsCheckingEligibility(false);
      }
    },
    [data, goTo, isAdvancing, isCheckingEligibility],
  );

  const confirmDossier = useCallback(() => {
    const stepErrors = validateIdentityAndConsent(data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    // Demo only — no /api/leads, Vertikl, or Meta Lead. OTP is local next.
    goTo("phoneVerify");
  }, [data, goTo]);

  const confirmDemoOtp = useCallback(
    (code: string) => {
      if (otpVerifying) return;
      if (!/^\d{6}$/.test(code)) {
        setOtpError("Saisissez un code à 6 chiffres.");
        return;
      }
      setOtpError(null);
      setOtpVerifying(true);
      // Local demo only — no /api/verify, no Twilio, no Vertikl.
      window.setTimeout(() => {
        setOtpVerifying(false);
        goTo("confirmation");
      }, 600);
    },
    [goTo, otpVerifying],
  );

  useEffect(() => {
    if (step === "confirmation") return;
    scrollQuoteFormIntoView(formRootRef.current);
  }, [step]);

  const setPostalCode = useCallback(
    (postalCode: string) => patch({ postalCode }),
    [patch],
  );
  const setCitiesOptions = useCallback(
    (citiesOptions: string[]) => patch({ citiesOptions }),
    [patch],
  );
  const setCity = useCallback((city: string) => patch({ city }), [patch]);

  const stepContent = (
    <div key={step} className="form-step-enter">
      {step === "currentMutualTariff" ? (
        <StepCurrentMutualTariff
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(healthInsuranceGoal) =>
            selectAndAdvance(
              {
                healthInsuranceGoal,
                alreadyInsured: "oui",
              },
              "currentMutualTariff",
            )
          }
        />
      ) : null}

      {step === "coveredPersons" ? (
        <StepCoveredPersons
          data={data}
          errors={errors}
          disabled={isAdvancing}
          title="Qui doit être assuré ?"
          onSelectAndAdvance={(coveredPersons: CoveredPersonId) =>
            selectAndAdvance(
              {
                coveredPersons,
                spouseBirthDate: COVERED_PERSONS.find(
                  (item) => item.id === coveredPersons,
                )?.needsSpouseDob
                  ? data.spouseBirthDate
                  : "",
              },
              "coveredPersons",
            )
          }
        />
      ) : null}

      {step === "professionalStatus" ? (
        <StepProfessionalStatus
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(professionalStatus) =>
            selectAndAdvance({ professionalStatus }, "professionalStatus")
          }
        />
      ) : null}

      {step === "birthAndPostal" ? (
        <StepBirthAndPostal
          data={data}
          errors={errors}
          disabled={isAdvancing}
          hideOwnBirthDate={false}
          hidePostalCode={false}
          onChangeBirthDate={(birthDate) => patch({ birthDate })}
          onPostalCode={setPostalCode}
          onCitiesLoaded={setCitiesOptions}
          onCity={setCity}
          onNext={goNextFromBirthAndPostal}
        />
      ) : null}

      {step === "contact" ? (
        <StepComplianceContact
          data={data}
          errors={errors}
          disabled={isAdvancing || isCheckingEligibility}
          onPatch={patch}
          onNext={() => {
            void checkEligibility();
          }}
        />
      ) : null}

      {step === "searching" ? (
        <StepComplianceSearching
          errorMessage={eligibilityError}
          onRetry={() => {
            void checkEligibility({ skipFieldValidation: true });
          }}
        />
      ) : null}

      {step === "eligiblePartners" ? (
        <StepEligiblePartners
          partners={eligiblePartners}
          data={data}
          errors={errors}
          onPatch={patch}
          onConfirm={confirmDossier}
        />
      ) : null}

      {step === "phoneVerify" ? (
        <StepCompliancePhoneVerify
          phone={data.phone}
          verifying={otpVerifying}
          errorMessage={otpError}
          onConfirm={confirmDemoOtp}
          onEditPhone={() => goTo("contact")}
        />
      ) : null}

      {step === "confirmation" ? <StepComplianceConfirmation /> : null}
    </div>
  );

  return (
    <SeniorFormContext.Provider value>
      <div
        ref={formRootRef}
        id="formulaire-devis"
        className="relative scroll-mt-4 overflow-hidden rounded-[28px] border border-[#ddd6fe] bg-white shadow-[0_10px_30px_-18px_rgba(98,41,208,0.45)]"
      >
        <div className="grid grid-cols-[44px_1fr_44px] items-center border-b border-brand-muted bg-[#ddd6fe] px-2 py-3.5">
          {canGoBack ? (
            <FormBackButton
              onBack={goBack}
              disabled={isAdvancing || isCheckingEligibility || otpVerifying}
              label="Étape précédente"
            />
          ) : (
            <span aria-hidden="true" />
          )}
          <p className="text-balance text-center font-poppins text-[1.25rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.7rem]">
            Votre devis en 1 minute
          </p>
          <span aria-hidden="true" />
        </div>

        <div className="grid gap-4 px-4 pb-4 pt-[18px] min-[760px]:px-7 min-[760px]:pb-5 min-[760px]:pt-[22px]">
          {showProgress ? (
            <ProgressBar
              current={progressCurrent}
              total={COMPLIANCE_QUESTION_STEPS.length}
            />
          ) : null}

          {stepContent}

          <p className="flex items-center justify-center gap-2 text-[0.95rem] text-zinc-600">
            <Image
              src="/images/Pictos/picto-securite-donnees.png"
              alt=""
              width={22}
              height={20}
              className="h-5 w-[22px] shrink-0 object-contain"
            />
            Vos données sont sécurisées
          </p>
        </div>
      </div>
    </SeniorFormContext.Provider>
  );
}
