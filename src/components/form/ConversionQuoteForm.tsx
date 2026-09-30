"use client";

import { QuoteForm } from "@/components/form/QuoteForm";
import {
  trackTikTokFormStart,
  trackTikTokFormStepCompleted,
  trackTikTokSubmitForm,
} from "@/lib/tiktok-funnel";

const CONVERSION_FORM_FUNNEL = {
  onInteract: trackTikTokFormStart,
  onStepCompleted: trackTikTokFormStepCompleted,
  onSubmitSuccess: trackTikTokSubmitForm,
} as const;

/**
 * Single conversion form for / and /tiktok, all breakpoints.
 * Layout is handled by the parent; steps, validation and Vertikl mapping stay here.
 */
export function ConversionQuoteForm() {
  return (
    <QuoteForm
      firstStep="currentMutualTariff"
      firstStepIntro="Votre devis en 1 minute"
      careNeedsTitle="Qu’est-ce qui compte le plus pour vous dans votre mutuelle ?"
      coveredPersonsTitle="Qui doit-être assuré ?"
      accentQuestions
      funnel={CONVERSION_FORM_FUNNEL}
    />
  );
}
