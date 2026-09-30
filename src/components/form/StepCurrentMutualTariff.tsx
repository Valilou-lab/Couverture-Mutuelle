"use client";

import {
  CURRENT_MUTUAL_TARIFFS,
  type CurrentMutualTariffId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { tariffChoiceIcon } from "./TariffChoiceIcons";
import type { FieldErrors } from "./validation";

const RANGE_TARIFFS = CURRENT_MUTUAL_TARIFFS.filter(
  (item) => item.id !== "unknown" && item.id !== "no_insurance",
);
const OTHER_TARIFFS = CURRENT_MUTUAL_TARIFFS.filter(
  (item) => item.id === "unknown" || item.id === "no_insurance",
);

const RANGE_LABEL_CLASS =
  "w-full max-w-full text-balance text-center text-[0.9375rem] font-semibold leading-snug text-[#3b0764] sm:text-base";

const OTHER_LABEL_CLASS =
  "min-w-0 text-pretty text-[0.9375rem] font-semibold leading-snug text-[#3b0764] sm:text-base";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: CurrentMutualTariffId) => void;
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
        Quel est le tarif de votre mutuelle actuelle&nbsp;?
      </h2>
      <p className="mt-2 text-center text-sm text-zinc-600 sm:text-base">
        Par mois et par personne
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 lg:mt-4 lg:gap-3">
        {RANGE_TARIFFS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={tariffChoiceIcon(item.id)}
            layout="stack"
            surface="light"
            selected={data.currentMutualTariff === item.id}
            disabled={disabled}
            className="min-h-[5rem] px-2 sm:min-h-[5.15rem] sm:px-3 lg:min-h-[5.25rem]"
            labelClassName={RANGE_LABEL_CLASS}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>

      <div className="mt-4 sm:mt-5">
        <div
          className="mb-2.5 flex items-center gap-3 lg:hidden"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-brand/20" />
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            ou
          </span>
          <span className="h-px flex-1 bg-brand/20" />
        </div>
        <div className="grid gap-2.5 sm:gap-3 lg:mt-3">
          {OTHER_TARIFFS.map((item) => (
            <OptionCard
              key={item.id}
              label={item.label}
              icon={tariffChoiceIcon(item.id)}
              layout="row"
              surface="light"
              selected={data.currentMutualTariff === item.id}
              disabled={disabled}
              className="min-h-14 sm:min-h-[3.75rem] lg:min-h-[4.35rem]"
              labelClassName={OTHER_LABEL_CLASS}
              onClick={() => onSelectAndAdvance(item.id)}
            />
          ))}
        </div>
      </div>

      {errors.currentMutualTariff ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.currentMutualTariff}
        </p>
      ) : null}
    </div>
  );
}
