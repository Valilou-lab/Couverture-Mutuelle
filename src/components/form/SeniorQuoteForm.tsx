"use client";

import type { ReactNode } from "react";
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

const DEFAULT_INTRO = "Votre devis en 1 minute";

type SeniorQuoteFormProps = {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
  /** Defaults to `"senior"`. Pass `"iki"` on the IKI LP for dual opt-ins. */
  consentVariant?: Extract<ConsentVariantId, "senior" | "iki">;
  /**
   * Main LP (/) redesign only. Other LPs keep the default soft intro.
   * When true: no intro-bar copy (cleaner header) + dark purple accents.
   */
  redesignIntro?: boolean;
  firstStepIntro?: ReactNode;
};

/**
 * Senior layout form. Same steps, validation, Vertikl mapping and tracking
 * as ConversionQuoteForm (/tiktok). Redesign intro is opt-in (main LP only).
 */
export function SeniorQuoteForm({
  onStepChange,
  consentVariant = "senior",
  redesignIntro = false,
  firstStepIntro,
}: SeniorQuoteFormProps = {}) {
  const intro =
    firstStepIntro !== undefined
      ? firstStepIntro
      : consentVariant === "iki" || redesignIntro
        ? ""
        : DEFAULT_INTRO;

  return (
    <QuoteForm
      variant="senior"
      firstStep="currentMutualTariff"
      firstStepIntro={intro}
      introBarStyle={redesignIntro ? "brand" : "soft"}
      coveredPersonsTitle="Qui doit être assuré ?"
      accentQuestions
      funnel={SENIOR_FORM_FUNNEL}
      onStepChange={onStepChange}
      consentVariant={consentVariant}
    />
  );
}
