"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  needsSpouseBirthDate,
  validateStep,
  type FieldErrors,
} from "./validation";
import { ProgressBar } from "./ProgressBar";
import { StepCareNeeds } from "./StepCareNeeds";
import { StepCoveredPersons } from "./StepCoveredPersons";
import { StepBirthDate } from "./StepBirthDate";
import { StepPostalCode } from "./StepPostalCode";
import { StepHealthRegime } from "./StepHealthRegime";
import { StepAlreadyInsured } from "./StepAlreadyInsured";
import { StepAnalyzing } from "./StepAnalyzing";
import { StepContact } from "./StepContact";
import { FormMascotGuide } from "./FormMascotGuide";
import {
  getFormProgressPercent,
  randomOffersCount,
} from "./mascotGuideConfig";
import { useQuoteJourney } from "@/context/QuoteJourneyContext";
import { getStoredAcquisition } from "@/lib/acquisition";
import { pushLeadCompletedToDataLayer } from "@/lib/gtm-consent";
import { scrollQuoteFormIntoView } from "./scrollQuoteFormIntoView";

const ADVANCE_DELAY_MS = 320;
const SUBMIT_ERROR_MESSAGE =
  "Une erreur est survenue lors de l’envoi de votre demande. Merci de réessayer.";

function getVisibleSteps(
  data: QuoteFormData,
  options: { skipBirthDate: boolean; skipPostalCode: boolean },
): FormStepId[] {
  return FORM_STEPS.filter((step) => {
    // Skip own-DOB step only when already known AND no spouse DOB is needed.
    if (
      step === "birthDate" &&
      options.skipBirthDate &&
      !needsSpouseBirthDate(data)
    ) {
      return false;
    }
    if (step === "postalCode" && options.skipPostalCode) return false;
    return true;
  });
}

function findFirstNeededStep(
  data: QuoteFormData,
  options: { skipBirthDate: boolean; skipPostalCode: boolean },
): FormStepId {
  const steps = getVisibleSteps(data, options);
  for (const stepId of steps) {
    if (stepId === "analyzing" || stepId === "confirmation") continue;
    const errors = validateStep(stepId, data);
    if (Object.keys(errors).length > 0) {
      return stepId;
    }
  }
  return steps.includes("contact") ? "contact" : "careNeeds";
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

export function QuoteForm() {
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
  const [step, setStep] = useState<FormStepId>("careNeeds");
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
    () => ({ skipBirthDate, skipPostalCode }),
    [skipBirthDate, skipPostalCode],
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

  const patch = useCallback((partial: Partial<QuoteFormData>) => {
    setData((current) => ({ ...current, ...partial }));
    setErrors({});
    setSubmitError(null);
  }, []);

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
      const nextStep = steps[currentIndex + 1];
      if (nextStep) {
        goTo(nextStep);
      }
      unlockLater();
    },
    [goTo, stepOptions, unlockLater],
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: data,
          meta: {
            landingPageUrl: storedAcquisition.landingPageUrl,
            referrer: storedAcquisition.referrer,
            acquisition: storedAcquisition.acquisition,
          },
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

      // GTM dataLayer only — no Meta Pixel, no form/PII parameters.
      if (!leadCompletedPushedRef.current) {
        leadCompletedPushedRef.current = true;
        pushLeadCompletedToDataLayer();
      }

      router.push("/confirmation");
    } catch {
      setSubmitError(SUBMIT_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
      setIsAdvancing(false);
      advanceLock.current = false;
    }
  }, [data, isSubmitting, router]);

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
    [data, goNextFrom, step],
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
    if (
      (skipBirthDate && step === "birthDate") ||
      (skipPostalCode && step === "postalCode")
    ) {
      goTo(findFirstNeededStep(data, stepOptions));
    }
  }, [data, goTo, skipBirthDate, skipPostalCode, step, stepOptions]);

  const showProgress = step !== "analyzing" && step !== "confirmation";
  const showMascotGuide =
    step !== "analyzing" && step !== "confirmation" && step !== "contact";

  return (
    <div
      ref={formRootRef}
      id="formulaire-devis"
      className="form-glow-pulse relative z-10 scroll-mt-28 overflow-visible rounded-[1.75rem] border-2 border-brand/40 bg-white p-3.5 pb-2 sm:p-5 sm:pb-3 lg:p-8 lg:pb-4"
    >
      <p className="mb-4 hidden text-center font-manrope text-xl font-extrabold leading-snug tracking-tight text-[#3b0764] sm:mb-5 sm:text-2xl lg:mb-5 lg:block lg:text-[1.7rem]">
        VOTRE DEVIS EN{" "}
        <span className="font-extrabold text-[#c026d3]">1&nbsp;MINUTE</span>{" "}
        <span aria-hidden="true">⏱️</span>
      </p>

      {showProgress ? (
        <ProgressBar
          current={progressCurrent}
          total={progressTotal}
          percent={getFormProgressPercent(step)}
        />
      ) : null}

      <div key={step} className="form-step-enter">
        {step === "careNeeds" ? (
          <StepCareNeeds
            data={data}
            errors={errors}
            disabled={isAdvancing}
            onChange={(careNeeds) => patch({ careNeeds })}
            onNext={goNext}
          />
        ) : null}

        {step === "coveredPersons" ? (
          <StepCoveredPersons
            data={data}
            errors={errors}
            disabled={isAdvancing}
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
            onBack={goBack}
          />
        ) : null}

        {step === "birthDate" ? (
          <StepBirthDate
            data={data}
            errors={errors}
            disabled={isAdvancing}
            hideOwnBirthDate={skipBirthDate}
            onChangeBirthDate={(birthDate) => patch({ birthDate })}
            onChangeSpouseBirthDate={(spouseBirthDate) =>
              patch({ spouseBirthDate })
            }
            onBack={goBack}
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
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}

        {step === "healthRegime" ? (
          <StepHealthRegime
            data={data}
            errors={errors}
            disabled={isAdvancing}
            onSelectAndAdvance={(healthRegime) =>
              selectAndAdvance({ healthRegime })
            }
            onBack={goBack}
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
            onBack={goBack}
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
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}
      </div>

      {showMascotGuide ? <FormMascotGuide step={step} /> : null}
    </div>
  );
}
