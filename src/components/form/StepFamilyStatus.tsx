"use client";

import {
  FAMILY_STATUSES,
  type FamilyStatusId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: FamilyStatusId) => void;
  onBack: () => void;
};

export function StepFamilyStatus({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
  onBack,
}: Props) {
  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Situation familiale
      </h2>
      <p className="mt-2 text-center text-sm text-zinc-600 sm:text-base">
        Cela nous aide à affiner les offres adaptées.
      </p>
      <div className="mt-5 grid gap-2.5">
        {FAMILY_STATUSES.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            selected={data.familyStatus === item.id}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
      {errors.familyStatus ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.familyStatus}
        </p>
      ) : null}
      <FormNavigation onBack={onBack} showNext={false} disabled={disabled} />
    </div>
  );
}
