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
import { normalizeV2PhoneToE164 } from "@/lib/v2/phone";
import {
  validateV2EmailOnServer,
  validateV2EmailPhone,
  V2_EMAIL_INVALID_MESSAGE,
} from "./emailValidation";
import { FormBackButton } from "@/components/form/FormBackButton";
import { ProgressBar } from "@/components/form/ProgressBar";
import { StepCoveredPersons } from "@/components/form/StepCoveredPersons";
import { StepProfessionalStatusV2 } from "./StepProfessionalStatusV2";
import { StepCurrentMutualTariff } from "@/components/form/StepCurrentMutualTariff";
import { StepBirthAndPostalV2 } from "./StepBirthAndPostalV2";
import { SeniorFormContext } from "@/components/form/seniorForm";
import { scrollQuoteFormIntoView } from "@/components/form/scrollQuoteFormIntoView";
import {
  ELIGIBILITY_MIN_LOADING_MS,
  isV2FormFocusStep,
  V2_FLOW_STEPS,
  V2_QUESTION_STEPS,
  type EligiblePartner,
  type V2StepId,
} from "./v2Types";
import { useDevisLandingFocus } from "./useDevisLandingFocus";
import { fetchEligiblePartners } from "./adapters/eligibilityClient";
import { verifyOtpLocally } from "./adapters/otpClient";
import { submitV2LeadScaffold } from "./adapters/leadClient";
import { StepContactV2 } from "./StepContactV2";
import { StepSearchingV2 } from "./StepSearchingV2";
import { StepEligiblePartnersV2 } from "./StepEligiblePartnersV2";
import { StepPhoneVerifyV2 } from "./StepPhoneVerifyV2";
import { StepConfirmationV2 } from "./StepConfirmationV2";

const ADVANCE_DELAY_MS = 320;
const ELIGIBILITY_ERROR =
  "Impossible de vérifier vos offres pour le moment. Merci de réessayer.";

function validateIdentityAndConsent(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!data.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!data.consent) {
    errors.consent = "Le consentement est nécessaire pour être contacté(e).";
  }
  return errors;
}

/**
 * Production-bound V2 quote form for `/devis`.
 * Eligibility via `/api/v2/eligibility` only; OTP + lead are local adapters
 * until Twilio / `/api/leads` / Vertikl are wired.
 */
export function QuoteFormV2() {
  const formRootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<QuoteFormData>(initialFormData);
  const [step, setStep] = useState<V2StepId>("currentMutualTariff");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [eligiblePartners, setEligiblePartners] = useState<EligiblePartner[]>(
    [],
  );
  const [eligibilityToken, setEligibilityToken] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const questionStepIndex = V2_QUESTION_STEPS.indexOf(step);
  const showProgress = questionStepIndex >= 0;
  const flowIndex = V2_FLOW_STEPS.indexOf(step);
  const canGoBack =
    step !== "confirmation" &&
    step !== "phoneVerify" &&
    !(step === "searching" && isCheckingEligibility) &&
    flowIndex > 0;

  const progressCurrent = useMemo(() => {
    if (!showProgress) return V2_QUESTION_STEPS.length;
    return questionStepIndex + 1;
  }, [questionStepIndex, showProgress]);

  const questionNumber = showProgress ? progressCurrent : null;
  const formFocused = isV2FormFocusStep(step, questionNumber);
  useDevisLandingFocus(formFocused, formRootRef);

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

  const goTo = useCallback((next: V2StepId) => {
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
    const idx = V2_FLOW_STEPS.indexOf(step);
    if (idx <= 0) return;
    goTo(V2_FLOW_STEPS[idx - 1]!);
  }, [goTo, isAdvancing, isCheckingEligibility, otpVerifying, step]);

  const advanceAfterDelay = useCallback(
    (next: V2StepId) => {
      setIsAdvancing(true);
      window.setTimeout(() => {
        setIsAdvancing(false);
        goTo(next);
      }, ADVANCE_DELAY_MS);
    },
    [goTo],
  );

  const selectAndAdvance = useCallback(
    (partial: Partial<QuoteFormData>, current: V2StepId) => {
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
      const idx = V2_QUESTION_STEPS.indexOf(current);
      const next = V2_QUESTION_STEPS[idx + 1];
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

      const phoneE164 = normalizeV2PhoneToE164(data.phone);

      if (!options?.skipFieldValidation) {
        const stepErrors = validateV2EmailPhone(data);
        if (Object.keys(stepErrors).length > 0) {
          setErrors(stepErrors);
          return;
        }

        if (!phoneE164) {
          setErrors({
            phone: "Veuillez saisir un numéro de téléphone valide.",
          });
          return;
        }

        const emailCheck = await validateV2EmailOnServer(data.email);
        if (!emailCheck.ok) {
          setErrors({
            email: emailCheck.message || V2_EMAIL_INVALID_MESSAGE,
          });
          return;
        }
      }

      if (phoneE164 && phoneE164 !== data.phone.trim()) {
        patch({ phone: phoneE164 });
      }

      setErrors({});
      setEligibilityError(null);
      setEligiblePartners([]);
      setEligibilityToken(null);
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
          phone: phoneE164 || data.phone,
          email: data.email,
        };

        const [result] = await Promise.all([
          fetchEligiblePartners(payload),
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, ELIGIBILITY_MIN_LOADING_MS);
          }),
        ]);

        setEligiblePartners(result.partners);
        setEligibilityToken(result.eligibilityToken);
        goTo("eligiblePartners");
      } catch {
        setEligibilityError(ELIGIBILITY_ERROR);
      } finally {
        setIsCheckingEligibility(false);
      }
    },
    [data, goTo, isAdvancing, isCheckingEligibility, patch],
  );

  const confirmDossier = useCallback(() => {
    const stepErrors = validateIdentityAndConsent(data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    // Scaffold: no /api/leads, Vertikl, or Meta Lead — OTP next via local adapter.
    goTo("phoneVerify");
  }, [data, goTo]);

  const confirmOtp = useCallback(
    async (code: string) => {
      if (otpVerifying) return;
      setOtpError(null);
      setOtpVerifying(true);
      try {
        // Local OTP scaffold — later: /api/verify/start|check (Main), then lead.
        await verifyOtpLocally(code);
        if (!eligibilityToken) {
          throw new Error(
            "Preuve d’éligibilité manquante. Relancez la vérification des offres.",
          );
        }
        // Scaffold /api/v2/leads — no Meta Lead / GTM lead_completed / Vertikl yet.
        await submitV2LeadScaffold({
          data,
          partners: eligiblePartners,
          eligibilityToken,
        });
        goTo("confirmation");
      } catch (error) {
        setOtpError(
          error instanceof Error
            ? error.message
            : "Saisissez un code à 6 chiffres.",
        );
      } finally {
        setOtpVerifying(false);
      }
    },
    [data, eligibilityToken, eligiblePartners, goTo, otpVerifying],
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
        <StepProfessionalStatusV2
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(professionalStatus) =>
            selectAndAdvance({ professionalStatus }, "professionalStatus")
          }
        />
      ) : null}

      {step === "birthAndPostal" ? (
        <StepBirthAndPostalV2
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
        <StepContactV2
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
        <StepSearchingV2
          errorMessage={eligibilityError}
          onRetry={() => {
            void checkEligibility({ skipFieldValidation: true });
          }}
        />
      ) : null}

      {step === "eligiblePartners" ? (
        <StepEligiblePartnersV2
          partners={eligiblePartners}
          data={data}
          errors={errors}
          onPatch={patch}
          onConfirm={confirmDossier}
        />
      ) : null}

      {step === "phoneVerify" ? (
        <StepPhoneVerifyV2
          phone={data.phone}
          verifying={otpVerifying}
          errorMessage={otpError}
          onConfirm={(code) => {
            void confirmOtp(code);
          }}
          onEditPhone={() => goTo("contact")}
        />
      ) : null}

      {step === "confirmation" ? <StepConfirmationV2 /> : null}
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
              total={V2_QUESTION_STEPS.length}
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
