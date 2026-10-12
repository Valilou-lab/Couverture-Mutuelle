"use client";

import {
  COVERED_PERSONS,
  type CoveredPersonId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { householdChoiceIcon } from "./HouseholdChoiceIcons";
import type { FieldErrors } from "./validation";
import { seniorHouseholdIcon } from "./SeniorChoiceIcons";
import { SENIOR_ERROR, SENIOR_QUESTION_TITLE, useSeniorForm } from "./seniorForm";

/** Senior layout lists couples before children (same ids and Vertikl mapping). */
const SENIOR_ORDER: CoveredPersonId[] = [
  "moi",
  "moi-conjoint",
  "moi-enfants",
  "moi-conjoint-enfants",
];

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  title?: string;
  onSelectAndAdvance: (id: CoveredPersonId) => void;
};

export function StepCoveredPersons({
  data,
  errors,
  disabled = false,
  title = "Qui doit-être assuré\u00a0?",
  onSelectAndAdvance,
}: Props) {
  const senior = useSeniorForm();

  if (senior) {
    return (
      <div>
        <h2 className={SENIOR_QUESTION_TITLE}>{title}</h2>
        <div className="mt-4 grid gap-3" role="group" aria-label={title}>
          {SENIOR_ORDER.map((id) => {
            const item = COVERED_PERSONS.find((person) => person.id === id)!;
            return (
              <OptionCard
                key={item.id}
                label={item.label}
                icon={seniorHouseholdIcon(item.id)}
                selected={data.coveredPersons === item.id}
                disabled={disabled}
                onClick={() => onSelectAndAdvance(item.id)}
              />
            );
          })}
        </div>
        {errors.coveredPersons ? (
          <p className={SENIOR_ERROR} role="alert">
            {errors.coveredPersons}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="mt-5 grid gap-2.5 sm:gap-3">
        {COVERED_PERSONS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={householdChoiceIcon(item.id)}
            layout="row"
            surface="light"
            iconClassName="inline-flex h-8 w-auto shrink-0 items-center justify-center sm:h-9"
            selected={data.coveredPersons === item.id}
            disabled={disabled}
            className="min-h-14 px-4 sm:min-h-[3.75rem] lg:min-h-[4.35rem]"
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
      {errors.coveredPersons ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.coveredPersons}
        </p>
      ) : null}
    </div>
  );
}
