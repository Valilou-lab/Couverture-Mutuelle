"use client";

import {
  PROFESSIONAL_STATUSES,
  type ProfessionalStatusId,
  type QuoteFormData,
} from "@/components/form/types";
import { OptionCard } from "@/components/form/OptionCard";
import type { FieldErrors } from "@/components/form/validation";
import { seniorStatusIcon } from "@/components/form/SeniorChoiceIcons";
import {
  SENIOR_ERROR,
  SENIOR_QUESTION_TITLE,
} from "@/components/form/seniorForm";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: ProfessionalStatusId) => void;
};

/**
 * V2 `/devis` profession step — compact help note, same options as Main senior.
 */
export function StepProfessionalStatusV2({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
}: Props) {
  return (
    <div className="grid gap-4">
      <aside
        className="flex items-start gap-2.5 rounded-xl border border-slate-200/90 bg-[#f1f5f9] px-3 py-2 text-left sm:px-3.5 sm:py-2.5"
        aria-label="Information utile"
      >
        <span
          className="mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full bg-slate-300/70 text-[0.65rem] font-bold leading-none text-slate-600"
          aria-hidden
        >
          i
        </span>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold leading-snug text-slate-700 sm:text-sm">
            Information utile
          </p>
          <p className="mt-0.5 text-[0.75rem] leading-snug text-slate-500 sm:text-[0.8125rem]">
            Votre profession nous aide à vous proposer des offres plus adaptées.
          </p>
        </div>
      </aside>

      <h2 className={SENIOR_QUESTION_TITLE}>Quelle est votre profession ?</h2>

      <div
        className="grid gap-3"
        role="group"
        aria-label="Quelle est votre profession ?"
      >
        {PROFESSIONAL_STATUSES.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={seniorStatusIcon(item.id)}
            seniorAlign="center"
            selected={data.professionalStatus === item.id}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>

      {errors.professionalStatus ? (
        <p className={SENIOR_ERROR} role="alert">
          {errors.professionalStatus}
        </p>
      ) : null}
    </div>
  );
}
