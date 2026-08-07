"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  initialFormData,
  type CoveredPersonId,
  type FormStepId,
  type QuoteFormData,
} from "./types";
import { validateStep, type FieldErrors } from "./validation";
import { ProgressBar } from "./ProgressBar";
import { StepCareNeeds } from "./StepCareNeeds";
import { StepCoveredPersons } from "./StepCoveredPersons";
import { StepFamilyStatus } from "./StepFamilyStatus";
import { StepHealthRegime } from "./StepHealthRegime";
import { StepAlreadyInsured } from "./StepAlreadyInsured";
import { StepInsurer } from "./StepInsurer";
import { StepAnalyzing } from "./StepAnalyzing";
import { StepContact } from "./StepContact";
import { StepConfirmation } from "./StepConfirmation";
import { FormMascotGuide } from "./FormMascotGuide";
import {
  getFormProgressPercent,
  randomOffersCount,
} from "./mascotGuideConfig";
import { useQuoteJourney } from "@/context/QuoteJourneyContext";
import { buildCompleteSavingsLead } from "@/lib/savings-lead";
import { scrollQuoteFormIntoView } from "./scrollQuoteFormIntoView";

const ADVANCE_DELAY_MS = 320;

/** Steps for users coming from the savings calculator (no DOB / postal). */
const SAVINGS_FORM_STEPS: FormStepId[] = [
  "careNeeds",
  "coveredPersons",
  "familyStatus",
  "healthRegime",
  "alreadyInsured",
  "insurer",
  "analyzing",
  "contact",
  "confirmation",
];

function getVisibleSteps(data: QuoteFormData): FormStepId[] {
  return SAVINGS_FORM_STEPS.filter((step) => {
    if (step === "insurer" && data.alreadyInsured !== "oui") return false;
    return true;
  });
}

function findFirstNeededStep(data: QuoteFormData): FormStepId {
  const steps = getVisibleSteps(data);
  for (const stepId of steps) {
    if (stepId === "analyzing" || stepId === "confirmation") continue;
    const errors = validateStep(stepId, data);
    if (Object.keys(errors).length > 0) {
      return stepId;
    }
  }
  return steps.includes("contact") ? "contact" : "careNeeds";
}

function withCalculatorDefaults(
  base: QuoteFormData,
  calculator: {
    birthDate: string;
    postalCode: string;
    city: string;
  },
): QuoteFormData {
  return {
    ...base,
    birthDate: calculator.birthDate,
    postalCode: calculator.postalCode,
    city: calculator.city,
    citiesOptions: calculator.city ? [calculator.city] : [],
  };
}

export function SavingsQuoteForm() {
  const {
    calculator,
    estimate,
    calculatorLeadFields,
    savingsQuoteFocusToken,
    setCompleteSavingsLead,
  } = useQuoteJourney();

  const [data, setData] = useState<QuoteFormData>(() =>
    withCalculatorDefaults(initialFormData, calculator),
  );
  const [step, setStep] = useState<FormStepId>("careNeeds");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [offersCount, setOffersCount] = useState<number | null>(null);
  const advanceLock = useRef(false);
  const timers = useRef<number[]>([]);
  const lastFocusToken = useRef(0);
  const formRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData((current) => withCalculatorDefaults(current, calculator));
  }, [calculator.birthDate, calculator.city, calculator.postalCode]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const visibleSteps = useMemo(() => getVisibleSteps(data), [data]);
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

  const goTo = useCallback((next: FormStepId) => {
    setErrors({});
    setStep(next);
    scrollQuoteFormIntoView(formRootRef.current);
  }, []);

  useEffect(() => {
    if (
      savingsQuoteFocusToken === 0 ||
      savingsQuoteFocusToken === lastFocusToken.current
    ) {
      return;
    }
    lastFocusToken.current = savingsQuoteFocusToken;

    setData((current) => {
      const nextData = withCalculatorDefaults(current, calculator);
      setErrors({});
      setStep(findFirstNeededStep(nextData));
      scrollQuoteFormIntoView(formRootRef.current);
      return nextData;
    });
  }, [calculator, savingsQuoteFocusToken]);

  const unlockLater = useCallback(() => {
    const id = window.setTimeout(() => {
      advanceLock.current = false;
      setIsAdvancing(false);
    }, ADVANCE_DELAY_MS);
    timers.current.push(id);
  }, []);

  const finalizeLead = useCallback(
    (formData: QuoteFormData) => {
      const lead = buildCompleteSavingsLead({
        calculatorLead: calculatorLeadFields,
        estimate,
        form: formData,
      });
      setCompleteSavingsLead(lead);
    },
    [calculatorLeadFields, estimate, setCompleteSavingsLead],
  );

  const goNextFrom = useCallback(
    (currentStep: FormStepId, nextData: QuoteFormData) => {
      const validation = validateStep(currentStep, nextData);
      if (Object.keys(validation).length > 0) {
        setErrors(validation);
        advanceLock.current = false;
        setIsAdvancing(false);
        return;
      }

      const steps = getVisibleSteps(nextData);
      const currentIndex = steps.indexOf(currentStep);
      const nextStep = steps[currentIndex + 1];

      if (currentStep === "contact") {
        finalizeLead(nextData);
      }

      if (nextStep) {
        goTo(nextStep);
      }
      unlockLater();
    },
    [finalizeLead, goTo, unlockLater],
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
    setCompleteSavingsLead(null);
    setData(withCalculatorDefaults(initialFormData, calculator));
    setErrors({});
    setStep("careNeeds");
  }, [calculator, clearTimers, setCompleteSavingsLead]);

  const showProgress = step !== "analyzing" && step !== "confirmation";
  const showMascotGuide =
    step !== "analyzing" && step !== "confirmation" && step !== "contact";

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

  return (
    <div
      ref={formRootRef}
      id="formulaire-devis-economies"
      className="form-glow-pulse relative z-10 scroll-mt-28 overflow-visible rounded-[1.75rem] border-2 border-brand/40 bg-white p-5 pb-2 sm:p-7 sm:pb-3 lg:p-8 lg:pb-4"
    >
      <p className="mb-4 text-center font-manrope text-base font-bold leading-snug text-brand sm:mb-5 sm:text-lg">
        Complétez pour recevoir vos devis personnalisés{" "}
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
            offersCount={offersCount}
            onPatch={patch}
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}

        {step === "confirmation" ? (
          <StepConfirmation onRestart={restart} />
        ) : null}
      </div>

      {showMascotGuide ? (
        <FormMascotGuide
          step={step}
          offersCount={step === "contact" ? offersCount : null}
        />
      ) : null}
    </div>
  );
}
