"use client";

import { QuoteForm } from "@/components/form/QuoteForm";
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

/**
 * Homepage (/) conversion form, senior layout. Same steps, validation,
 * Vertikl mapping and tracking as ConversionQuoteForm (/tiktok).
 */
export function SeniorQuoteForm() {
  return (
    <QuoteForm
      variant="senior"
      firstStep="currentMutualTariff"
      firstStepIntro="Votre devis en 1 minute"
      coveredPersonsTitle="Qui doit être assuré ?"
      accentQuestions
      funnel={SENIOR_FORM_FUNNEL}
    />
  );
}
