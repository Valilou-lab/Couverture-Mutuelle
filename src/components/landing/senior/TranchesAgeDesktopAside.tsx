import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const BENEFITS = [
  {
    title: "Des propositions adaptées à votre profil",
    text: "Selon votre âge, vos besoins et les garanties importantes pour vous.",
  },
  {
    title: "Le juste prix pour votre mutuelle",
    text: "Sans sacrifier les remboursements qui comptent pour vous.",
  },
  {
    title: "Vous comparez gratuitement, sans engagement",
    text: "Vous choisissez ensuite de continuer… ou non.",
  },
] as const;

/** Desktop-only reassurance column for `/tranches-age`. */
export function TranchesAgeDesktopAside({
  showBrandLogo = true,
  spacious = false,
}: {
  /** White circular brand mark (turtle logo). Hide on `/devis`. */
  showBrandLogo?: boolean;
  /**
   * `/devis` only — stretch content over the full sticky height with
   * airier benefits + a stronger founder block. Default keeps other LPs.
   */
  spacious?: boolean;
} = {}) {
  if (spacious) {
    return (
      <aside className="relative hidden min-h-full bg-[#6d28d9] text-white lg:block">
        {/*
          Sticky viewport stack: benefits top + compact founder bottom,
          fully visible in one screen (no cut-off).
        */}
        <div className="sticky top-0 flex min-h-screen max-h-screen flex-col overflow-y-auto overscroll-contain px-8 py-9 xl:px-10 xl:py-11 2xl:px-12 2xl:py-12">
          <div className="mx-auto flex w-[min(100%,85%)] flex-1 flex-col gap-8 xl:gap-10">
            {/* Center benefits in the free space above the founder block. */}
            <div className="flex flex-1 flex-col justify-center">
              <h2 className="text-center font-extrabold leading-[1.15] tracking-[-0.03em] text-white [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(1.55rem,2.2vw,2.25rem)]">
                En 1 minute, obtenez gratuitement&nbsp;:
              </h2>
              <ul className="mt-8 grid gap-6 xl:mt-9 xl:gap-7 2xl:gap-8">
                {BENEFITS.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3.5 xl:gap-4"
                  >
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
                      <Check
                        className="h-5 w-5 text-[#22c55e] xl:h-6 xl:w-6"
                        strokeWidth={3.4}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[1.1rem] font-extrabold leading-snug tracking-[-0.02em] text-white xl:text-[1.25rem]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[0.9rem] font-medium leading-snug text-white/82 xl:text-[0.98rem]">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 pb-1">
              <div className="mb-6 h-px bg-white/70 xl:mb-7" />
              <h3 className="text-center text-[0.95rem] font-extrabold leading-snug tracking-[-0.02em] text-white xl:text-[1.02rem]">
                Qui est derrière Couverture Mutuelle&nbsp;?
              </h3>
              <div className="mt-5 flex items-stretch gap-2.5 xl:mt-6 xl:gap-3">
                <div className="min-w-0 flex-[3] rounded-xl bg-white px-3 py-2.5 text-[#3b0764] xl:px-3.5 xl:py-3">
                  <p className="text-[0.78rem] font-extrabold leading-snug xl:text-[0.84rem]">
                    Je suis Valentine, fondatrice de Couverture Mutuelle.
                  </p>
                  <p className="mt-1.5 text-[0.72rem] font-medium leading-snug text-[#3f3f46] xl:text-[0.78rem]">
                    Depuis 8 ans, je travaille aux côtés de courtiers en
                    assurance santé.
                  </p>
                  <p className="mt-1.5 text-[0.72rem] font-medium leading-snug text-[#3f3f46] xl:text-[0.78rem]">
                    J’ai créé ce service pour une raison simple&nbsp;: aider les
                    seniors à trouver le juste prix pour leur mutuelle, en toute
                    transparence.
                  </p>
                  <p className="mt-1.5 text-[0.72rem] font-medium leading-snug text-[#3f3f46] xl:text-[0.78rem]">
                    Nous travaillons uniquement avec des courtiers partenaires
                    sélectionnés et immatriculés à l’ORIAS.
                  </p>
                  <p className="mt-1.5 text-[0.76rem] font-extrabold leading-snug xl:text-[0.82rem]">
                    — Valentine, fondatrice
                  </p>
                </div>
                <div className="relative w-[clamp(6.5rem,24%,9.5rem)] shrink-0 self-stretch overflow-hidden rounded-xl xl:w-[clamp(7rem,26%,10.5rem)]">
                  <Image
                    src="/images/valentine-fondatrice.jpg"
                    alt="Valentine, fondatrice de Couverture Mutuelle"
                    fill
                    sizes="(min-width: 1536px) 200px, (min-width: 1280px) 168px, 140px"
                    className="object-cover object-[center_18%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="relative hidden min-h-full bg-[#6d28d9] text-white lg:block">
      <div className="sticky top-0 max-h-screen overflow-y-auto overscroll-contain px-8 py-10 xl:px-12 xl:py-12 2xl:px-14">
        <div>
          {showBrandLogo ? (
            <div className="flex justify-center pb-8 pt-1 xl:pb-10 xl:pt-2">
              <Link
                href="/"
                aria-label="Couverture Mutuelle"
                className="flex size-[8.5rem] items-center justify-center rounded-full bg-white p-5 xl:size-[9.5rem] xl:p-6"
              >
                <Image
                  src="/logo-couverture-mutuelle.png"
                  alt="Couverture Mutuelle"
                  width={782}
                  height={357}
                  loading="eager"
                  className="h-auto w-full"
                />
              </Link>
            </div>
          ) : null}
          <h2 className="text-center font-extrabold leading-[1.15] tracking-[-0.03em] text-white [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(1.7rem,2.4vw,2.45rem)]">
            En 1 minute, obtenez gratuitement&nbsp;:
          </h2>
          <ul className="mt-8 grid gap-6 xl:mt-10 xl:gap-7">
            {BENEFITS.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5 xl:gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white xl:h-11 xl:w-11">
                  <Check
                    className="h-6 w-6 text-[#22c55e] xl:h-7 xl:w-7"
                    strokeWidth={3.4}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[1.2rem] font-extrabold leading-snug tracking-[-0.02em] text-white xl:text-[1.38rem]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.95rem] font-medium leading-snug text-white/82 xl:text-[1.05rem]">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <div className="mb-5 h-px bg-white/70" />
          <h3 className="text-center text-[1rem] font-extrabold leading-snug tracking-[-0.02em] text-white xl:text-[1.08rem]">
            Qui est derrière Couverture Mutuelle&nbsp;?
          </h3>
          <div className="mt-7 flex items-stretch gap-2.5 xl:mt-8">
            <div className="min-w-0 flex-1 bg-white px-3 py-2.5 text-[#3b0764] xl:px-3.5 xl:py-3">
              <p className="text-[0.82rem] font-extrabold leading-snug xl:text-[0.88rem]">
                Je suis Valentine, fondatrice de Couverture Mutuelle.
              </p>
              <p className="mt-1.5 text-[0.78rem] font-medium leading-snug text-[#3f3f46] xl:text-[0.84rem]">
                Depuis 8 ans, je travaille aux côtés de courtiers en assurance
                santé.
              </p>
              <p className="mt-1.5 text-[0.78rem] font-medium leading-snug text-[#3f3f46] xl:text-[0.84rem]">
                J’ai créé ce service pour une raison simple&nbsp;: aider les
                seniors à trouver le juste prix pour leur mutuelle, en toute
                transparence.
              </p>
              <p className="mt-1.5 text-[0.78rem] font-medium leading-snug text-[#3f3f46] xl:text-[0.84rem]">
                Nous travaillons uniquement avec des courtiers partenaires
                sélectionnés et immatriculés à l’ORIAS.
              </p>
              <p className="mt-1.5 text-[0.8rem] font-extrabold leading-snug">
                — Valentine, fondatrice
              </p>
            </div>
            <div className="relative w-[clamp(8rem,28%,12rem)] shrink-0 self-stretch overflow-hidden rounded-2xl">
              <Image
                src="/images/valentine-fondatrice.jpg"
                alt="Valentine, fondatrice de Couverture Mutuelle"
                fill
                sizes="(min-width: 1536px) 240px, (min-width: 1280px) 208px, 176px"
                className="object-cover object-[center_18%]"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
