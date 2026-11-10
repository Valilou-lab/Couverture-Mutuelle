import { ComplianceQuoteForm } from "@/components/form/compliance/ComplianceQuoteForm";

/**
 * Form-first hero for the isolated /nouveau-parcours-demo LP.
 * Visual chrome matches the homepage; form is ComplianceQuoteForm only.
 */
export function NouveauParcoursHero() {
  return (
    <>
      <div className="mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center min-[900px]:pt-4">
        <p className="text-[0.75rem] font-bold uppercase tracking-wide text-amber-700">
          Parcours expérimental — démo
        </p>
        <h1 className="text-balance font-poppins text-[clamp(1.4rem,5.5vw,2.05rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#3b0764]">
          Anticipez la hausse de votre mutuelle et{" "}
          <span className="text-brand">économisez dès maintenant</span>
        </h1>
      </div>
      <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
        <ComplianceQuoteForm />
      </div>
    </>
  );
}
