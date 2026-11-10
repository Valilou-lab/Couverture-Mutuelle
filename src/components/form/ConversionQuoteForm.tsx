"use client";

import { QuoteForm } from "@/components/form/QuoteForm";
import type { FormStepId } from "@/components/form/types";
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

type ConversionQuoteFormProps = {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
};

/**
 * Conversion form for /tiktok (PrimaryLanding).
 * Redesign accents without intro-bar copy.
 */
export function ConversionQuoteForm({
  onStepChange,
}: ConversionQuoteFormProps = {}) {
  return (
    <QuoteForm
      firstStep="currentMutualTariff"
      firstStepIntro=""
      introBarStyle="brand"
      careNeedsTitle="Qu’est-ce qui compte le plus pour vous dans votre mutuelle ?"
      coveredPersonsTitle="Qui doit-être assuré ?"
      accentQuestions
      funnel={CONVERSION_FORM_FUNNEL}
      onStepChange={onStepChange}
    />
  );
}
