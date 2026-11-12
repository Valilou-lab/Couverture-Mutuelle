"use client";

import { CARE_NEEDS, type CareNeedId, type QuoteFormData } from "./types";
import { CARE_NEED_ICONS } from "./CareNeedIcons";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";
import {
  SENIOR_ERROR,
  useQuestionTitleClass,
  useSeniorForm,
} from "./seniorForm";

/** `/reste-a-charge` display order — ids unchanged for Vertikl. */
const RAC_CARE_NEED_ORDER: CareNeedId[] = [
  "dentaire",
  "optique",
  "audition",
  "hospitalisation",
  "soins-courants",
  "medecines-douces",
];

/** Kept even when hidden — gated by SHOW_CARE_PRIORITIES_STEP in formConfig.ts. */

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  title?: string;
  hint?: string;
  /** When true, Dentaire / Optique / Audition first (ad order). */
  racOrder?: boolean;
  onChange: (careNeeds: CareNeedId[]) => void;
  onNext: () => void;
};

export function StepCareNeeds({
  data,
  errors,
  disabled = false,
  title = "Que souhaitez-vous couvrir en priorité\u00a0?",
  hint = "(multi-choix possible)",
  racOrder = false,
  onChange,
  onNext,
}: Props) {
  const senior = useSeniorForm();
  const questionTitleClass = useQuestionTitleClass();

  function toggle(id: CareNeedId) {
    if (disabled) return;
    if (id === "je-ne-sais-pas") {
      // Exclusive: checking it clears Hospitalisation / Dentaire / etc.
      onChange(data.careNeeds.includes(id) ? [] : ["je-ne-sais-pas"]);
      return;
    }

    const withoutUnknown = data.careNeeds.filter(
      (item) => item !== "je-ne-sais-pas",
    );
    const next = withoutUnknown.includes(id)
      ? withoutUnknown.filter((item) => item !== id)
      : [...withoutUnknown, id];
    onChange(next);
  }

  const mainNeeds = racOrder
    ? RAC_CARE_NEED_ORDER.map(
        (id) => CARE_NEEDS.find((item) => item.id === id)!,
      )
    : CARE_NEEDS.filter((item) => item.id !== "je-ne-sais-pas");
  const unknownNeed = CARE_NEEDS.find((item) => item.id === "je-ne-sais-pas");

  return (
    <div>
      <h2
        className={
          senior
            ? questionTitleClass
            : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        }
      >
        {title}
      </h2>
      <p
        className={
          senior
            ? "mt-0.5 text-center text-sm text-zinc-500 sm:mt-2 sm:text-base"
            : "mt-0.5 text-center text-sm text-zinc-600 sm:mt-2 sm:text-base"
        }
      >
        {hint}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
          {mainNeeds.map((item) => (
            <OptionCard
              key={item.id}
              label={item.label}
              icon={
                <span className="block h-8 w-8">{CARE_NEED_ICONS[item.id]}</span>
              }
              layout="stack"
              surface="light"
              selected={data.careNeeds.includes(item.id)}
              disabled={disabled}
              showCheckbox
              onClick={() => toggle(item.id)}
            />
          ))}
          {unknownNeed ? (
            <div className="col-span-2">
              <OptionCard
                label={unknownNeed.label}
                icon={
                  <span className="block h-8 w-8">
                    {CARE_NEED_ICONS[unknownNeed.id]}
                  </span>
                }
                layout="row"
                surface="light"
                selected={data.careNeeds.includes(unknownNeed.id)}
                disabled={disabled}
                showCheckbox
                onClick={() => toggle(unknownNeed.id)}
              />
            </div>
          ) : null}
      </div>
      {errors.careNeeds ? (
        <p className={senior ? SENIOR_ERROR : "mt-3 text-sm text-error"} role="alert">
          {errors.careNeeds}
        </p>
      ) : null}
      <FormNavigation
        onNext={onNext}
        disabled={disabled}
        canContinue={data.careNeeds.length > 0}
      />
    </div>
  );
}
