"use client";

import type { ReactNode } from "react";
import { QuoteForm } from "@/components/form/QuoteForm";
import type { FormStepId } from "@/components/form/types";
import type { ConsentVariantId } from "@/lib/consent";
import { useLgUp } from "@/components/form/useLgUp";
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
   * `true` = main LP (/) + /tiktok: brand intro + redesign chrome + identity split.
   * `"mobile"` = redesign chrome under 1024px only; desktop and step order stay classic.
   */
  redesignIntro?: boolean | "mobile";
  firstStepIntro?: ReactNode;
  /** `/tranches-age` only — age first, Vertikl DOB synthesized as 15/06/YYYY. */
  askAgeInsteadOfBirthDate?: boolean;
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
  askAgeInsteadOfBirthDate = false,
}: SeniorQuoteFormProps = {}) {
  const lgUp = useLgUp();
  const fullRedesign = redesignIntro === true;
  const mobileRedesign = redesignIntro === "mobile" && !lgUp;
  const visualRedesign = fullRedesign || mobileRedesign;
  const intro =
    firstStepIntro !== undefined
      ? firstStepIntro
      : consentVariant === "iki" || visualRedesign
        ? ""
        : DEFAULT_INTRO;

  return (
    <QuoteForm
      variant="senior"
      firstStep={askAgeInsteadOfBirthDate ? "age" : "currentMutualTariff"}
      firstStepIntro={intro}
      askAgeInsteadOfBirthDate={askAgeInsteadOfBirthDate}
      introBarStyle={fullRedesign ? "brand" : "soft"}
      redesignVisual={visualRedesign}
      coveredPersonsTitle="Qui doit être assuré ?"
      accentQuestions
      funnel={SENIOR_FORM_FUNNEL}
      onStepChange={onStepChange}
      consentVariant={consentVariant}
    />
  );
}
