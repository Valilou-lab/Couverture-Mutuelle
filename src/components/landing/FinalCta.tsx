export function FinalCta() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Prêt(e) à comparer les offres ?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-violet-100 sm:text-base">
            Remplissez le formulaire en quelques minutes. Un conseiller pourra
            ensuite vous recontacter.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="#devis"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 font-sora text-sm font-semibold text-brand transition hover:bg-violet-50"
            >
              Comparer les offres
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
