"use client";

import {
  HEALTH_REGIMES,
  type HealthRegimeId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: HealthRegimeId) => void;
  onBack: () => void;
};

export function StepHealthRegime({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
  onBack,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quel est votre régime de santé ?
      </h2>
      <p className="mt-2 text-sm text-zinc-600 sm:text-base">
        Votre régime influence les remboursements de base.
      </p>
      <div className="mt-5 grid gap-2.5">
        {HEALTH_REGIMES.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            selected={data.healthRegime === item.id}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
      {errors.healthRegime ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.healthRegime}
        </p>
      ) : null}
      <FormNavigation onBack={onBack} showNext={false} disabled={disabled} />
    </div>
  );
}
