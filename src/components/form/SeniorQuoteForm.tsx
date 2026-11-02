"use client";

import { QuoteForm } from "@/components/form/QuoteForm";
import type { FormStepId } from "@/components/form/types";
import type { ConsentVariantId } from "@/lib/consent";
import {
  trackTikTokFormStart,
  trackTikTokFormStepCompleted,
  trackTikTokSubmitForm,
} from "@/lib/tiktok-funnel";

const SENIOR_FORM_FUNNEL = {
  onInteract: trackTikTokFormStart,
  onStepCompleted: trackTikTokFormStepCompleted,
  onSubmitSuccess: trackTikTokSubmitForm,
} as const;

type SeniorQuoteFormProps = {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
  /** Defaults to `"senior"`. Pass `"iki"` on the IKI LP for dual opt-ins. */
  consentVariant?: Extract<ConsentVariantId, "senior" | "iki">;
};

/**
 * Homepage (/) conversion form, senior layout. Same steps, validation,
 * Vertikl mapping and tracking as ConversionQuoteForm (/tiktok).
 */
export function SeniorQuoteForm({
  onStepChange,
  consentVariant = "senior",
}: SeniorQuoteFormProps = {}) {
  return (
    <QuoteForm
      variant="senior"
      firstStep="currentMutualTariff"
      firstStepIntro="Votre devis en 1 minute"
      coveredPersonsTitle="Qui doit être assuré ?"
      accentQuestions
      funnel={SENIOR_FORM_FUNNEL}
      onStepChange={onStepChange}
      consentVariant={consentVariant}
    />
  );
}
