"use client";

import type { ReactNode } from "react";
import { QuoteForm } from "@/components/form/QuoteForm";
import type { FormStepId } from "@/components/form/types";
import { LpV2DesktopFormContext } from "@/components/form/seniorForm";
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
   * `true` = main LP (/) + /tiktok: redesign chrome + identity split.
   * `"mobile"` = same redesign HTML; desktop look is CSS (`lg`) on the LP wrapper.
   */
  redesignIntro?: boolean | "mobile";
  firstStepIntro?: ReactNode;
  /** `/tranches-age` only — age first, Vertikl DOB synthesized as 15/06/YYYY. */
  askAgeInsteadOfBirthDate?: boolean;
  /** `/reste-a-charge` only — care-priorities (hospitalisation, dentaire…) first. */
  askCareNeedsFirst?: boolean;
  /**
   * Independent V2 URLs: apply the validated `/tranches-age` desktop chrome
   * from `lg`, without changing this LP's questions or V1 routes.
   */
  lpV2Desktop?: boolean;
  /** Keep the homepage identity split even when V2 desktop chrome is on. */
  splitContact?: boolean;
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
  askCareNeedsFirst = false,
  lpV2Desktop = false,
  splitContact,
}: SeniorQuoteFormProps = {}) {
  const visualRedesign = redesignIntro === true || redesignIntro === "mobile";
  const intro =
    firstStepIntro !== undefined
      ? firstStepIntro
      : consentVariant === "iki"
        ? ""
        : askCareNeedsFirst
          ? "Votre devis en 2 minutes"
          : DEFAULT_INTRO;

  return (
    <LpV2DesktopFormContext.Provider value={lpV2Desktop}>
      <QuoteForm
        variant="senior"
        firstStep={
          askAgeInsteadOfBirthDate
            ? "age"
            : askCareNeedsFirst
              ? "careNeeds"
              : "currentMutualTariff"
        }
        firstStepIntro={intro}
        introBarFromLg={visualRedesign}
        askAgeInsteadOfBirthDate={askAgeInsteadOfBirthDate}
        askCareNeedsFirst={askCareNeedsFirst}
        careNeedsTitle={
          askCareNeedsFirst
            ? "Sur quels soins voulez-vous être mieux remboursé(e)\u00a0?"
            : undefined
        }
        introBarStyle="soft"
        redesignVisual={visualRedesign}
        splitContactIdentity={splitContact ?? redesignIntro === true}
        coveredPersonsTitle="Qui doit être assuré ?"
        accentQuestions
        funnel={SENIOR_FORM_FUNNEL}
        onStepChange={onStepChange}
        consentVariant={consentVariant}
      />
    </LpV2DesktopFormContext.Provider>
  );
}
