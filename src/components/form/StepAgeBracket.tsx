"use client";

import { AGE_BRACKETS, type AgeBracketId } from "./types";
import { OptionCard } from "./OptionCard";
import { SENIOR_QUESTION_TITLE, useSeniorForm } from "./seniorForm";

const DEFAULT_TITLE = "Quelle est votre tranche d’âge ?";

/** Radio-style circle, echoing the Meta ad A01 visual (46×34, currentColor). */
function RadioIcon({ selected }: { selected: boolean }) {
  return (
    <svg
      viewBox="0 0 46 34"
      className="h-[26px] w-[34px] min-[420px]:h-[30px] min-[420px]:w-[40px]"
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
  title?: string;
  onSelectAndAdvance: (id: AgeBracketId) => void;
};

/** First question of the /tranches-age landing (Meta ad A01). */
export function StepAgeBracket({
  value,
  disabled = false,
  title = DEFAULT_TITLE,
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
        {title}
      </h2>
      <div
        className="mt-4 grid grid-cols-2 gap-3"
        role="group"
        aria-label={title}
      >
        {AGE_BRACKETS.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={<RadioIcon selected={value === item.id} />}
            seniorAlign="left"
            surface="light"
            selected={value === item.id}
            disabled={disabled}
            className={
              senior
                ? "min-h-20! grid-cols-[34px_1fr]! gap-1.5! px-2.5! text-[1.02rem]! min-[420px]:grid-cols-[40px_1fr]! min-[420px]:px-3.5! min-[420px]:text-[1.3rem]!"
                : undefined
            }
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
