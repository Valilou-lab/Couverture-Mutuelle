import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { TranchesAgeDesktopAside } from "@/components/landing/senior/TranchesAgeDesktopAside";
import { HomeFormTrustButtons } from "@/components/landing/home/HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "@/components/landing/home/HomeHowItWorksSchema";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { RacPageTitle } from "./ResteAChargeHero";
import { RacCta, RacFaq } from "./ResteAChargeSections";

const DESKTOP_H1 =
  "mx-auto font-extrabold leading-[1.12] tracking-[-0.03em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(2.25rem,3vw,3rem)]";

/**
 * `/reste-a-charge`: own copy + care-needs questionnaire + mobile.
 * Desktop (`lg`) matches the validated `/tranches-age` two-column composition.
 * One quote form in the DOM.
 */
export function ResteAChargeLanding({
  className,
}: {
  className?: string;
} = {}) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0 lg:bg-white">
          <div className="lg:hidden">
            <SeniorHeader bordered={false} logoCentered showWhatsApp={false} />
          </div>

          <div className="bg-white lg:hidden">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
              <div className="mx-auto grid max-w-[760px] pb-2 pt-2 text-center">
                <h1 className="text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif]">
                  <RacPageTitle />
                </h1>
              </div>
            </div>
          </div>

          <div className="hidden bg-white px-6 pb-3 pt-8 text-center lg:block xl:px-10 xl:pt-10">
            <h1 className={DESKTOP_H1}>
              <RacPageTitle />
            </h1>
          </div>

          <section className="bg-[#ede9fe]">
            <div className="lg:mx-auto lg:max-w-[34rem] lg:px-6 lg:pt-1">
              <div
                id="devis"
                className="mx-auto w-full max-w-[560px] scroll-mt-4 px-4 pb-5 pt-4 lg:max-w-none lg:px-0 lg:pb-8 lg:pt-5"
              >
                <TikTokFunnelTracker />
                <SeniorQuoteForm
                  redesignIntro="mobile"
                  askCareNeedsFirst
                  lpV2Desktop
                />
              </div>
            </div>
          </section>

          <div className="hidden bg-white px-4 pb-6 pt-4 lg:block xl:px-8">
            <HomeFormTrustButtons />
            <HomeHowItWorksSchema
              headingId="comment-ca-se-passe-schema-desktop"
              needsText="en 2 minutes"
            />
          </div>
        </div>

        <TranchesAgeDesktopAside />
      </div>

      <div className="hidden bg-white px-6 pb-16 lg:block xl:px-10">
        <RacFaq headingId="faq-titre-desktop" />
        <RacCta label="DEVIS GRATUIT" />
      </div>

      <div className="lg:hidden">
        <HomeLpBelowForm needsText="en 2 minutes" />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
          <RacFaq />
          <RacCta label="MON DEVIS GRATUIT" />
        </div>
      </div>

      <SeniorFooter />
    </div>
  );
}
