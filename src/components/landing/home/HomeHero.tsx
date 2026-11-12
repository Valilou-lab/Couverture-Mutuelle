import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import type { FormStepId } from "@/components/form/types";
import {
  DesktopFormWithPhoto,
  type PhotoBadgeVariant,
} from "@/components/landing/DesktopFormWithPhoto";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

/**
 * Form-first hero for the homepage (/): headline (white band above the form)
 * then the quote form (SeniorQuoteForm, id="devis"), centred.
 * Desktop: form over the homepage photo; mobile: form over the same photo.
 */
export function HomeHeroTitles({ className }: { className?: string } = {}) {
  return (
    <div
      className={`mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center lg:pb-3 lg:pt-1${
        className ? ` ${className}` : ""
      }`}
    >
      <h1 className="text-balance font-poppins text-[clamp(1.6rem,6.2vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#3b0764]">
        Comparez pour économiser jusqu&apos;à{" "}
        <span className="text-[1.32em] text-[#9b4ff0]">450 euros</span> / an
      </h1>
    </div>
  );
}

export function HomeHeroForm({
  onStepChange,
  photoBadge = "free",
  showPhoto = true,
}: {
  onStepChange?: (step: FormStepId, questionNumber: number | null) => void;
  photoBadge?: PhotoBadgeVariant;
  showPhoto?: boolean;
} = {}) {
  return (
    <DesktopFormWithPhoto
      photoBadge={photoBadge}
      showPhoto={showPhoto}
      className={showPhoto ? undefined : "pt-0 lg:pt-0"}
    >
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
