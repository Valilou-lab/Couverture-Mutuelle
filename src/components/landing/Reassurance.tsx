const points = [
  {
    title: "Données protégées",
    text: "Vos informations sont traitées avec soin et destinées uniquement au suivi de votre demande de devis.",
  },
  {
    title: "Pas de réutilisation commerciale tierce",
    text: "Vos données ne sont pas revendues ni réutilisées à des fins commerciales non liées à votre demande.",
  },
  {
    title: "Droit de retrait",
    text: "Vous pouvez demander la suppression de vos données à conseiller.couverturemutuelle@gmail.com.",
  },
  {
    title: "Service gratuit",
    text: "La comparaison et l’accompagnement initial sont gratuits pour vous.",
  },
  {
    title: "Aucun engagement",
    text: "Vous restez libre à chaque étape : aucune obligation de souscrire.",
  },
  {
    title: "Partenaires spécialisés",
    text: "Nous travaillons avec des partenaires spécialisés en mutuelle santé pour préparer des propositions adaptées.",
  },
];

export function Reassurance() {
  return (
    <section id="reassurance" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Réassurance
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Un service transparent, conçu pour vous
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
            >
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
