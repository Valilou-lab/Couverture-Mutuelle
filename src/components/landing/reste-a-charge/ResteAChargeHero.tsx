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
      <div className="mx-auto grid max-w-[760px] gap-2.5 pb-4 pt-[22px] text-center min-[900px]:pt-9">
        <h1 className="text-balance font-poppins text-[clamp(1.55rem,6.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
          «&nbsp;<span className="text-brand">420&nbsp;€ de reste&nbsp;à&nbsp;charge</span>…
          alors que je paie ma mutuelle&nbsp;?&nbsp;»
        </h1>
        <p className="text-balance font-poppins text-[clamp(1.1rem,4.4vw,1.4rem)] font-bold leading-snug text-[#3b0764]">
          Vous aussi&nbsp;?{" "}
          <span className="text-brand">Comparez votre mutuelle en 1 minute.</span>
        </p>
      </div>
      <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
        <SeniorQuoteForm />
      </div>
    </>
  );
}
