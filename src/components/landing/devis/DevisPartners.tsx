import Image from "next/image";

const NOTE = "text-[0.82rem] text-zinc-600";

const PARTNERS = [
  { src: "/images/partners/santiane.webp", alt: "Santiane", width: 300, height: 60 },
  { src: "/images/partners/spvie.webp", alt: "SPVIE Assurances", width: 309, height: 160 },
  { src: "/images/partners/majelis.webp", alt: "Majelis", width: 119, height: 160 },
  {
    src: "/images/partners/aveyronnaise.webp",
    alt: "L’Aveyronnaise d’Assurances",
    width: 237,
    height: 160,
  },
  { src: "/images/partners/skarlett.webp", alt: "Skarlett", width: 720, height: 128 },
  { src: "/images/partners/iki.jpg", alt: "IKI Assurance", width: 371, height: 273 },
  {
    src: "/images/partners/assu-france.jpg",
    alt: "Assu France Courtage",
    width: 628,
    height: 134,
  },
] as const;

/** V2 `/devis` partners strip — V2-only logos; does not alter production LP strips. */
export function DevisPartners() {
  return (
    <section
      aria-labelledby="devis-partenaires-titre"
      className="mx-auto grid max-w-[760px] gap-4 pt-10 text-center"
    >
      <p
        id="devis-partenaires-titre"
        className="font-poppins text-[0.9rem] font-bold uppercase tracking-[0.06em] text-brand"
      >
        Nos partenaires sélectionnés
      </p>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2.5 p-0">
        {PARTNERS.map((logo) => (
          <li
            key={logo.src}
            className="grid min-h-16 place-items-center rounded-[14px] border border-[#ddd6fe] bg-white px-3.5 py-2"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              sizes="140px"
              className="block h-10 w-auto max-w-[140px] object-contain"
            />
          </li>
        ))}
      </ul>
      <p className={NOTE}>
        Votre demande peut être transmise à ces partenaires pour vous établir un
        devis.
      </p>
    </section>
  );
}
