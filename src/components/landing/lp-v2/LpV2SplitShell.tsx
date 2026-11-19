import type { ReactNode } from "react";
import { HomeFormTrustButtons } from "@/components/landing/home/HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "@/components/landing/home/HomeHowItWorksSchema";
import { RacCta } from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { SeniorFooter } from "@/components/landing/senior/SeniorFooter";
import { SeniorHeader } from "@/components/landing/senior/SeniorHeader";
import { TranchesAgeDesktopAside } from "@/components/landing/senior/TranchesAgeDesktopAside";

export type LpV2SchemaCopy = {
  needsText?: string;
  quotesTitle?: string;
  quotesText?: string;
  signText?: ReactNode;
};

type LpV2SplitShellProps = {
  className?: string;
  mobileHeader?: ReactNode;
  mobileTitle: ReactNode;
  desktopTitle: ReactNode;
  form: ReactNode;
  schemaCopy?: LpV2SchemaCopy;
  desktopFaq: ReactNode;
  desktopCtaLabel: string;
  mobileBelow: ReactNode;
  /** From question 2 onward — hide jumping « Comment ça se passe ». */
  showHowItWorks?: boolean;
};

/**
 * Shared V2 desktop shell aligned with `/devis`:
 * pastel header (badge, no logo), white form, Google on white, how-it-works on pastel.
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
  showHowItWorks = true,
}: LpV2SplitShellProps) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55] text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="min-w-0 lg:bg-white">
          <div className="bg-[#ede9fe]">
            {mobileHeader ?? (
              <SeniorHeader
                bordered={false}
                logoCentered
                showWhatsApp={false}
                showLogo={false}
                backgroundClassName="bg-transparent"
              />
            )}
            <div className="lg:hidden">
              <div className="mx-auto w-full max-w-[640px] px-4 min-[700px]:max-w-[1000px]">
                {mobileTitle}
              </div>
            </div>
            <div className="hidden px-6 pb-3 pt-4 text-center lg:block xl:px-10 xl:pt-5">
              {desktopTitle}
            </div>
          </div>

          <section className="bg-white">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[900px]:max-w-[1100px] lg:max-w-[34rem] lg:px-6 lg:pt-1">
              <div id="devis" className="scroll-mt-4 pb-5 pt-4 lg:pb-4 lg:pt-5">
                {form}
              </div>
            </div>
          </section>

          <div className="hidden bg-white px-4 pb-2 pt-2 lg:block xl:px-8">
            <HomeFormTrustButtons />
          </div>
          {showHowItWorks ? (
            <div className="hidden bg-[#ede9fe] px-4 pb-6 pt-0 lg:block xl:px-8">
              <HomeHowItWorksSchema
                headingId="comment-ca-se-passe-schema-desktop"
                needsText={schemaCopy?.needsText}
                quotesTitle={schemaCopy?.quotesTitle}
                quotesText={schemaCopy?.quotesText}
                signText={schemaCopy?.signText}
              />
            </div>
          ) : null}
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
