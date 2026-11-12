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
      className={`mx-auto grid w-full min-w-0 max-w-[760px] gap-1.5 pb-3 pt-2 text-center lg:pb-3 lg:pt-1${
        className ? ` ${className}` : ""
      }`}
    >
      <h1 className="min-w-0 w-full font-poppins text-[clamp(1.55rem,6.8vw,2.05rem)] font-extrabold leading-[1.12] tracking-[-0.03em] lg:text-balance lg:text-[clamp(1.75rem,4.2vw,2.4rem)] lg:leading-[1.15] lg:tracking-[-0.02em]">
        <span className="block text-zinc-900">
          <span className="block whitespace-nowrap lg:inline lg:whitespace-normal">
            Le bon tarif pour
          </span>{" "}
          <span className="block whitespace-nowrap lg:inline lg:whitespace-normal">
            votre mutuelle
          </span>
        </span>
        <span className="block text-[#9b4ff0]">
          <span className="block whitespace-nowrap lg:inline lg:whitespace-normal">
            sans perdre les
          </span>{" "}
          <span className="block whitespace-nowrap lg:inline lg:whitespace-normal">
            garanties qui comptent
          </span>
        </span>
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
