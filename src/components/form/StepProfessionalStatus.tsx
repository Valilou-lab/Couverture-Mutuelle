"use client";

import {
  PROFESSIONAL_STATUSES,
  type ProfessionalStatusId,
  type QuoteFormData,
} from "./types";
import { OptionCard } from "./OptionCard";
import { professionalStatusIcon } from "./ProfessionalStatusIcons";
import type { FieldErrors } from "./validation";
import { seniorStatusIcon } from "./SeniorChoiceIcons";
import {
  SENIOR_ERROR,
  SENIOR_INFO,
  SENIOR_QUESTION_TITLE,
  useSeniorForm,
} from "./seniorForm";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (id: ProfessionalStatusId) => void;
};

export function StepProfessionalStatus({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
}: Props) {
  const senior = useSeniorForm();

  if (senior) {
    return (
      <div className="grid gap-4">
        <div className={SENIOR_INFO}>
          <p className="font-semibold text-[#3b0764]">
            Votre profession nous aide à trouver la meilleure mutuelle.
          </p>
          <p className="mt-1 text-[0.95rem] text-zinc-600">
            Les garanties et tarifs varient selon votre statut professionnel.
          </p>
        </div>
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

  return (
    <div>
      <div className="rounded-2xl border border-brand/20 bg-brand-soft/80 px-4 py-3 text-center sm:px-5 sm:py-3.5">
        <p className="text-sm font-semibold leading-snug text-[#3b0764] sm:text-[0.9375rem]">
          Votre profession nous aide à trouver la meilleure mutuelle.
        </p>
        <p className="mt-1 text-xs leading-snug text-zinc-600 sm:text-sm">
          Les garanties et tarifs varient selon votre statut professionnel.
        </p>
      </div>

      <h2 className="mt-5 text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Quelle est votre profession ?
      </h2>

      <div className="mt-5 grid gap-2.5">
        {PROFESSIONAL_STATUSES.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            icon={professionalStatusIcon(item.id)}
            surface="light"
            selected={data.professionalStatus === item.id}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(item.id)}
          />
        ))}
      </div>
      {errors.professionalStatus ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.professionalStatus}
        </p>
      ) : null}
    </div>
  );
}
