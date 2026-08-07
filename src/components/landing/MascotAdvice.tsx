import Image from "next/image";

const priorities = [
  "Prix",
  "Hospitalisation",
  "Dentaire",
  "Optique",
  "Soins courants",
  "Audition",
  "Médecines douces",
];

export function MascotAdvice() {
  return (
    <section
      id="conseil-mascotte"
      className="scroll-mt-24 bg-white px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-center md:justify-center md:gap-5 lg:gap-10">
        <div className="shrink-0">
          <Image
            src="/mascotte-cape.png"
            alt="Mascotte Couverture Mutuelle"
            width={448}
            height={481}
            className="h-auto w-40 sm:w-48 md:w-52 lg:w-56"
            priority={false}
          />
        </div>

        <div className="relative w-full max-w-xl">
          <div
            className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[14px] border-b-[16px] border-x-transparent border-b-[#7c3aed] md:top-10 md:-left-3 md:translate-x-0 md:border-x-0 md:border-y-[12px] md:border-r-[16px] md:border-y-transparent md:border-r-[#7c3aed] md:border-b-0"
            aria-hidden="true"
          />

          <blockquote className="rounded-[2rem] bg-gradient-to-br from-[#7c3aed] via-brand to-[#5b21b6] px-5 py-6 text-white shadow-[0_22px_50px_-18px_rgba(109,40,217,0.65)] sm:px-7 sm:py-7">
            <p className="font-baloo text-center text-xl font-bold leading-tight tracking-tight sm:text-left sm:text-2xl lg:text-[1.7rem]">
              Nos conseillers chercheront toujours la{" "}
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[#fde68a]">
                meilleure offre
              </span>{" "}
              parmi + de 3000 références.
            </p>

            <p className="mt-3 text-center font-baloo text-sm text-violet-100 sm:text-left sm:text-base">
              Selon votre profil, entre :
            </p>

            <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {priorities.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white px-3 py-1.5 font-baloo text-sm font-semibold text-brand shadow-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
