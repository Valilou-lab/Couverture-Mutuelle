import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/landing/LegalPage";

const ARTICLES: Record<
  string,
  { title: string; content: string[]; readingTime: string }
> = {
  "pourquoi-comparer-sa-mutuelle": {
    title: "Pourquoi comparer sa mutuelle peut faire la différence",
    readingTime: "4 min",
    content: [
      "À garanties proches, deux contrats peuvent afficher des cotisations très différentes. Comparer permet d’éviter de surpayer pour une couverture inadaptée.",
      "Les écarts portent souvent sur l’hospitalisation, le dentaire, l’optique ou les plafonds annuels. Un conseiller aide à lire ces détails avant de décider.",
      "Cet article est un contenu temporaire : il sera enrichi avec vos textes définitifs.",
    ],
  },
  "hospitalisation-dentaire-optique": {
    title: "Hospitalisation, dentaire, optique : que prioriser ?",
    readingTime: "5 min",
    content: [
      "L’hospitalisation reste souvent le poste le plus sensible en cas de coup dur. Dentaire et optique génèrent surtout des restes à charge au quotidien.",
      "La bonne priorité dépend de votre âge, de votre historique de soins et de votre budget. Le formulaire vous aide à clarifier ces choix.",
      "Contenu temporaire à remplacer par vos articles éditoriaux.",
    ],
  },
  "changer-de-mutuelle-sans-stress": {
    title: "Changer de mutuelle sans stress : les étapes clés",
    readingTime: "4 min",
    content: [
      "Avant de changer, comparez les garanties utiles et vérifiez les éventuels délais de carence. Un accompagnement humain limite les mauvaises surprises.",
      "Vous n’avez aucune obligation de souscrire après une demande de devis. Prenez le temps d’évaluer les propositions.",
      "Page article temporaire — redirection prévue depuis le bas de la landing.",
    ],
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  return {
    title: article
      ? `${article.title} — Couverture Mutuelle`
      : "Article — Couverture Mutuelle",
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <LegalPage title={article.title}>
      <p className="text-xs font-medium text-zinc-500">
        Lecture {article.readingTime}
      </p>
      {article.content.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
