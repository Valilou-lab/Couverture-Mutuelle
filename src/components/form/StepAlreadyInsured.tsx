"use client";

import type { QuoteFormData } from "./types";
import { OptionCard } from "./OptionCard";
import type { FieldErrors } from "./validation";

/** Kept even when hidden — gated by SHOW_ALREADY_INSURED_STEP in formConfig.ts. */
type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (value: "oui" | "non") => void;
};

export function StepAlreadyInsured({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
}: Props) {
  return (
    <div>
      <h2 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Êtes-vous déjà assuré(e) ?
      </h2>
      <p className="mt-2 text-center text-sm text-zinc-600 sm:text-base">
        Même si vous avez déjà une mutuelle, vous pouvez comparer.
      </p>
      <div className="mt-5 grid gap-2.5">
        <OptionCard
          label="Oui"
          surface="light"
          selected={data.alreadyInsured === "oui"}
          disabled={disabled}
          onClick={() => onSelectAndAdvance("oui")}
        />
        <OptionCard
          label="Non"
          surface="light"
          selected={data.alreadyInsured === "non"}
          disabled={disabled}
          onClick={() => onSelectAndAdvance("non")}
        />
      </div>
      {errors.alreadyInsured ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.alreadyInsured}
        </p>
      ) : null}
    </div>
  );
}
