"use client";

import {
  COVERED_PERSONS,
  type CoveredPersonId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import {
  formatBirthDateInput,
  needsSpouseBirthDate,
  type FieldErrors,
} from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelect: (id: CoveredPersonId) => void;
  onSelectAndAdvance: (id: CoveredPersonId) => void;
  onSpouseBirthDate: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepCoveredPersons({
  data,
  errors,
  disabled = false,
  onSelect,
  onSelectAndAdvance,
  onSpouseBirthDate,
  onBack,
  onNext,
}: Props) {
  const showSpouseDob = needsSpouseBirthDate(data);

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Qui souhaitez-vous assurer&nbsp;?
      </h2>
      <div className="mt-5 grid gap-2.5">
        {COVERED_PERSONS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            selected={data.coveredPersons === item.id}
            disabled={disabled}
            onClick={() => {
              if (item.needsSpouseDob) {
                onSelect(item.id);
              } else {
                onSelectAndAdvance(item.id);
              }
            }}
          />
        ))}
      </div>
      {errors.coveredPersons ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.coveredPersons}
        </p>
      ) : null}

      {showSpouseDob ? (
        <div className="mt-5">
          <label
            htmlFor="spouseBirthDate"
            className="block text-sm font-medium text-foreground"
          >
            Date de naissance de votre conjoint
          </label>
          <input
            id="spouseBirthDate"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="JJ/MM/AAAA"
            value={data.spouseBirthDate}
            disabled={disabled}
            onChange={(event) =>
              onSpouseBirthDate(formatBirthDateInput(event.target.value))
            }
            className="mt-2 min-h-14 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:ring-2"
          />
          {errors.spouseBirthDate ? (
            <p className="mt-2 text-sm text-error" role="alert">
              {errors.spouseBirthDate}
            </p>
          ) : null}
          <FormNavigation onBack={onBack} onNext={onNext} disabled={disabled} />
        </div>
      ) : (
        <FormNavigation
          onBack={onBack}
          showNext={false}
          disabled={disabled}
        />
      )}
    </div>
  );
}
