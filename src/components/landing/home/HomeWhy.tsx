import Image from "next/image";

const H2 =
  "text-balance text-center font-poppins text-[clamp(1.4rem,5.2vw,1.85rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]";
const TEXT = "text-[1.05rem] text-zinc-700";
const GRADIENT =
  "linear-gradient(90deg, #6d35e0 0%, #9b4ff0 35%, #c64fe0 60%, #ea7a86 100%)";

const REASONS = [
  "Les tarifs augmentent avec l’âge : après 55 ans, chaque tranche d’âge coûte plus cher.",
  "Un contrat signé il y a longtemps n’est souvent plus adapté à vos besoins d’aujourd’hui.",
  "Une mutuelle moins chère n’est pas toujours la meilleure : un conseiller compare les garanties, pas seulement le prix.",
] as const;

/** « Pourquoi comparer maintenant » block for the homepage, styled like RacWhy. */
export function HomeWhy() {
  return (
    <section aria-labelledby="pourquoi-titre" className="mx-auto grid max-w-[960px] gap-5 pt-12">
      <div className="grid gap-6 rounded-[28px] border border-[#ddd6fe] bg-white p-4 shadow-[0_24px_60px_-30px_rgba(59,7,100,0.45)] min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] min-[860px]:items-center min-[860px]:gap-8 min-[860px]:p-6">
        <Image
          src="/images/hero-couple-economisez-v2.png"
          alt="Couple de retraités souriants"
          width={1024}
          height={535}
          sizes="(min-width: 960px) 430px, (min-width: 640px) 600px, 100vw"
          className="block aspect-[16/9] h-auto w-full rounded-[20px] object-cover min-[860px]:aspect-[4/5]"
        />
        <div className="grid gap-4">
          <h2 id="pourquoi-titre" className={`${H2} min-[860px]:text-left`}>
            Pourquoi comparer votre mutuelle maintenant&nbsp;?
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {REASONS.map((reason) => (
              <li
                key={reason}
                className={`${TEXT} relative pl-7 before:absolute before:left-0 before:top-[0.55em] before:h-3 before:w-3 before:rounded-full before:bg-brand before:content-['']`}
              >
                {reason}
              </li>
            ))}
          </ul>
          <div
            className="rounded-[20px] p-[18px] text-center font-semibold text-white"
            style={{ backgroundImage: GRADIENT }}
          >
            Les seniors qui comparent économisent en moyenne
            <strong className="block text-[1.6rem] font-extrabold">200 à 400 €/an</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
