import { SeniorFooter } from "./SeniorFooter";
import { SeniorHeader } from "./SeniorHeader";
import { SeniorHero } from "./SeniorHero";
import {
  SeniorFaq,
  SeniorFinalCta,
  SeniorGuarantees,
  SeniorPartners,
  SeniorPeople,
  SeniorPricing,
  SeniorSteps,
} from "./SeniorSections";
import { SeniorStickyCta } from "./SeniorStickyCta";

/** Homepage (/) landing, senior audience: larger type and tap targets. */
export function SeniorLanding() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <SeniorHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 min-[900px]:max-w-[1100px]">
        <SeniorHero />
        <SeniorPartners />
        <SeniorSteps />
        <SeniorPeople />
        <SeniorPricing />
        <SeniorGuarantees />
        <SeniorFaq />
        <SeniorFinalCta />
      </main>
      <SeniorFooter />
      <SeniorStickyCta />
    </div>
  );
}
