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

type SeniorQuoteFormProps = {
  /** /tranches-age: ask the age bracket first (local state only). */
  askAgeBracket?: boolean;
  firstStepIntro?: string;
};

/**
 * Homepage (/) conversion form, senior layout. Same steps, validation,
 * Vertikl mapping and tracking as ConversionQuoteForm (/tiktok).
 * Also used by /tranches-age with `askAgeBracket`.
 */
export function SeniorQuoteForm({
  askAgeBracket = false,
  firstStepIntro = "Votre devis en 1 minute",
}: SeniorQuoteFormProps = {}) {
  return (
    <QuoteForm
      variant="senior"
      firstStep="currentMutualTariff"
      firstStepIntro={firstStepIntro}
      askAgeBracket={askAgeBracket}
      coveredPersonsTitle="Qui doit être assuré ?"
      accentQuestions
      funnel={SENIOR_FORM_FUNNEL}
    />
  );
}
