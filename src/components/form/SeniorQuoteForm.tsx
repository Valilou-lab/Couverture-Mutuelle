"use client";

import type { ReactNode } from "react";
import type { FormStepId } from "@/components/form/types";
import {
  QuoteFormV2,
  type QuoteFormV2Props,
} from "@/components/form/v2/QuoteFormV2";
import type { V2StepId } from "@/components/form/v2/v2Types";
import { LpV2DesktopFormContext } from "@/components/form/seniorForm";
import type { ConsentVariantId } from "@/lib/consent";

type SeniorQuoteFormProps = {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
  onFocusChange?: (focused: boolean) => void;
  /** Defaults to `"senior"`. Pass `"iki"` on the IKI LP for dual opt-ins. */
  consentVariant?: Extract<ConsentVariantId, "senior" | "iki">;
  /**
   * Kept for landing API compatibility — V2 chrome is always on.
   * `true` / `"mobile"` no longer switch the lead backend.
   */
  redesignIntro?: boolean | "mobile";
  /** Unused on V2 (intro lives on the landing chrome). */
  firstStepIntro?: ReactNode;
  /** `/tranches-age` only — age first, Vertikl DOB synthesized as 15/06/YYYY. */
  askAgeInsteadOfBirthDate?: boolean;
  /** `/reste-a-charge` only — care-priorities (hospitalisation, dentaire…) first. */
  askCareNeedsFirst?: boolean;
  /**
   * Independent V2 URLs: visual flag only — lead path is always QuoteFormV2.
   */
  lpV2Desktop?: boolean;
  /** Kept for API compatibility with older landings. */
  splitContact?: boolean;
};

/**
 * Thin wrapper around QuoteFormV2 so every CM lead LP shares the same
 * OTP → Vertikl precheck → consent → acquire path as `/devis`.
 */
export function SeniorQuoteForm({
  onStepChange,
  onFocusChange,
  consentVariant = "senior",
  askAgeInsteadOfBirthDate = false,
  askCareNeedsFirst = false,
  lpV2Desktop = false,
}: SeniorQuoteFormProps = {}) {
  const v2Props: QuoteFormV2Props = {
    askAgeInsteadOfBirthDate,
    askCareNeedsFirst,
    consentVariant,
    careNeedsTitle: askCareNeedsFirst
      ? "Sur quels soins voulez-vous être mieux remboursé(e)\u00a0?"
      : undefined,
    onFocusChange,
    onStepChange: (step: V2StepId, questionNumber) => {
      onStepChange?.(step as FormStepId, questionNumber);
    },
  };

  return (
    <LpV2DesktopFormContext.Provider value={lpV2Desktop}>
      <QuoteFormV2 {...v2Props} />
    </LpV2DesktopFormContext.Provider>
  );
}
