import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

/**
 * Form-first hero for /reste-a-charge (Meta ad « A03 | Reste à charge 420 € »):
 * one headline echoing the video, then the same quote form as the homepage
 * (SeniorQuoteForm, id="devis"), centred.
 */
export function ResteAChargeHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center min-[900px]:pt-4">
        <h1 className="text-balance font-poppins text-[clamp(1.6rem,6.2vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#3b0764]">
          Comparez pour économiser jusqu&apos;à{" "}
          <span className="text-[1.32em] text-[#9b4ff0]">450 euros</span> / an
        </h1>
      </div>
      <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
        <SeniorQuoteForm />
      </div>
    </>
  );
}
