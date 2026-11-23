"use client";

import type { FormStepId } from "@/components/form/types";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";

type ConversionQuoteFormProps = {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
};

/**
 * Conversion LP form — same V2 Vertikl path as `/devis` via SeniorQuoteForm.
 */
export function ConversionQuoteForm({
  onStepChange,
}: ConversionQuoteFormProps = {}) {
  return (
    <SeniorQuoteForm
      redesignIntro
      splitContact
      onStepChange={onStepChange}
    />
  );
}
