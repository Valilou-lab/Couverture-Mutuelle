import Image from "next/image";

const PARTNER_LOGOS = [
  {
    src: "/images/partners/santiane.webp",
    alt: "Santiane",
    width: 300,
    height: 60,
  },
  {
    src: "/images/partners/spvie.webp",
    alt: "SPVIE Assurances",
    width: 309,
    height: 160,
  },
  {
    src: "/images/partners/majelis.webp",
    alt: "Majelis",
    width: 119,
    height: 160,
  },
  {
    src: "/images/partners/aveyronnaise.webp",
    alt: "L’Aveyronnaise d’Assurances",
    width: 237,
    height: 160,
  },
  {
    src: "/images/partners/skarlett.webp",
    alt: "Skarlett",
    width: 720,
    height: 128,
  },
] as const;

function LogoSlide({
  src,
  alt,
  width,
  height,
}: (typeof PARTNER_LOGOS)[number]) {
  return (
    <div className="flex h-10 w-[7.75rem] shrink-0 items-center justify-center sm:h-12 sm:w-[9.75rem] lg:h-14 lg:w-[11.5rem]">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-h-full max-w-full object-contain"
        sizes="(min-width: 1024px) 184px, (min-width: 640px) 156px, 124px"
      />
    </div>
  );
}

export function PartnerLogoCarousel() {
  return (
    <section
      aria-label="Nos partenaires de confiance"
      className="relative border-t border-brand/10 bg-white/90 py-6 sm:py-7 lg:border-t-0 lg:bg-[#fbfaff] lg:pb-8 lg:pt-10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-manrope text-[0.8125rem] font-semibold tracking-[0.04em] text-[#5b21b6]/80 sm:text-sm lg:hidden">
          Nos partenaires de confiance
        </h2>
        <div className="hidden text-center lg:block">
          <h2 className="font-manrope text-[2rem] font-extrabold tracking-tight text-[#3b0764]">
            Nos partenaires sélectionnés
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-zinc-600">
            Votre demande peut être transmise à des partenaires sélectionnés
            susceptibles de vous proposer une offre adaptée.
          </p>
        </div>
      </div>

      <div className="partner-marquee mt-4 sm:mt-5 lg:mt-6">
        <div className="partner-marquee-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="partner-marquee-group"
              aria-hidden={copy === 1}
            >
              {PARTNER_LOGOS.map((logo) => (
                <LogoSlide
                  key={`${logo.src}-${copy}`}
                  {...logo}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
