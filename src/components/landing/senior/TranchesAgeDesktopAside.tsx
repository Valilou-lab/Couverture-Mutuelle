import Image from "next/image";
import { Check } from "lucide-react";

const BENEFITS = [
  "Le bon tarif, sans perdre les garanties qui comptent pour vous",
  "Aucune démarche pour changer : la résiliation est faite pour vous*",
  "Plusieurs propositions : vous choisissez, ou vous arrêtez quand vous voulez",
] as const;

/** Desktop-only reassurance column for `/tranches-age`. */
export function TranchesAgeDesktopAside() {
  return (
    <aside className="relative hidden min-h-full flex-col justify-between bg-[#6d28d9] px-8 py-10 text-white lg:flex xl:px-12 xl:py-12 2xl:px-14">
      <div>
        <h2 className="text-center font-extrabold leading-[1.12] tracking-[-0.03em] text-white [font-family:var(--font-inter-tranches),ui-sans-serif,sans-serif] text-[clamp(2.1rem,2.8vw,3.15rem)]">
          Obtenez gratuitement
        </h2>
        <ul className="mt-8 grid gap-5 xl:mt-10 xl:gap-6">
          {BENEFITS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3.5 text-[1.18rem] font-semibold leading-snug xl:text-[1.32rem]"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                <Check
                  className="h-5 w-5 text-[#22c55e]"
                  strokeWidth={3.2}
                  aria-hidden
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.98rem] font-medium leading-snug text-white/85 xl:text-[1.05rem]">
          * Dès que votre contrat actuel a plus d’un an.
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-2.5 h-px bg-white/70" />
        <h3 className="text-center text-[1rem] font-extrabold leading-snug tracking-[-0.02em] text-white xl:text-[1.08rem]">
          Qui est derrière Couverture Mutuelle&nbsp;?
        </h3>
        <div className="mt-2 flex items-stretch gap-2.5">
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
    </aside>
  );
}
