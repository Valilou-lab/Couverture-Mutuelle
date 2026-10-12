"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FORM_STEPS,
  initialFormData,
  COVERED_PERSONS,
  type CoveredPersonId,
  type FormStepId,
  type QuoteFormData,
} from "./types";
import {
  isEligibleFormBirthDate,
  shouldAskSpouseBirthDate,
  validateStep,
  type FieldErrors,
} from "./validation";
import { FormBackButton } from "./FormBackButton";
import { ProgressBar } from "./ProgressBar";
import { StepCareNeeds } from "./StepCareNeeds";
import { StepCoveredPersons } from "./StepCoveredPersons";
import { StepBirthDate } from "./StepBirthDate";
import { StepPostalCode } from "./StepPostalCode";
import { StepProfessionalStatus } from "./StepProfessionalStatus";
import { StepAlreadyInsured } from "./StepAlreadyInsured";
import { StepCurrentMutualTariff } from "./StepCurrentMutualTariff";
import { StepBirthAndPostal } from "./StepBirthAndPostal";
import { StepAnalyzing } from "./StepAnalyzing";
import { StepContact } from "./StepContact";
import { randomOffersCount } from "./mascotGuideConfig";
import { useQuoteJourney } from "@/context/QuoteJourneyContext";
import { getStoredAcquisition } from "@/lib/acquisition";
import { pushLeadCompletedToDataLayer } from "@/lib/gtm-consent";
import {
  prepareMetaLeadTracking,
  trackMetaFormStart,
  trackMetaFormStep,
  trackMetaLeadPixel,
} from "@/lib/meta/pixel";
import { scrollQuoteFormIntoView } from "./scrollQuoteFormIntoView";
import { SeniorFormContext } from "./seniorForm";
import {
  COMBINE_BIRTH_AND_POSTAL_STEP,
  SHOW_ALREADY_INSURED_STEP,
  isHiddenFormStep,
} from "./formConfig";

const ADVANCE_DELAY_MS = 320;
const SUBMIT_ERROR_MESSAGE =
  "Une erreur est survenue lors de l’envoi de votre demande. Merci de réessayer.";

function orderedFormSteps(firstStep?: FormStepId): FormStepId[] {
  if (!firstStep || firstStep === FORM_STEPS[0]) return FORM_STEPS;
  return [firstStep, ...FORM_STEPS.filter((step) => step !== firstStep)];
}

function getVisibleSteps(
  data: QuoteFormData,
  options: {
    skipBirthDate: boolean;
    skipPostalCode: boolean;
    firstStep?: FormStepId;
  },
): FormStepId[] {
  return orderedFormSteps(options.firstStep).filter((step) => {
    if (isHiddenFormStep(step)) return false;
    if (step === "alreadyInsured" && !SHOW_ALREADY_INSURED_STEP) return false;
    if (step === "birthAndPostal") {
      if (!COMBINE_BIRTH_AND_POSTAL_STEP) return false;
      if (options.skipBirthDate && options.skipPostalCode) return false;
      return true;
    }
    if (step === "postalCode") {
      if (COMBINE_BIRTH_AND_POSTAL_STEP) return false;
      if (options.skipPostalCode) return false;
      return true;
    }
    if (step === "birthDate") {
      if (COMBINE_BIRTH_AND_POSTAL_STEP) {
        return shouldAskSpouseBirthDate(data);
      }
      if (options.skipBirthDate && !shouldAskSpouseBirthDate(data)) return false;
      return true;
    }
    return true;
  });
}

function findFirstNeededStep(
  data: QuoteFormData,
  options: {
    skipBirthDate: boolean;
    skipPostalCode: boolean;
    firstStep?: FormStepId;
  },
): FormStepId {
  const steps = getVisibleSteps(data, options);
  for (const stepId of steps) {
    if (stepId === "analyzing" || stepId === "confirmation") continue;
    const errors = validateStep(stepId, data);
    if (Object.keys(errors).length > 0) {
      return stepId;
    }
  }
  return (
    steps.find((stepId) => stepId !== "analyzing" && stepId !== "confirmation") ??
    "currentMutualTariff"
  );
}

function applyCalculatorDefaults(
  current: QuoteFormData,
  calculator: {
    birthDate: string;
    postalCode: string;
    city: string;
  },
  options: { skipBirthDate: boolean; skipPostalCode: boolean },
): QuoteFormData {
  return {
    ...current,
    birthDate: options.skipBirthDate
      ? calculator.birthDate
      : current.birthDate,
    postalCode: options.skipPostalCode
      ? calculator.postalCode
      : current.postalCode,
    city: options.skipPostalCode ? calculator.city : current.city,
    citiesOptions: options.skipPostalCode
      ? calculator.city
        ? [calculator.city]
        : current.citiesOptions
      : current.citiesOptions,
  };
}

type QuoteFormFunnel = {
  onInteract?: () => void;
  onStepCompleted?: (stepNumber: number) => void;
  onSubmitSuccess?: () => void;
};

type QuoteFormProps = {
  careNeedsTitle?: string;
  coveredPersonsTitle?: string;
  firstStep?: FormStepId;
  firstStepIntro?: ReactNode;
  firstStepNote?: string;
  accentQuestions?: boolean;
  funnel?: QuoteFormFunnel;
  /** "senior": homepage layout (larger type / tap targets). Logic is identical. */
  variant?: "default" | "senior";
};

function questionStepNumber(
  currentStep: FormStepId,
  steps: FormStepId[],
): number | null {
  if (currentStep === "analyzing" || currentStep === "confirmation") {
    return null;
  }
  const questions = steps.filter(
    (item) => item !== "analyzing" && item !== "confirmation",
  );
  const index = questions.indexOf(currentStep);
  return index >= 0 ? index + 1 : null;
}

export function QuoteForm({
  careNeedsTitle = "Qu’est-ce qui compte le plus pour vous dans votre mutuelle ?",
  coveredPersonsTitle = "Qui doit-être assuré ?",
  firstStep = "currentMutualTariff",
  firstStepIntro = "Votre devis en 1 minute",
  firstStepNote,
  accentQuestions = true,
  funnel,
  variant = "default",
}: QuoteFormProps = {}) {
  const senior = variant === "senior";
  const router = useRouter();
  const {
    calculator,
    hasBirthDateFromCalculator,
    hasLocationFromCalculator,
    formFocusToken,
  } = useQuoteJourney();

  const skipBirthDate =
    hasBirthDateFromCalculator && isEligibleFormBirthDate(calculator.birthDate);
  const skipPostalCode = hasLocationFromCalculator;

  const [data, setData] = useState<QuoteFormData>(() =>
    applyCalculatorDefaults(initialFormData, calculator, {
      skipBirthDate,
      skipPostalCode,
    }),
  );
  const [step, setStep] = useState<FormStepId>(() => {
    const steps = getVisibleSteps(initialFormData, {
      skipBirthDate,
      skipPostalCode,
      firstStep,
    });
    if (firstStep && steps.includes(firstStep)) return firstStep;
    return (
      steps.find((item) => item !== "analyzing" && item !== "confirmation") ??
      "currentMutualTariff"
    );
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [offersCount, setOffersCount] = useState<number | null>(null);
  const advanceLock = useRef(false);
  const timers = useRef<number[]>([]);
  const lastFocusToken = useRef(0);
  const formRootRef = useRef<HTMLDivElement>(null);
  const leadCompletedPushedRef = useRef(false);
  const metaFormStartedRef = useRef(false);
  const metaStepsTrackedRef = useRef<Set<FormStepId>>(new Set());
  const metaLeadTrackedRef = useRef(false);

  /** Meta FormStart — first interaction only (no form data sent). */
  const markFormStarted = useCallback(() => {
    if (metaFormStartedRef.current) return;
    metaFormStartedRef.current = true;
    trackMetaFormStart();
  }, []);

  useEffect(() => {
    if (!skipBirthDate && !skipPostalCode) return;
    setData((current) =>
      applyCalculatorDefaults(current, calculator, {
        skipBirthDate,
        skipPostalCode,
      }),
    );
  }, [
    calculator.birthDate,
    calculator.city,
    calculator.postalCode,
    skipBirthDate,
    skipPostalCode,
  ]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const stepOptions = useMemo(
    () => ({ skipBirthDate, skipPostalCode, firstStep }),
    [firstStep, skipBirthDate, skipPostalCode],
  );

  const visibleSteps = useMemo(
    () => getVisibleSteps(data, stepOptions),
    [data, stepOptions],
  );
  const stepIndex = Math.max(0, visibleSteps.indexOf(step));
  const progressTotal = visibleSteps.filter(
    (item) => item !== "analyzing" && item !== "confirmation",
  ).length;
  const progressCurrent = Math.min(
    progressTotal,
    visibleSteps
      .slice(0, stepIndex + 1)
      .filter((item) => item !== "analyzing" && item !== "confirmation")
      .length || 1,
  );

  const patch = useCallback(
    (partial: Partial<QuoteFormData>) => {
      funnel?.onInteract?.();
      markFormStarted();
      setData((current) => ({ ...current, ...partial }));
      setErrors({});
      setSubmitError(null);
    },
    [funnel, markFormStarted],
  );

  const setPostalCode = useCallback(
    (postalCode: string) => patch({ postalCode }),
    [patch],
  );
  const setCitiesOptions = useCallback(
    (citiesOptions: string[]) => patch({ citiesOptions }),
    [patch],
  );
  const setCity = useCallback((city: string) => patch({ city }), [patch]);

  const goTo = useCallback((next: FormStepId) => {
    setErrors({});
    setStep(next);
    scrollQuoteFormIntoView(formRootRef.current);
  }, []);

  useEffect(() => {
    if (formFocusToken === 0 || formFocusToken === lastFocusToken.current) {
      return;
    }
    lastFocusToken.current = formFocusToken;

    setData((current) => {
      const nextData = applyCalculatorDefaults(current, calculator, stepOptions);
      const target = findFirstNeededStep(nextData, stepOptions);
      setErrors({});
      setStep(target);
      scrollQuoteFormIntoView(formRootRef.current);
      return nextData;
    });
  }, [calculator, formFocusToken, stepOptions]);

  const unlockLater = useCallback(() => {
    const id = window.setTimeout(() => {
      advanceLock.current = false;
      setIsAdvancing(false);
    }, ADVANCE_DELAY_MS);
    timers.current.push(id);
  }, []);

  const goNextFrom = useCallback(
    (currentStep: FormStepId, nextData: QuoteFormData) => {
      const validation = validateStep(currentStep, nextData);
      if (Object.keys(validation).length > 0) {
        setErrors(validation);
        advanceLock.current = false;
        setIsAdvancing(false);
        return;
      }

      const steps = getVisibleSteps(nextData, stepOptions);
      const currentIndex = steps.indexOf(currentStep);
      const completed = questionStepNumber(currentStep, steps);
      if (completed != null) {
        funnel?.onStepCompleted?.(completed);
        // Meta FormStep: step number + internal step key only (no answers).
        if (!metaStepsTrackedRef.current.has(currentStep)) {
          metaStepsTrackedRef.current.add(currentStep);
          trackMetaFormStep(completed, currentStep);
        }
      }
      const nextStep = steps[currentIndex + 1];
      if (nextStep) {
        goTo(nextStep);
      }
      unlockLater();
    },
    [funnel, goTo, stepOptions, unlockLater],
  );

  const submitLead = useCallback(async () => {
    if (advanceLock.current || isSubmitting) return;

    const validation = validateStep("contact", data);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    advanceLock.current = true;
    setIsSubmitting(true);
    setIsAdvancing(true);
    setSubmitError(null);
    setErrors({});

    try {
      const storedAcquisition = getStoredAcquisition();
      // Shared event_id: server sends the CAPI Lead (only with marketing consent),
      // the browser fires the Pixel Lead below once /api/leads returns OK.
      const metaTracking = prepareMetaLeadTracking();
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: senior ? { ...data, whatsappAvailable: false } : data,
          meta: {
            landingPageUrl: storedAcquisition.landingPageUrl,
            referrer: storedAcquisition.referrer,
            acquisition: storedAcquisition.acquisition,
          },
          metaTracking,
          ...(senior ? { consentVariant: "senior" } : {}),
        }),
      });

      let payload: { success?: boolean } | null = null;
      try {
        payload = (await response.json()) as { success?: boolean };
      } catch {
        payload = null;
      }

      if (!response.ok || payload?.success !== true) {
        setSubmitError(SUBMIT_ERROR_MESSAGE);
        return;
      }

      // GTM dataLayer (GA4 / Google Ads) — no form/PII parameters.
      if (!leadCompletedPushedRef.current) {
        leadCompletedPushedRef.current = true;
        pushLeadCompletedToDataLayer();
      }
      // Meta Pixel Lead (app code, not GTM) — no parameters, same event_id as CAPI.
      if (!metaLeadTrackedRef.current) {
        metaLeadTrackedRef.current = true;
        trackMetaLeadPixel(metaTracking);
      }
      funnel?.onSubmitSuccess?.();

      router.push("/confirmation");
    } catch {
      setSubmitError(SUBMIT_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
      setIsAdvancing(false);
      advanceLock.current = false;
    }
  }, [data, funnel, isSubmitting, router, senior]);

  const goNext = useCallback(() => {
    if (advanceLock.current || isSubmitting) return;
    if (step === "contact") {
      void submitLead();
      return;
    }
    advanceLock.current = true;
    setIsAdvancing(true);
    goNextFrom(step, data);
  }, [data, goNextFrom, isSubmitting, step, submitLead]);

  const selectAndAdvance = useCallback(
    (partial: Partial<QuoteFormData>) => {
      if (advanceLock.current) return;
      funnel?.onInteract?.();
      markFormStarted();
      advanceLock.current = true;
      setIsAdvancing(true);

      const nextData = { ...data, ...partial };
      setData(nextData);
      setErrors({});

      const id = window.setTimeout(() => {
        goNextFrom(step, nextData);
      }, ADVANCE_DELAY_MS);
      timers.current.push(id);
    },
    [data, funnel, goNextFrom, markFormStarted, step],
  );

  const goBack = useCallback(() => {
    if (advanceLock.current || isSubmitting) return;
    clearTimers();
    advanceLock.current = false;
    setIsAdvancing(false);
    setSubmitError(null);

    const currentIndex = visibleSteps.indexOf(step);
    for (let index = currentIndex - 1; index >= 0; index -= 1) {
      const previous = visibleSteps[index];
      if (previous && previous !== "analyzing") {
        goTo(previous);
        return;
      }
    }
  }, [clearTimers, goTo, isSubmitting, step, visibleSteps]);

  const handleAnalyzingDone = useCallback(() => {
    goTo("contact");
  }, [goTo]);

  // Jump past prefilled steps if we land on them.
  useEffect(() => {
    if (step !== "contact") {
      setOffersCount(null);
      return;
    }

    const target = randomOffersCount();
    setOffersCount(0);
    let value = 0;
    const id = window.setInterval(() => {
      value += 1;
      setOffersCount(value);
      if (value >= target) window.clearInterval(id);
    }, 70);

    return () => window.clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (!visibleSteps.includes(step)) {
      goTo(findFirstNeededStep(data, stepOptions));
    }
  }, [data, goTo, step, stepOptions, visibleSteps]);

  const showProgress = step !== "analyzing" && step !== "confirmation";
  const canGoBack = showProgress && stepIndex > 0;

  const stepContent = (
    <div key={step} className="form-step-enter">
      {step === "currentMutualTariff" ? (
        <StepCurrentMutualTariff
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(healthInsuranceGoal) =>
            selectAndAdvance({
              healthInsuranceGoal,
              // Goal step no longer collects “no insurance”; keep Vertikl
              // currently_insured required without reopening that question.
              alreadyInsured: "oui",
            })
          }
        />
      ) : null}

      {step === "careNeeds" ? (
        <StepCareNeeds
          data={data}
          errors={errors}
          disabled={isAdvancing}
          title={careNeedsTitle}
          onChange={(careNeeds) => patch({ careNeeds })}
          onNext={goNext}
        />
      ) : null}

      {step === "coveredPersons" ? (
        <StepCoveredPersons
          data={data}
          errors={errors}
          disabled={isAdvancing}
          title={coveredPersonsTitle}
          onSelectAndAdvance={(coveredPersons: CoveredPersonId) =>
            selectAndAdvance({
              coveredPersons,
              spouseBirthDate: COVERED_PERSONS.find(
                (item) => item.id === coveredPersons,
              )?.needsSpouseDob
                ? data.spouseBirthDate
                : "",
            })
          }
        />
      ) : null}

      {step === "birthAndPostal" ? (
        <StepBirthAndPostal
          data={data}
          errors={errors}
          disabled={isAdvancing}
          hideOwnBirthDate={skipBirthDate}
          hidePostalCode={skipPostalCode}
          onChangeBirthDate={(birthDate) => patch({ birthDate })}
          onPostalCode={setPostalCode}
          onCitiesLoaded={setCitiesOptions}
          onCity={setCity}
          onNext={goNext}
        />
      ) : null}

      {step === "birthDate" ? (
        <StepBirthDate
          data={data}
          errors={errors}
          disabled={isAdvancing}
          hideOwnBirthDate={COMBINE_BIRTH_AND_POSTAL_STEP || skipBirthDate}
          onChangeBirthDate={(birthDate) => patch({ birthDate })}
          onChangeSpouseBirthDate={(spouseBirthDate) =>
            patch({ spouseBirthDate })
          }
          onNext={goNext}
        />
      ) : null}

      {step === "postalCode" ? (
        <StepPostalCode
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onPostalCode={setPostalCode}
          onCitiesLoaded={setCitiesOptions}
          onCity={setCity}
          onNext={goNext}
        />
      ) : null}

      {step === "professionalStatus" ? (
        <StepProfessionalStatus
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(professionalStatus) =>
            selectAndAdvance({ professionalStatus })
          }
        />
      ) : null}

      {step === "alreadyInsured" ? (
        <StepAlreadyInsured
          data={data}
          errors={errors}
          disabled={isAdvancing}
          onSelectAndAdvance={(alreadyInsured) =>
            selectAndAdvance({
              alreadyInsured,
              insurer: "",
            })
          }
        />
      ) : null}

      {step === "analyzing" ? (
        <StepAnalyzing onDone={handleAnalyzingDone} />
      ) : null}

      {step === "contact" ? (
        <StepContact
          data={data}
          errors={errors}
          disabled={isAdvancing || isSubmitting}
          offersCount={offersCount}
          submitError={submitError}
          onPatch={patch}
          onNext={goNext}
        />
      ) : null}
    </div>
  );

  if (senior) {
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
                disabled={isAdvancing || isSubmitting}
                label="Question précédente"
              />
            ) : (
              <span aria-hidden="true" />
            )}
            <p className="text-balance text-center font-poppins text-[1.25rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.7rem]">
              {firstStepIntro}
            </p>
            <span aria-hidden="true" />
          </div>

          <div className="grid gap-4 px-4 pb-4 pt-[18px] min-[760px]:px-7 min-[760px]:pb-5 min-[760px]:pt-[22px]">
            {showProgress ? (
              <ProgressBar current={progressCurrent} total={progressTotal} />
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

  return (
    <div
      ref={formRootRef}
      id="formulaire-devis"
      className={`form-glow-pulse relative z-10 scroll-mt-28 overflow-visible rounded-[1.75rem] border-2 border-brand/40 bg-white p-3.5 pb-2 sm:p-5 sm:pb-3 lg:z-20 lg:border lg:border-[#ddd6fe] lg:px-7 lg:pb-4 lg:pt-6 lg:shadow-[0_18px_40px_-22px_rgba(91,33,182,0.28)] lg:[animation:none]${
        accentQuestions ? " tiktok-question-titles" : ""
      }`}
    >
      {canGoBack ? (
        <FormBackButton
          onBack={goBack}
          disabled={isAdvancing || isSubmitting}
          className="absolute left-1 top-1 z-20 sm:left-2 sm:top-2"
        />
      ) : null}

      {showProgress && (firstStepIntro || firstStepNote) ? (
        <div
          className={`-mx-3.5 -mt-3.5 mb-3 rounded-t-[1.6rem] border-b border-brand/20 bg-[#ddd6fe] pb-3.5 pt-4 text-center sm:-mx-5 sm:-mt-5 sm:mb-4 sm:pb-4 sm:pt-5 lg:-mx-7 lg:-mt-6 lg:mb-4 lg:pb-3.5 lg:pt-4 ${
            canGoBack
              ? "pl-12 pr-3.5 sm:pl-14 sm:pr-5 lg:pr-7"
              : "px-3.5 sm:px-5 lg:px-7"
          }`}
        >
          {firstStepIntro ? (
            <p className="font-manrope text-xl font-extrabold tracking-tight text-[#3b0764] sm:text-2xl lg:text-[1.75rem]">
              {firstStepIntro}
            </p>
          ) : null}
          {firstStepNote ? (
            <p className="mt-2 text-sm font-medium leading-snug text-brand sm:text-base">
              {firstStepNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {showProgress ? (
        <ProgressBar current={progressCurrent} total={progressTotal} />
      ) : null}

      {stepContent}

      <p className="mt-4 flex items-center justify-center gap-1.5 pb-1 text-[0.75rem] font-medium leading-none text-zinc-600 sm:text-[0.8125rem] lg:mt-3">
        <Image
          src="/images/Pictos/picto-securite-donnees.png"
          alt=""
          width={20}
          height={18}
          className="h-5 w-5 shrink-0 object-contain"
        />
        Vos données sont sécurisées
      </p>
    </div>
  );
}
