import type { ReactNode } from "react";
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

type SeniorLandingProps = {
  /** Defaults to the homepage hero (/). */
  hero?: ReactNode;
  /** Number of questions announced in « 3 étapes simples ». */
  questionsCount?: number;
  /** Main CTA label (final + sticky). Defaults to « Je compare gratuitement ». */
  ctaLabel?: string;
};

/** Homepage (/) landing, senior audience: larger type and tap targets. */
export function SeniorLanding({
  hero = <SeniorHero />,
  questionsCount,
  ctaLabel,
}: SeniorLandingProps = {}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground">
      <SeniorHeader />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 min-[900px]:max-w-[1100px]">
        {hero}
        <SeniorPartners />
        <SeniorSteps questionsCount={questionsCount} />
        <SeniorPeople />
        <SeniorPricing />
        <SeniorGuarantees />
        <SeniorFaq />
        <SeniorFinalCta ctaLabel={ctaLabel} />
      </main>
      <SeniorFooter />
      <SeniorStickyCta ctaLabel={ctaLabel} />
    </div>
  );
}
