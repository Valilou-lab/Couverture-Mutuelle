import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { HomeFormTrustButtons } from "@/components/landing/home/HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "@/components/landing/home/HomeHowItWorksSchema";
import { HomeLpBelowForm } from "@/components/landing/home/HomeLpBelowForm";
import { RacCta, RacFaq } from "@/components/landing/reste-a-charge/ResteAChargeSections";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { SeniorFooter } from "./SeniorFooter";
import { SeniorHeader } from "./SeniorHeader";
import { TranchesAgeDesktopAside } from "./TranchesAgeDesktopAside";

const TRANCHES_FAQ = [
  {
    question: "Le comparatif est-il vraiment gratuit ?",
    answer: "Oui, entièrement gratuit et sans engagement.",
  },
  {
    question: "Êtes-vous une mutuelle ?",
    answer:
      "Non. Nous vous mettons en relation avec des partenaires qui comparent les offres pour vous.",
  },
  {
    question: "Puis-je comparer si j’ai déjà une mutuelle ?",
    answer: "Oui. Après un an de contrat, vous pouvez changer à tout moment.",
  },
  {
    question: "Comment sont utilisées mes données ?",
    answer:
      "Uniquement pour vous proposer des offres de complémentaire santé. Vous pouvez retirer votre accord à tout moment.",
  },
  {
    question: "Combien de temps prend le formulaire ?",
    answer: "Moins d’une minute : 6 questions.",
  },
] as const;

const SCHEMA_COPY = {
  needsText: "en 1 minute",
  quotesTitle: "Vos devis adaptés :",
  quotesText: "selon vos informations",
  signText: "Nous nous occupons des démarches de résiliation",
} as const;

type SeniorLandingProps = {
  /** Extra classes (used by `/tranches-age` for the Inter type scale). */
  className?: string;
};

/** /tranches-age: validated mobile template, two-column desktop from `lg`. One form. */
export function SeniorLanding({ className }: SeniorLandingProps = {}) {
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
                <h1 className="text-[clamp(1.4rem,7.2vw,1.8125rem)] font-extrabold leading-[1.15] tracking-[-0.02em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] [text-size-adjust:100%]">
                  <span className="block whitespace-nowrap text-zinc-900">
                    Quel tarif pour votre âge&nbsp;?
                  </span>
                  <span className="block text-[#9b4ff0]">
                    <span className="block whitespace-nowrap">Recevez vos</span>
                    <span className="block whitespace-nowrap">
                      propositions gratuitement
                    </span>
                  </span>
                </h1>
              </div>
            </div>
          </div>
          <div className="hidden bg-white px-6 pb-3 pt-8 text-center lg:block xl:px-10 xl:pt-10">
            <h1 className="mx-auto font-extrabold leading-[1.12] tracking-[-0.03em] [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(2.25rem,3vw,3rem)]">
              <span className="block text-zinc-900">
                Quel tarif pour votre âge&nbsp;?
              </span>
              <span className="block text-[#9b4ff0]">
                Recevez vos propositions gratuitement
              </span>
            </h1>
          </div>

          <section className="bg-[#ede9fe]">
            <div className="mx-auto w-full max-w-[640px] px-4 min-[900px]:max-w-[1100px] lg:max-w-[34rem] lg:px-6 lg:pt-1">
              <div id="devis" className="scroll-mt-4 pb-5 pt-4 lg:pb-8 lg:pt-5">
                <TikTokFunnelTracker />
                <SeniorQuoteForm
                  redesignIntro="mobile"
                  askAgeInsteadOfBirthDate
                />
              </div>
            </div>
          </section>

          <div className="hidden bg-white px-4 pb-6 pt-4 lg:block xl:px-8">
            <HomeFormTrustButtons />
            <HomeHowItWorksSchema
              headingId="comment-ca-se-passe-schema-desktop"
              needsText={SCHEMA_COPY.needsText}
              quotesTitle={SCHEMA_COPY.quotesTitle}
              quotesText={SCHEMA_COPY.quotesText}
              signText={SCHEMA_COPY.signText}
            />
          </div>
        </div>

        <TranchesAgeDesktopAside />
      </div>

      <div className="hidden bg-white px-6 pb-16 lg:block xl:px-10">
        <RacFaq headingId="faq-titre-desktop" items={TRANCHES_FAQ} />
        <RacCta label="DEVIS GRATUIT" />
      </div>

      <div className="lg:hidden">
        <HomeLpBelowForm
          needsText={SCHEMA_COPY.needsText}
          quotesTitle={SCHEMA_COPY.quotesTitle}
          quotesText={SCHEMA_COPY.quotesText}
          signText={SCHEMA_COPY.signText}
        />
        <div className="mx-auto w-full max-w-[640px] px-4 pb-12 min-[700px]:max-w-[1000px]">
          <RacFaq items={TRANCHES_FAQ} />
          <RacCta label="MON DEVIS GRATUIT" />
        </div>
      </div>

      <SeniorFooter />
    </div>
  );
}
