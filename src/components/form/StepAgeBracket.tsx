"use client";

import { AGE_BRACKETS, type AgeBracketId } from "./types";
import { OptionCard } from "./OptionCard";
import { SENIOR_QUESTION_TITLE, useSeniorForm } from "./seniorForm";

const TITLE = "Quelle est votre tranche d’âge ?";

/** Radio-style circle, echoing the Meta ad A01 visual (46×34, currentColor). */
function RadioIcon({ selected }: { selected: boolean }) {
  return (
    <svg
      viewBox="0 0 46 34"
      className="h-[34px] w-[46px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <circle cx="23" cy="17" r="11" />
      {selected ? <circle cx="23" cy="17" r="5.5" fill="currentColor" /> : null}
    </svg>
  );
}

type Props = {
  value: AgeBracketId | "";
  disabled?: boolean;
  onSelectAndAdvance: (id: AgeBracketId) => void;
};

/** First question of the /tranches-age landing (Meta ad A01). */
export function StepAgeBracket({
  value,
  disabled = false,
  onSelectAndAdvance,
}: Props) {
  const senior = useSeniorForm();

  return (
    <div>
      <h2
        className={
          senior
            ? SENIOR_QUESTION_TITLE
            : "text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        }
      >
        Quelle est votre tranche d’âge&nbsp;?
      </h2>
      <div className="mt-4 grid gap-3" role="group" aria-label={TITLE}>
        {AGE_BRACKETS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={<RadioIcon selected={value === item.id} />}
            seniorAlign="center"
            surface="light"
            selected={value === item.id}
            disabled={disabled}
            className={senior ? "min-h-20! text-[1.35rem]!" : undefined}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
