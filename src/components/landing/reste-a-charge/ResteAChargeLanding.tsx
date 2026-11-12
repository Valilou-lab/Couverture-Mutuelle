import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
import { HomeHeroTitles } from "@/components/landing/home/HomeHero";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { TrustpilotMini } from "@/components/trustpilot/TrustpilotMini";
import { ResteAChargeHero } from "./ResteAChargeHero";
import {
  RacAdvantages,
  RacCta,
  RacFaq,
  RacPeople,
  RacWhy,
} from "./ResteAChargeSections";

const CTA_LABEL = "Je compare ma mutuelle";

/**
 * /reste-a-charge landing (Meta ad « A03 | Reste à charge 420 € », UGC video).
 * Mobile: homepage `/` template. Desktop: existing layout, unchanged.
 * One quote form in the DOM.
 */
export function ResteAChargeLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <div className="lg:hidden">
        <SeniorHeader bordered={false} logoCentered />
      </div>
      <div className="hidden lg:block">
        <SeniorHeader />
      </div>

      <div className="bg-white lg:hidden">
        <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
          <HomeHeroTitles className="pb-2" />
        </div>
      </div>

      <section className="bg-[#ede9fe] lg:bg-transparent">
        <div className="hidden lg:block">
          <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
            <ResteAChargeHero titlesOnly />
          </div>
        </div>
        <ResteAChargeHero formOnly />
      </section>

      <div className="lg:hidden">
        <HomeLpBelowForm />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
          <RacFaq />
          <RacCta label="MON DEVIS GRATUIT" />
        </div>
        <TrustpilotMini />
      </div>

      <main className="mx-auto hidden w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px] lg:block">
        <RacAdvantages />
        <RacWhy />
        <RacCta label={CTA_LABEL} />
        <RacFaq />
        <RacCta label={CTA_LABEL} />
        <RacPeople mariePrice={39} />
      </main>
      <SeniorFooter />
      <SeniorStickyCta ctaLabel={CTA_LABEL} />
    </div>
  );
}
