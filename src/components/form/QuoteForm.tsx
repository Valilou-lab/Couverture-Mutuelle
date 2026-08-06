"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FORM_STEPS,
  initialFormData,
  type CoveredPersonId,
  type FormStepId,
  type QuoteFormData,
} from "./types";
import { isValidBirthDate, validateStep, type FieldErrors } from "./validation";
import { ProgressBar } from "./ProgressBar";
import { StepCareNeeds } from "./StepCareNeeds";
import { StepCoveredPersons } from "./StepCoveredPersons";
import { StepBirthDate } from "./StepBirthDate";
import { StepFamilyStatus } from "./StepFamilyStatus";
import { StepPostalCode } from "./StepPostalCode";
import { StepHealthRegime } from "./StepHealthRegime";
import { StepAlreadyInsured } from "./StepAlreadyInsured";
import { StepInsurer } from "./StepInsurer";
import { StepAnalyzing } from "./StepAnalyzing";
import { StepContact } from "./StepContact";
import { StepConfirmation } from "./StepConfirmation";
import { LiveComparisonsBadge } from "./LiveComparisonsBadge";
import { useQuoteJourney } from "@/context/QuoteJourneyContext";

const ADVANCE_DELAY_MS = 320;

function getVisibleSteps(
  data: QuoteFormData,
  options: { skipBirthDate: boolean; skipPostalCode: boolean },
): FormStepId[] {
  return FORM_STEPS.filter((step) => {
    if (step === "insurer" && data.alreadyInsured !== "oui") return false;
    if (step === "birthDate" && options.skipBirthDate) return false;
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
  const {
    calculator,
    hasBirthDateFromCalculator,
    hasLocationFromCalculator,
    formFocusToken,
  } = useQuoteJourney();

  const skipBirthDate =
    hasBirthDateFromCalculator && isValidBirthDate(calculator.birthDate);
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
  const advanceLock = useRef(false);
  const timers = useRef<number[]>([]);
  const lastFocusToken = useRef(0);

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

  const goNext = useCallback(() => {
    if (advanceLock.current) return;
    advanceLock.current = true;
    setIsAdvancing(true);
    goNextFrom(step, data);
  }, [data, goNextFrom, step]);

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
    if (advanceLock.current) return;
    clearTimers();
    advanceLock.current = false;
    setIsAdvancing(false);

    const currentIndex = visibleSteps.indexOf(step);
    for (let index = currentIndex - 1; index >= 0; index -= 1) {
      const previous = visibleSteps[index];
      if (previous && previous !== "analyzing") {
        goTo(previous);
        return;
      }
    }
  }, [clearTimers, goTo, step, visibleSteps]);

  const handleAnalyzingDone = useCallback(() => {
    goTo("contact");
  }, [goTo]);

  const restart = useCallback(() => {
    clearTimers();
    advanceLock.current = false;
    setIsAdvancing(false);
    setData(
      applyCalculatorDefaults(initialFormData, calculator, {
        skipBirthDate,
        skipPostalCode,
      }),
    );
    setErrors({});
    setStep("careNeeds");
  }, [calculator, clearTimers, skipBirthDate, skipPostalCode]);

  // Jump past prefilled steps if we land on them.
  useEffect(() => {
    if (
      (skipBirthDate && step === "birthDate") ||
      (skipPostalCode && step === "postalCode")
    ) {
      goTo(findFirstNeededStep(data, stepOptions));
    }
  }, [data, goTo, skipBirthDate, skipPostalCode, step, stepOptions]);

  const showProgress = step !== "analyzing" && step !== "confirmation";

  return (
    <div
      id="formulaire-devis"
      className="form-glow-pulse rounded-[1.75rem] border-2 border-brand/40 bg-white p-5 sm:p-7 lg:p-8"
    >
      <div className="flex justify-center">
        <LiveComparisonsBadge />
      </div>

      <p className="mb-4 text-center font-manrope text-xl font-extrabold leading-snug tracking-tight text-[#3b0764] sm:mb-5 sm:text-2xl lg:text-[1.7rem]">
        VOTRE DEVIS EN{" "}
        <span className="bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#f472b6] bg-clip-text text-transparent">
          1&nbsp;MINUTE
        </span>{" "}
        <span aria-hidden="true">⏱️</span>
      </p>

      {showProgress ? (
        <ProgressBar current={progressCurrent} total={progressTotal} />
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
            onSelect={(coveredPersons: CoveredPersonId) =>
              patch({
                coveredPersons,
                spouseBirthDate: "",
              })
            }
            onSelectAndAdvance={(coveredPersons: CoveredPersonId) =>
              selectAndAdvance({
                coveredPersons,
                spouseBirthDate: "",
              })
            }
            onSpouseBirthDate={(spouseBirthDate) =>
              patch({ spouseBirthDate })
            }
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}

        {step === "birthDate" ? (
          <StepBirthDate
            data={data}
            errors={errors}
            disabled={isAdvancing}
            onChange={(birthDate) => patch({ birthDate })}
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}

        {step === "familyStatus" ? (
          <StepFamilyStatus
            data={data}
            errors={errors}
            disabled={isAdvancing}
            onSelectAndAdvance={(familyStatus) =>
              selectAndAdvance({ familyStatus })
            }
            onBack={goBack}
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
                insurer: alreadyInsured === "non" ? "" : data.insurer,
              })
            }
            onBack={goBack}
          />
        ) : null}

        {step === "insurer" ? (
          <StepInsurer
            data={data}
            errors={errors}
            disabled={isAdvancing}
            onSelectAndAdvance={(insurer) => selectAndAdvance({ insurer })}
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
            disabled={isAdvancing}
            onPatch={patch}
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}

        {step === "confirmation" ? (
          <StepConfirmation onRestart={restart} />
        ) : null}
      </div>
    </div>
  );
}
