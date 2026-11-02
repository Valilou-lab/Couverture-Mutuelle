import { QuoteFormV2 } from "@/components/form/v2/QuoteFormV2";

/**
 * Form-first hero for the V2 `/devis` LP (Preview only for now).
 */
export function DevisHero() {
  return (
    <>
      <div className="mx-auto grid max-w-[760px] gap-2.5 pb-4 pt-[22px] text-center min-[900px]:pt-9">
        <p className="text-[0.75rem] font-bold uppercase tracking-wide text-violet-700">
          Parcours V2 — preview
        </p>
        <h1 className="text-balance font-poppins text-[clamp(1.55rem,6.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
          Anticipez la hausse de votre mutuelle et{" "}
          <span className="text-brand">économisez dès maintenant</span>
        </h1>
      </div>
      <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
        <QuoteFormV2 />
      </div>
    </>
  );
}
