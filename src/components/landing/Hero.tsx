import { type ReactNode } from "react";
import { QuoteForm } from "@/components/form/QuoteForm";

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="font-bold text-[#c026d3]">{children}</span>
  );
}

function HeroCopyDesktop() {
  return (
    <>
      <h1 className="font-manrope text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15] xl:text-[2.5rem]">
        Trouvez votre nouvelle mutuelle{" "}
        <Highlight>gratuitement</Highlight> et <Highlight>sans engagement</Highlight>
      </h1>
      <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-white/80 px-4 py-3.5 text-lg font-medium leading-snug text-foreground ring-1 ring-brand/15 sm:mt-5 sm:px-5 sm:py-4 sm:text-xl lg:mx-0 lg:bg-white lg:text-[1.25rem] lg:leading-snug xl:text-[1.35rem]">
        Une économie moyenne de <Highlight>380&nbsp;€ à l’année</Highlight>.
      </p>
    </>
  );
}

function HeroCopyMobile() {
  return (
    <div className="text-center">
      <h1 className="font-manrope text-[1.375rem] font-extrabold leading-snug tracking-tight text-[#3b0764] sm:text-2xl">
        Votre devis en <Highlight>1&nbsp;minute</Highlight>{" "}
        <span aria-hidden="true">⏱️</span>
      </h1>
      <p className="mt-1.5 text-sm leading-snug text-zinc-600 sm:text-base">
        Une économie moyenne de <Highlight>380&nbsp;€ par an</Highlight>.
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="devis"
      className="relative scroll-mt-24 bg-gradient-to-b from-brand-soft/80 via-[#f5f2ff] to-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.55),transparent_60%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl min-w-0 items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12 lg:py-14 xl:gap-16">
        {/* Colonne texte */}
        <div className="min-w-0 text-center lg:text-left">
          {/* Mobile / tablette — intro compacte */}
          <div className="lg:hidden">
            <HeroCopyMobile />
          </div>

          {/* Desktop — mascotte + titre complet */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 mt-[14.5rem] rounded-[1.75rem] bg-gradient-to-b from-white/55 via-white/92 to-white px-6 pb-7 pt-8 shadow-[0_-10px_28px_-16px_rgba(109,40,217,0.22),0_16px_40px_-28px_rgba(15,15,20,0.25)] backdrop-blur-[1.5px] xl:px-8 xl:pb-8 xl:pt-9">
              <div className="pointer-events-none absolute bottom-[calc(100%-0.75rem)] left-1/2 z-0 w-[240px] -translate-x-[calc(50%+12px)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- PNG transparent temporaire hors Next Image */}
                <img
                  src="/images/mascotte-hero-transparente.png"
                  alt="Mascotte Couverture Mutuelle"
                  className="block h-auto w-full select-none drop-shadow-[0_12px_18px_rgba(15,15,20,0.18)]"
                />
              </div>

              <HeroCopyDesktop />
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="relative z-10 w-full min-w-0 overflow-x-clip pb-6 lg:justify-self-stretch lg:pb-8">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
