import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { SeniorStickyCta } from "@/components/landing/senior/SeniorStickyCta";
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
 * Short, form-first page: headline, the same quote form as the homepage,
 * then a few supporting blocks. Reuses the senior header, footer and sticky CTA.
 */
export function ResteAChargeLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <SeniorHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-12 min-[700px]:max-w-[1000px]">
        <ResteAChargeHero />
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
