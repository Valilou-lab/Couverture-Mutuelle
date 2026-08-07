import Link from "next/link";

const articles = [
  {
    slug: "pourquoi-comparer-sa-mutuelle",
    title: "Pourquoi comparer sa mutuelle peut faire la différence",
    excerpt:
      "À garanties proches, les écarts de cotisation peuvent être importants. Voici les points à vérifier avant de choisir.",
    readingTime: "4 min",
  },
  {
    slug: "hospitalisation-dentaire-optique",
    title: "Hospitalisation, dentaire, optique : que prioriser ?",
    excerpt:
      "Selon votre âge et votre situation, certains postes méritent un renfort. Un guide simple pour y voir clair.",
    readingTime: "5 min",
  },
  {
    slug: "changer-de-mutuelle-sans-stress",
    title: "Changer de mutuelle sans stress : les étapes clés",
    excerpt:
      "Résiliation, délais, documents… les bases à connaître avant de basculer vers une nouvelle couverture.",
    readingTime: "4 min",
  },
];

export function Articles() {
  return (
    <section id="articles" className="scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Articles
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Pour aller plus loin
          </h2>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">
            Contenu temporaire à remplacer par vos articles définitifs.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col rounded-[1.5rem] border border-border bg-white p-5 sm:p-6"
            >
              <p className="text-xs font-medium text-zinc-500">
                Lecture {article.readingTime}
              </p>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                {article.excerpt}
              </p>
              <Link
                href={`/articles/${article.slug}`}
                className="mt-5 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                Lire l’article
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
