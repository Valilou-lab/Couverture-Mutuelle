import { QuoteFormV2 } from "@/components/form/v2/QuoteFormV2";
import { DesktopFormWithPhoto } from "@/components/landing/DesktopFormWithPhoto";

/**
 * Form-first hero for the V2 `/devis` LP.
 * Visual shell matches `/` (titles + desktop photo); form remains QuoteFormV2.
 */
function DevisHeroTitles() {
  return (
    <div className="mx-auto grid max-w-[760px] gap-2.5 pb-5 pt-[22px] text-center min-[900px]:pb-6 lg:pb-5 lg:pt-3">
      <h1 className="text-balance font-poppins text-[clamp(1.55rem,6.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]">
        MUTUELLE SENIOR
      </h1>
      <p className="text-balance font-poppins text-[clamp(1.1rem,4.4vw,1.4rem)] font-bold leading-snug text-[#3b0764]">
        VÉRIFIEZ SI VOUS POUVEZ PAYER MOINS SANS RÉDUIRE VOS GARANTIES
      </p>
    </div>
  );
}

function DevisHeroForm() {
  return (
    <DesktopFormWithPhoto>
      <QuoteFormV2 />
    </DesktopFormWithPhoto>
  );
}

export function DevisHero() {
  return (
    <>
      <DevisHeroTitles />
      <DevisHeroForm />
    </>
  );
}

DevisHero.Titles = DevisHeroTitles;
DevisHero.Form = DevisHeroForm;
