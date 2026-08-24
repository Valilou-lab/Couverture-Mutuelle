"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  initialFormData,
  COVERED_PERSONS,
  type CoveredPersonId,
  type FormStepId,
  type QuoteFormData,
} from "./types";
import { validateStep, needsSpouseBirthDate, type FieldErrors } from "./validation";
import { ProgressBar } from "./ProgressBar";
import { StepCareNeeds } from "./StepCareNeeds";
import { StepCoveredPersons } from "./StepCoveredPersons";
import { StepBirthDate } from "./StepBirthDate";
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
import { readAcquisitionParams } from "@/lib/acquisition";
import { pushLeadCompletedToDataLayer } from "@/lib/gtm-consent";
import { scrollQuoteFormIntoView } from "./scrollQuoteFormIntoView";

const ADVANCE_DELAY_MS = 320;
const SUBMIT_ERROR_MESSAGE =
  "Une erreur est survenue lors de l’envoi de votre demande. Merci de réessayer.";

/** Steps for users coming from the savings calculator (postal already known). */
const SAVINGS_FORM_STEPS: FormStepId[] = [
  "careNeeds",
  "coveredPersons",
  "birthDate",
  "healthRegime",
  "alreadyInsured",
  "analyzing",
  "contact",
  "confirmation",
];

function getVisibleSteps(data: QuoteFormData): FormStepId[] {
  return SAVINGS_FORM_STEPS.filter((step) => {
    // Own DOB already collected in calculator — only keep this step for spouse DOB.
    if (step === "birthDate" && !needsSpouseBirthDate(data)) return false;
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
  const router = useRouter();
  const { calculator, savingsQuoteFocusToken } = useQuoteJourney();

  const [data, setData] = useState<QuoteFormData>(() =>
    withCalculatorDefaults(initialFormData, calculator),
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

      if (nextStep) {
        goTo(nextStep);
      }
      unlockLater();
    },
    [goTo, unlockLater],
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: data,
          meta: {
            landingPageUrl: window.location.href,
            referrer: document.referrer || "",
            acquisition: readAcquisitionParams(),
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
      if (advanceLock.current || isSubmitting) return;
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
    [data, goNextFrom, isSubmitting, step],
  );

  const goBack = useCallback(() => {
    if (advanceLock.current || isSubmitting) return;
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
  }, [clearTimers, goTo, isSubmitting, step, visibleSteps]);

  const handleAnalyzingDone = useCallback(() => {
    goTo("contact");
  }, [goTo]);

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
            hideOwnBirthDate
            onChangeBirthDate={(birthDate) => patch({ birthDate })}
            onChangeSpouseBirthDate={(spouseBirthDate) =>
              patch({ spouseBirthDate })
            }
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
