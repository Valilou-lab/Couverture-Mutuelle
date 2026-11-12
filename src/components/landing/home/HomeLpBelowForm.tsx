import type { ReactNode } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { CTA_CLASS, SeniorPartners } from "@/components/landing/senior/SeniorSections";
import { HomeFormTrustButtons } from "./HomeFormTrustButtons";
import { HomeHowItWorksSchema } from "./HomeHowItWorksSchema";

const GET_BENEFITS = [
  {
    lead: "Le bon tarif",
    rest: ", sans perdre les garanties qui comptent pour vous",
  },
  {
    lead: "Aucune démarche pour changer",
    rest: " : la résiliation est faite pour vous*",
  },
  {
    lead: "Plusieurs propositions",
    rest: " : vous choisissez, ou vous arrêtez quand vous voulez",
  },
] as const;

function FormGetBenefits() {
  return (
    <div className="mx-auto max-w-[34rem] px-1 pb-1">
      <p className="text-[1.05rem] font-extrabold leading-snug text-[#3b0764] sm:text-[1.12rem]">
        Gratuitement, vous obtenez :
      </p>
      <ul className="mt-3 grid gap-2.5">
        {GET_BENEFITS.map((item) => (
          <li
            key={item.lead}
            className="flex items-start gap-2.5 text-[0.98rem] leading-snug text-[#3b0764] sm:text-[1.02rem]"
          >
            <Check
              className="mt-0.5 h-5 w-5 shrink-0 text-[#22c55e]"
              strokeWidth={3}
              aria-hidden
            />
            <span>
              <strong className="font-extrabold">{item.lead}</strong>
              {item.rest}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.82rem] leading-snug text-[#5b4a72]">
        * Dès que votre contrat actuel a plus d’un an.
      </p>
    </div>
  );
}

type HomeLpBelowFormProps = {
  needsText?: string;
  quotesTitle?: string;
  quotesText?: string;
  signText?: ReactNode;
};

/**
 * Blocks under the homepage form: avis, 3-step schema, courtyard photo,
 * benefits, JE COMPARE, partner carousel.
 */
export function HomeLpBelowForm({
  needsText,
  quotesTitle,
  quotesText,
  signText,
}: HomeLpBelowFormProps = {}) {
  return (
    <>
      <div className="bg-white px-4 pb-4 pt-4">
        <HomeFormTrustButtons />
        <HomeHowItWorksSchema
          needsText={needsText}
          quotesTitle={quotesTitle}
          quotesText={quotesText}
          signText={signText}
        />
      </div>
      <section className="relative overflow-hidden lg:hidden">
        <Image
          src="/images/hero-couple-cour.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_68%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 pb-[12rem] pt-3" />
      </section>
      <div className="bg-white px-4 pb-5 pt-5">
        <FormGetBenefits />
        <div className="py-3.5">
          <a
            href="#devis"
            className={`${CTA_CLASS} mx-auto mt-4 min-h-14 max-w-[34rem] uppercase tracking-[0.04em]`}
          >
            JE COMPARE
          </a>
        </div>
        <SeniorPartners carousel />
      </div>
    </>
  );
}
