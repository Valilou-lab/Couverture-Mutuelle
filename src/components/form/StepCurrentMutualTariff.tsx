"use client";

import {
  HEALTH_INSURANCE_GOALS,
  type HealthInsuranceGoalId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { goalChoiceIcon } from "./GoalChoiceIcons";
import type { FieldErrors } from "./validation";

const PRIMARY_GOALS = HEALTH_INSURANCE_GOALS.filter(
  (item) => item.id !== "unknown",
);
const UNKNOWN_GOAL = HEALTH_INSURANCE_GOALS.find(
  (item) => item.id === "unknown",
)!;

const PRIMARY_LABEL_CLASS =
  "w-full max-w-full text-balance text-center text-[0.9375rem] font-semibold leading-snug text-[#3b0764] sm:text-base";

const UNKNOWN_LABEL_CLASS =
  "min-w-0 text-pretty text-[0.9375rem] font-semibold leading-snug text-[#3b0764] sm:text-base";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: HealthInsuranceGoalId) => void;
};

export function StepCurrentMutualTariff({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
}: Props) {
  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-[1.45rem]">
        Qu’aimeriez-vous améliorer avec votre mutuelle&nbsp;?
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 lg:mt-4 lg:gap-3">
        {PRIMARY_GOALS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={goalChoiceIcon(item.id)}
            layout="stack"
            surface="light"
            selected={data.healthInsuranceGoal === item.id}
            disabled={disabled}
            className="min-h-[5rem] px-2 sm:min-h-[5.15rem] sm:px-3 lg:min-h-[5.25rem]"
            labelClassName={PRIMARY_LABEL_CLASS}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>

      <div className="mt-2.5 sm:mt-3">
        <OptionCard
          label={UNKNOWN_GOAL.label}
          icon={goalChoiceIcon(UNKNOWN_GOAL.id)}
          layout="row"
          surface="light"
          selected={data.healthInsuranceGoal === UNKNOWN_GOAL.id}
          disabled={disabled}
          className="min-h-14 sm:min-h-[3.75rem] lg:min-h-[4.35rem]"
          labelClassName={UNKNOWN_LABEL_CLASS}
          onClick={() => onSelectAndAdvance(UNKNOWN_GOAL.id)}
        />
      </div>

      {errors.healthInsuranceGoal ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.healthInsuranceGoal}
        </p>
      ) : null}
    </div>
  );
}
