"use client";

import type { QuoteFormData } from "./types";
import { OptionCard } from "./OptionCard";
import type { FieldErrors } from "./validation";
import { seniorCoveredIcon } from "./SeniorChoiceIcons";
import {
  SENIOR_ERROR,
  useQuestionTitleClass,
  useRedesignForm,
  useSeniorForm,
} from "./seniorForm";

const QUESTION = "Êtes-vous couvert(e) par une mutuelle ?";
const OPTIONS = [
  { id: "oui" as const, label: "Oui", redesignLabel: "OUI" },
  { id: "non" as const, label: "Non", redesignLabel: "NON" },
];

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (value: "oui" | "non") => void;
};

/**
 * First question on every LP form.
 * Step id stays `currentMutualTariff` (progress, GTM step_1, mascot).
 * The answer is `alreadyInsured` → Vertikl `currently_insured`.
 */
export function StepCurrentMutualTariff({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
}: Props) {
  const senior = useSeniorForm();
  const redesign = useRedesignForm();
  const questionTitleClass = useQuestionTitleClass();

  const titleClass = senior
    ? questionTitleClass
    : redesign
      ? "text-center text-xl font-normal tracking-tight text-black sm:text-2xl lg:text-[1.45rem]"
      : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-[1.45rem]";

  return (
    <div>
      <h2 className={titleClass}>{QUESTION}</h2>
      <div className="mt-4 grid gap-3" role="group" aria-label={QUESTION}>
        {OPTIONS.map((item) => (
          <OptionCard
            key={item.id}
            label={redesign ? item.redesignLabel : item.label}
            icon={senior && !redesign ? seniorCoveredIcon(item.id) : undefined}
            selected={data.alreadyInsured === item.id}
            disabled={disabled}
            seniorAlign={redesign ? "center" : "left"}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
      {errors.alreadyInsured ? (
        <p
          className={senior ? SENIOR_ERROR : "mt-3 text-sm text-error"}
          role="alert"
        >
          {errors.alreadyInsured}
        </p>
      ) : null}
    </div>
  );
}
