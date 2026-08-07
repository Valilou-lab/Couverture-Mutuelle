"use client";

import {
  COVERED_PERSONS,
  type CoveredPersonId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: CoveredPersonId) => void;
  onBack: () => void;
};

export function StepCoveredPersons({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
  onBack,
}: Props) {
  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Qui souhaitez-vous assurer&nbsp;?
      </h2>
      <div className="mt-5 grid gap-2.5">
        {COVERED_PERSONS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            selected={data.coveredPersons === item.id}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
      {errors.coveredPersons ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.coveredPersons}
        </p>
      ) : null}

      <FormNavigation onBack={onBack} showNext={false} disabled={disabled} />
    </div>
  );
}
