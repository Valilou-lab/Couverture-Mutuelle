const tariffRows = [
  { age: "55 – 59 ans", price: "≈ 45 à 70 €" },
  { age: "60 – 64 ans", price: "≈ 55 à 90 €" },
  { age: "65 – 69 ans", price: "≈ 70 à 120 €" },
  { age: "70 – 74 ans", price: "≈ 80 à 140 €" },
  { age: "75 ans et +", price: "≈ 95 à 180 €" },
];

export function PricingGuide() {
  return (
    <section
      id="tarifs-moyens"
      className="scroll-mt-24 bg-white px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Tarifs moyens
          </p>
          <h2 className="mt-2 font-manrope text-2xl font-bold tracking-tight text-[#3b0764] sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
            Combien coûte une mutuelle senior&nbsp;?
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
            Ces prix sont donnés à titre indicatif. Ils varient selon votre âge,
            votre département, le niveau de garanties souhaité et votre profil.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#devis"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-brand px-7 font-sora text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(109,40,217,0.55)] transition hover:brightness-105"
            >
              Recevoir un tarif personnalisé
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_18px_40px_-24px_rgba(76,29,149,0.35)]">
          <div className="flex items-center justify-between gap-4 bg-[#4c1d95] px-5 py-4 sm:px-6">
            <span className="text-sm font-semibold text-white sm:text-base">
              Âge
            </span>
            <span className="text-sm font-semibold text-white sm:text-base">
              Tarif indicatif / mois
            </span>
          </div>

          <ul>
            {tariffRows.map((row, index) => (
              <li
                key={row.age}
                className={`flex items-center justify-between gap-4 px-5 py-4 sm:px-6 ${
                  index % 2 === 1 ? "bg-brand-soft/40" : "bg-white"
                }`}
              >
                <span className="text-sm font-medium text-[#3b0764] sm:text-base">
                  {row.age}
                </span>
                <span className="text-sm font-semibold text-brand sm:text-base">
                  {row.price}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-2.5 border-t border-border bg-brand-soft/50 px-5 py-4 sm:px-6">
            <span className="text-base leading-none" aria-hidden="true">
              💡
            </span>
            <p className="text-sm leading-relaxed text-[#4c1d95]">
              Les seniors qui comparent économisent en moyenne{" "}
              <strong className="font-bold">200 à 400&nbsp;€/an.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
