import type { ReactNode } from "react";
import { HomeFormTrustButtons } from "@/components/landing/home/HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "@/components/landing/home/HomeHowItWorksSchema";
import { RacCta } from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { TranchesAgeDesktopAside } from "@/components/landing/senior/TranchesAgeDesktopAside";

export type LpV2SchemaCopy = {
  needsText?: string;
  quotesTitle?: string;
  quotesText?: string;
  signText?: ReactNode;
};

type LpV2SplitShellProps = {
  className?: string;
  mobileHeader: ReactNode;
  mobileTitle: ReactNode;
  desktopTitle: ReactNode;
  form: ReactNode;
  schemaCopy?: LpV2SchemaCopy;
  desktopFaq: ReactNode;
  desktopCtaLabel: string;
  mobileBelow: ReactNode;
};

/**
 * Shared V2 desktop shell: two columns from `lg`, sticky violet aside,
 * FAQ + CTA under both columns. Mobile slots stay LP-specific.
 */
export function LpV2SplitShell({
  className,
  mobileHeader,
  mobileTitle,
  desktopTitle,
  form,
  schemaCopy,
  desktopFaq,
  desktopCtaLabel,
  mobileBelow,
}: LpV2SplitShellProps) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col bg-surface text-[18px] leading-[1.55] text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0 lg:bg-white">
          <div className="lg:hidden">{mobileHeader}</div>

          <div className="bg-white lg:hidden">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
              {mobileTitle}
            </div>
          </div>
          <div className="hidden bg-white px-6 pb-3 pt-8 text-center lg:block xl:px-10 xl:pt-10">
            {desktopTitle}
          </div>

          <section className="bg-[#ede9fe]">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[900px]:max-w-[1100px] lg:max-w-[34rem] lg:px-6 lg:pt-1">
              <div id="devis" className="scroll-mt-4 pb-5 pt-4 lg:pb-8 lg:pt-5">
                {form}
              </div>
            </div>
          </section>

          <div className="hidden bg-white px-4 pb-6 pt-4 lg:block xl:px-8">
            <HomeFormTrustButtons />
            <HomeHowItWorksSchema
              headingId="comment-ca-se-passe-schema-desktop"
              needsText={schemaCopy?.needsText}
              quotesTitle={schemaCopy?.quotesTitle}
              quotesText={schemaCopy?.quotesText}
              signText={schemaCopy?.signText}
            />
          </div>
        </div>

        <TranchesAgeDesktopAside />
      </div>

      <div className="hidden bg-white px-6 pb-16 lg:block xl:px-10">
        {desktopFaq}
        <RacCta label={desktopCtaLabel} />
      </div>

      <div className="lg:hidden">{mobileBelow}</div>

      <SeniorFooter />
    </div>
  );
}
