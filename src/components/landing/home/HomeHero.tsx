import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

/**
 * Form-first hero for the homepage (/), same layout as /reste-a-charge:
 * the homepage headline, then the same quote form (SeniorQuoteForm, id="devis"), centred.
 */
export function HomeHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="mx-auto grid max-w-[760px] gap-2.5 pb-4 pt-[22px] text-center min-[900px]:pt-9">
        <h1 className="text-balance font-poppins text-[clamp(1.55rem,6.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
          Anticipez la hausse de votre mutuelle et{" "}
          <span className="text-brand">économisez dès maintenant</span>
        </h1>
        <p className="text-balance font-poppins text-[clamp(1.1rem,4.4vw,1.4rem)] font-bold leading-snug text-[#3b0764]">
          Comparez en 1 minute.{" "}
          <span className="text-brand">Un conseiller vous rappelle</span> avec les
          offres adaptées à votre âge.
        </p>
      </div>
      <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
        <SeniorQuoteForm />
      </div>
    </>
  );
}
