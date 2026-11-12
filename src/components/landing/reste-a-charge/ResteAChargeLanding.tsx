import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { RacPageTitle, ResteAChargeHero } from "./ResteAChargeHero";
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
      <div className="lg:hidden">
        <SeniorHeader bordered={false} logoCentered showWhatsApp={false} />
      </div>
      <div className="hidden lg:block">
        <SeniorHeader showWhatsApp={false} />
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

      <section className="bg-[#ede9fe] lg:bg-transparent">
        <div className="hidden lg:block">
          <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
            <ResteAChargeHero titlesOnly />
          </div>
        </div>
        <ResteAChargeHero formOnly />
      </section>

      <div className="lg:hidden">
        <HomeLpBelowForm needsText="en 2 minutes" />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
          <RacFaq />
          <RacCta label="MON DEVIS GRATUIT" />
        </div>
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
    </div>
  );
}
