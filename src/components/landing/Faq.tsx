"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Le comparatif est-il vraiment gratuit ?",
    answer:
      "Oui. Le formulaire et l’accompagnement initial sont gratuits. Vous ne payez rien pour comparer et être rappelé par un conseiller.",
  },
  {
    question: "Êtes-vous une mutuelle ?",
    answer:
      "Non. Couverture Mutuelle est un service d’orientation qui vous aide à comparer des offres via des partenaires spécialisés. Nous ne sommes pas un assureur.",
  },
  {
    question: "Puis-je comparer si j’ai déjà une mutuelle ?",
    answer:
      "Oui. Beaucoup de demandes concernent un changement ou une optimisation de couverture existante, sans engagement de votre part.",
  },
  {
    question: "Comment sont utilisées mes données ?",
    answer:
      "Elles servent uniquement au traitement de votre demande de devis et au rappel éventuel par un conseiller. Vous pouvez demander leur retrait à conseiller.couverturemutuelle@gmail.com.",
  },
  {
    question: "Vais-je recevoir un tarif garanti en ligne ?",
    answer:
      "Non. Les économies évoquées sont indicatives. Un tarif personnalisé dépend de votre profil, de votre localisation et des garanties souhaitées.",
  },
  {
    question: "Combien de temps prend le formulaire ?",
    answer:
      "La moyenne des utilisateurs est de moins de 2 minutes.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-surface px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Questions fréquentes
          </h2>
        </div>
        <div className="mt-8 space-y-3">
          {faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-[1.25rem] border border-border bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span className="text-sm font-semibold text-foreground sm:text-[15px]">
                    {item.question}
                  </span>
                  <span className="text-brand" aria-hidden="true">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <p className="border-t border-border px-4 py-4 text-sm leading-relaxed text-zinc-600 sm:px-5">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
