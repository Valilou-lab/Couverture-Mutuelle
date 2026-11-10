import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import type { FormStepId } from "@/components/form/types";
import { DesktopFormWithPhoto } from "@/components/landing/DesktopFormWithPhoto";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

/**
 * Form-first hero for the homepage (/): headline (white band above the form)
 * then the quote form (SeniorQuoteForm, id="devis"), centred.
 * Desktop: faded photo left of the form; mobile unchanged.
 */
export function HomeHeroTitles() {
  return (
    <div className="mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center lg:pb-2.5 lg:pt-1">
      <h1 className="text-balance font-poppins text-[clamp(1.4rem,5.5vw,2.05rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#3b0764]">
        MUTUELLE SENIOR
      </h1>
      <p className="text-balance font-poppins text-[clamp(1.02rem,4vw,1.25rem)] font-bold leading-snug text-[#3b0764]">
          VÉRIFIEZ SI VOUS POUVEZ PAYER MOINS SANS RÉDUIRE VOS GARANTIES
      </p>
    </div>
  );
}

export function HomeHeroForm({
  onStepChange,
}: {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
} = {}) {
  return (
    <DesktopFormWithPhoto>
      <SeniorQuoteForm redesignIntro onStepChange={onStepChange} />
    </DesktopFormWithPhoto>
  );
}

export function HomeHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <HomeHeroTitles />
      <HomeHeroForm />
    </>
  );
}
