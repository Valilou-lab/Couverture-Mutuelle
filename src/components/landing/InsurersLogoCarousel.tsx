const LOGOS = [
  { src: "/images/logoassurance/harmonie-mutuelle.jpg", alt: "Harmonie Mutuelle" },
  { src: "/images/logoassurance/mgen.png", alt: "MGEN" },
  { src: "/images/logoassurance/malakoff-humanis.png", alt: "Malakoff Humanis" },
  { src: "/images/logoassurance/swisslife.png", alt: "Swiss Life" },
  { src: "/images/logoassurance/aesio.png", alt: "Aésio Mutuelle" },
  { src: "/images/logoassurance/apivia.png", alt: "Apivia" },
  { src: "/images/logoassurance/axa.webp", alt: "AXA" },
  { src: "/images/logoassurance/generali.webp", alt: "Generali" },
  { src: "/images/logoassurance/groupama.webp", alt: "Groupama" },
  { src: "/images/logoassurance/allianz.png", alt: "Allianz" },
] as const;

function LogoTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {LOGOS.map((logo) => (
        <li
          key={`${ariaHidden ? "dup" : "main"}-${logo.alt}`}
          className="flex h-16 w-[11rem] shrink-0 items-center justify-center pr-16 sm:h-20 sm:w-[14rem] sm:pr-20 lg:h-24 lg:w-[16rem] lg:pr-24"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static public logos, avoid Next image optimizer issues */}
          <img
            src={logo.src}
            alt={ariaHidden ? "" : logo.alt}
            width={280}
            height={96}
            decoding="async"
            className="insurers-logo max-h-16 w-auto max-w-full object-contain sm:max-h-20 lg:max-h-24"
          />
        </li>
      ))}
    </ul>
  );
}

export function InsurersLogoCarousel() {
  return (
    <section
      id="acteurs-du-marche"
      className="overflow-hidden bg-white px-4 pb-6 pt-0 sm:px-6 sm:pb-8 sm:pt-0"
      aria-label="Les offres des principaux acteurs du marché"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-brand sm:text-[0.9375rem]">
          Les offres des principaux acteurs du marché
        </h2>
      </div>

      <div className="relative mt-4 sm:mt-5">
        <div className="insurers-marquee group">
          <div className="insurers-marquee-track">
            <LogoTrack />
            <LogoTrack ariaHidden />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20 md:w-28"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20 md:w-28"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
