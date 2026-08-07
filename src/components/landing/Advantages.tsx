import Image from "next/image";

export function Advantages() {
  return (
    <section
      id="pourquoi-comparer"
      className="scroll-mt-24 bg-surface px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Pourquoi comparer ?
          </p>
          <h2 className="mt-2 font-manrope text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
            Deux personnes à la retraite peuvent payer un prix très différent
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            À garanties égales, les écarts entre les mutuelles peuvent atteindre
            plusieurs centaines d’euros par an. Comparer, c’est s’assurer de
            payer le juste prix — et d’être vraiment bien remboursé.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Carte gauche — femme */}
          <article className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <Image
                src="/portrait-marie.png"
                alt="Portrait illustratif — Marie"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover object-top"
              />
              <div>
                <p className="font-semibold text-foreground">Marie, 67 ans</p>
                <p className="text-sm text-zinc-500">
                  Même garanties, même couverture
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-stretch gap-2 sm:gap-3">
              <div className="flex-1 rounded-2xl bg-zinc-100 px-3 py-3 text-center sm:px-4">
                <p className="text-xs font-medium text-zinc-500">Avant</p>
                <p className="mt-1 text-base font-bold text-foreground sm:text-lg">
                  95&nbsp;€/mois
                </p>
              </div>
              <div className="flex items-center text-brand" aria-hidden="true">
                →
              </div>
              <div className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-center sm:px-4">
                <p className="text-xs font-medium text-emerald-700">
                  Après comparaison
                </p>
                <p className="mt-1 text-base font-bold text-emerald-700 sm:text-lg">
                  74&nbsp;€/mois
                </p>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <span aria-hidden="true">↘</span>
              252&nbsp;€ économisés par an
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Exemple illustratif, non contractuel.
            </p>
          </article>

          {/* Carte droite — homme */}
          <article className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <Image
                src="/portrait-jean.png"
                alt="Portrait illustratif — Jean"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover object-[center_20%]"
              />
              <div>
                <p className="font-semibold text-foreground">Jean, 72 ans</p>
                <p className="text-sm text-zinc-500">
                  Payait peu, mais mal remboursé
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-brand-soft/70 px-4 py-4">
              <div className="flex gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  !
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  <strong className="font-bold">65&nbsp;€/mois</strong> — mais
                  des remboursements très faibles sur l’hospitalisation, le
                  dentaire et l’optique. Une « mutuelle pas chère » peut coûter
                  très cher en cas de coup dur.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              Le prix seul ne fait pas une bonne mutuelle.
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Exemple illustratif, non contractuel.
            </p>
          </article>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#devis"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 font-sora text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
          >
            Je compare gratuitement
          </a>
        </div>
      </div>
    </section>
  );
}
