"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
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
import { requiresSmsPhoneVerification } from "@/lib/vertikl/normalize";
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
import {
  RedesignFormContext,
  SeniorFormContext,
} from "@/components/form/seniorForm";
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
import {
  OtpClientError,
  startPhoneOtp,
  verifyPhoneOtp,
} from "./adapters/otpClient";
import { submitV2Lead } from "./adapters/leadClient";
import { StepEmailV2 } from "./StepEmailV2";
import { StepPhoneV2 } from "./StepPhoneV2";
import {
  StepIdentityV2,
  validateV2IdentityNames,
} from "./StepIdentityV2";
import { StepSearchingV2 } from "./StepSearchingV2";
import { StepEligiblePartnersV2 } from "./StepEligiblePartnersV2";
import { StepPhoneVerifyV2 } from "./StepPhoneVerifyV2";
import { StepConfirmationV2 } from "./StepConfirmationV2";

const ADVANCE_DELAY_MS = 320;
const ELIGIBILITY_ERROR =
  "Impossible de vérifier vos offres pour le moment. Merci de réessayer.";

function validateConsentOnly(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  // Safety net — names are collected on the earlier identity step.
  if (!data.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!data.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!data.consent) {
    errors.consent = "Le consentement est nécessaire pour être contacté(e).";
  }
  return errors;
}

/**
 * Production-bound V2 quote form for `/devis`.
 * Eligibility → Vertikl precheck; OTP → Twilio; final submit → Vertikl acquire.
 */
export function QuoteFormV2({
  onFocusChange,
}: {
  /** Landing chrome only — does not change steps, APIs or payloads. */
  onFocusChange?: (focused: boolean) => void;
} = {}) {
  const formRootRef = useRef<HTMLDivElement>(null);
  const otpSendLock = useRef(false);
  /** Sync lock — React state alone cannot block autofill + button double fire. */
  const otpVerifyLock = useRef(false);
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
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpStatus, setOtpStatus] = useState<string | null>(null);
  const [phoneProofReady, setPhoneProofReady] = useState(false);
  const [resendCooldownSec, setResendCooldownSec] = useState(0);

  const questionStepIndex = V2_QUESTION_STEPS.indexOf(step);
  const showProgress = questionStepIndex >= 0;
  const flowIndex = V2_FLOW_STEPS.indexOf(step);
  const canGoBack =
    step !== "confirmation" &&
    !(step === "searching" && isCheckingEligibility) &&
    !(step === "phoneVerify" && (otpVerifying || otpSending)) &&
    flowIndex > 0;

  const progressCurrent = useMemo(() => {
    if (!showProgress) return V2_QUESTION_STEPS.length;
    return questionStepIndex + 1;
  }, [questionStepIndex, showProgress]);

  const questionNumber = showProgress ? progressCurrent : null;
  const formFocused = isV2FormFocusStep(step, questionNumber);
  useDevisLandingFocus(formFocused, formRootRef);
  useEffect(() => {
    onFocusChange?.(formFocused);
  }, [formFocused, onFocusChange]);

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
      goTo(
        requiresSmsPhoneVerification(data.phone) ? "phoneVerify" : "phone",
      );
      return;
    }
    if (step === "phoneVerify") {
      goTo("phone");
      return;
    }
    const idx = V2_FLOW_STEPS.indexOf(step);
    if (idx <= 0) return;
    goTo(V2_FLOW_STEPS[idx - 1]!);
  }, [
    data.phone,
    goTo,
    isAdvancing,
    isCheckingEligibility,
    otpVerifying,
    step,
  ]);

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
    advanceAfterDelay("identity");
  }, [advanceAfterDelay, data, isAdvancing]);

  const goNextFromIdentity = useCallback(() => {
    if (isAdvancing) return;
    const stepErrors = validateV2IdentityNames(data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    advanceAfterDelay("email");
  }, [advanceAfterDelay, data, isAdvancing]);

  const goNextFromEmail = useCallback(() => {
    if (isAdvancing) return;
    setErrors({});
    advanceAfterDelay("phone");
  }, [advanceAfterDelay, isAdvancing]);

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
          alreadyInsured: data.alreadyInsured,
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

  const startResendCooldown = useCallback(() => {
    setResendCooldownSec(30);
  }, []);

  useEffect(() => {
    if (resendCooldownSec <= 0) return;
    const id = window.setTimeout(() => {
      setResendCooldownSec((sec) => Math.max(0, sec - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [resendCooldownSec]);

  const submitV2Dossier = useCallback(async () => {
    if (!eligibilityToken) {
      throw new Error(
        "Preuve d’éligibilité manquante. Relancez la vérification des offres.",
      );
    }
    await submitV2Lead({
      data,
      partners: eligiblePartners,
      eligibilityToken,
    });
    goTo("confirmation");
  }, [data, eligibilityToken, eligiblePartners, goTo]);

  const sendPhoneOtp = useCallback(async () => {
    if (otpSendLock.current || otpSending) return false;
    otpSendLock.current = true;
    setOtpSending(true);
    setOtpError(null);
    setOtpStatus("Envoi du code…");
    try {
      await startPhoneOtp(data.phone);
      setOtpStatus("Code envoyé par SMS");
      startResendCooldown();
      return true;
    } catch (error) {
      setOtpStatus(null);
      setOtpError(
        error instanceof OtpClientError
          ? error.message
          : "Nous n’avons pas pu vérifier votre numéro pour le moment. Merci de réessayer.",
      );
      return false;
    } finally {
      setOtpSending(false);
      otpSendLock.current = false;
    }
  }, [data.phone, otpSending, startResendCooldown]);

  /** After phone: SMS OTP for mobiles, else buyer precheck directly. */
  const goNextFromPhone = useCallback(() => {
    if (isAdvancing || isCheckingEligibility || otpSending || otpVerifying) {
      return;
    }

    const stepErrors = validateV2EmailPhone(data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    const phoneE164 = normalizeV2PhoneToE164(data.phone);
    if (!phoneE164) {
      setErrors({
        phone: "Veuillez saisir un numéro de téléphone valide.",
      });
      return;
    }
    if (phoneE164 !== data.phone.trim()) {
      patch({ phone: phoneE164 });
    }

    if (requiresSmsPhoneVerification(phoneE164)) {
      setPhoneProofReady(false);
      setOtpError(null);
      setOtpStatus(null);
      goTo("phoneVerify");
      void sendPhoneOtp();
      return;
    }

    void checkEligibility({ skipFieldValidation: true });
  }, [
    checkEligibility,
    data,
    goTo,
    isAdvancing,
    isCheckingEligibility,
    otpSending,
    otpVerifying,
    patch,
    sendPhoneOtp,
  ]);

  /** Partners consent → acquire (phone already verified earlier when required). */
  const confirmDossier = useCallback(() => {
    if (otpVerifying || otpSending || isCheckingEligibility) return;
    const stepErrors = validateConsentOnly(data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    void (async () => {
      setOtpError(null);
      setOtpVerifying(true);
      try {
        await submitV2Dossier();
      } catch (error) {
        setErrors({
          consent:
            error instanceof Error
              ? error.message
              : "Impossible d’enregistrer le dossier pour le moment.",
        });
      } finally {
        setOtpVerifying(false);
      }
    })();
  }, [
    data,
    isCheckingEligibility,
    otpSending,
    otpVerifying,
    submitV2Dossier,
  ]);

  /** SMS OK (server Twilio) → show status → buyer precheck once. */
  const confirmOtp = useCallback(
    async (code: string) => {
      if (
        otpVerifyLock.current ||
        otpVerifying ||
        otpSending ||
        isCheckingEligibility
      ) {
        return;
      }
      otpVerifyLock.current = true;
      setOtpError(null);
      setOtpVerifying(true);
      try {
        if (!phoneProofReady) {
          await verifyPhoneOtp(data.phone, code);
          setPhoneProofReady(true);
          setOtpStatus("Numéro vérifié ✓");
          // Brief pause so the success state is visible before searching.
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 650);
          });
        }
        setOtpVerifying(false);
        await checkEligibility({ skipFieldValidation: true });
      } catch (error) {
        setPhoneProofReady(false);
        setOtpError(
          error instanceof Error
            ? error.message
            : "Saisissez un code à 6 chiffres.",
        );
        setOtpVerifying(false);
      } finally {
        otpVerifyLock.current = false;
      }
    },
    [
      checkEligibility,
      data.phone,
      isCheckingEligibility,
      otpSending,
      otpVerifying,
      phoneProofReady,
    ],
  );

  const skipStepScrollOnMount = useRef(true);
  useEffect(() => {
    if (skipStepScrollOnMount.current) {
      skipStepScrollOnMount.current = false;
      return;
    }
    if (step === "confirmation") return;
    scrollQuoteFormIntoView(formRootRef.current);
  }, [step]);

  const setPostalCode = useCallback(
    (postalCode: string) => patch({ postalCode }),
    [patch],
  );

  const stepContent = (
    <div key={step} className="form-step-enter">
      {step === "currentMutualTariff" ? (
        <StepCurrentMutualTariff
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(alreadyInsured) =>
            selectAndAdvance({ alreadyInsured }, "currentMutualTariff")
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
          onNext={goNextFromBirthAndPostal}
        />
      ) : null}

      {step === "identity" ? (
        <StepIdentityV2
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onPatch={patch}
          onNext={goNextFromIdentity}
        />
      ) : null}

      {step === "email" ? (
        <StepEmailV2
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onPatch={patch}
          onNext={goNextFromEmail}
        />
      ) : null}

      {step === "phone" ? (
        <StepPhoneV2
          data={data}
          errors={errors}
          disabled={
            isAdvancing ||
            isCheckingEligibility ||
            otpSending ||
            otpVerifying
          }
          onPatch={patch}
          onNext={goNextFromPhone}
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
          sending={otpSending}
          errorMessage={otpError}
          statusMessage={otpStatus}
          resendCooldownSec={resendCooldownSec}
          onConfirm={(code) => {
            void confirmOtp(code);
          }}
          onResend={() => {
            void sendPhoneOtp();
          }}
          onEditPhone={() => {
            setPhoneProofReady(false);
            setOtpError(null);
            setOtpStatus(null);
            goTo("phone");
          }}
        />
      ) : null}

      {step === "confirmation" ? (
        <StepConfirmationV2
          firstName={data.firstName}
          partners={eligiblePartners}
        />
      ) : null}
    </div>
  );

  return (
    <SeniorFormContext.Provider value>
      <RedesignFormContext.Provider value>
        <div ref={formRootRef} className="w-full scroll-mt-24">
        <div
          id="formulaire-devis"
          className="relative overflow-hidden rounded-[28px] border border-[#ddd6fe] bg-white shadow-[0_10px_30px_-18px_rgba(98,41,208,0.45)]"
        >
          <div
            className={`relative grid gap-4 px-4 pb-4 min-[760px]:px-7 min-[760px]:pb-5 ${
              step !== "confirmation" && canGoBack
                ? "pt-12 min-[760px]:pt-[3.25rem]"
                : "pt-4 min-[760px]:pt-5"
            }`}
          >
            {step !== "confirmation" && canGoBack ? (
              <FormBackButton
                onBack={goBack}
                disabled={
                  isAdvancing ||
                  isCheckingEligibility ||
                  otpVerifying ||
                  otpSending
                }
                label="Étape précédente"
                className="absolute left-1.5 top-1.5 z-20 sm:left-2.5 sm:top-2"
              />
            ) : null}
            {showProgress ? (
              <ProgressBar
                current={progressCurrent}
                total={V2_QUESTION_STEPS.length}
              />
            ) : null}
            {stepContent}

            <p className="flex items-center justify-center gap-2 text-[0.95rem] text-zinc-600">
              <span
                aria-hidden="true"
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 bg-emerald-600 text-white"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                </svg>
              </span>
              Personne ne vous appelle sans votre accord
            </p>

            {step === "confirmation" ? (
              <nav
                aria-label="Informations légales"
                className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.8125rem] text-zinc-500"
              >
                <Link
                  href="/politique-de-confidentialite"
                  className="underline underline-offset-2 hover:text-brand"
                >
                  Politique de confidentialité
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href="/retirer-mon-consentement"
                  className="underline underline-offset-2 hover:text-brand"
                >
                  Gérer mon consentement
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href="/partenaires"
                  className="underline underline-offset-2 hover:text-brand"
                >
                  Partenaires
                </Link>
              </nav>
            ) : null}
          </div>
        </div>
        </div>
      </RedesignFormContext.Provider>
    </SeniorFormContext.Provider>
  );
}
