import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

const TITLE_CLASS =
  "font-extrabold leading-[1.15] tracking-[-0.02em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif]";

export function RacPageTitle() {
  return (
    <>
      <span className="block text-zinc-900">
        Le 100&nbsp;% Santé ne couvre pas tout
      </span>
      <span className="block text-[#9b4ff0]">
        Êtes-vous bien remboursé(e) sur le reste&nbsp;?
      </span>
    </>
  );
}

/**
 * Form-first hero for /reste-a-charge (Meta ad « A03 | Reste à charge 420 € »).
 * Titles stay on desktop; the form is rendered once (`formOnly`) for mobile + desktop.
 */
export function ResteAChargeHero({
  titlesOnly = false,
  formOnly = false,
}: {
  titlesOnly?: boolean;
  formOnly?: boolean;
} = {}) {
  if (formOnly) {
    return (
      <div
        id="devis"
        className="mx-auto w-full max-w-[560px] scroll-mt-4 px-4 pb-5 pt-4 lg:pb-0 lg:pt-0"
      >
        <TikTokFunnelTracker />
        <SeniorQuoteForm redesignIntro="mobile" askCareNeedsFirst />
      </div>
    );
  }

  if (titlesOnly) {
    return (
      <div className="mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center min-[900px]:pt-4">
        <h1 className={`${TITLE_CLASS} text-[clamp(1.6rem,6.2vw,2.4rem)]`}>
          <RacPageTitle />
        </h1>
      </div>
    );
  }

  return (
    <>
      <TikTokFunnelTracker />
      <div className="mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center min-[900px]:pt-4">
        <h1 className={`${TITLE_CLASS} text-[clamp(1.6rem,6.2vw,2.4rem)]`}>
          <RacPageTitle />
        </h1>
      </div>
      <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
        <SeniorQuoteForm />
      </div>
    </>
  );
}
