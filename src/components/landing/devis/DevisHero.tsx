import { QuoteFormV2 } from "@/components/form/v2/QuoteFormV2";
import { DesktopFormWithPhoto } from "@/components/landing/DesktopFormWithPhoto";

/**
 * Form-first hero for the V2 `/devis` LP.
 * Visual shell matches `/` (titles + desktop photo); form remains QuoteFormV2.
 */
function DevisHeroTitles() {
  return (
    <div className="mx-auto grid max-w-[760px] gap-1.5 pb-3 pt-2 text-center lg:pb-2.5 lg:pt-1">
      <h1 className="text-balance font-poppins text-[clamp(1.4rem,5.5vw,2.05rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#3b0764]">
        MUTUELLE SENIOR
      </h1>
      <p className="text-balance font-poppins text-[clamp(1.02rem,4vw,1.25rem)] font-bold leading-snug text-[#3b0764]">
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
