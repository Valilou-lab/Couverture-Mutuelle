import { SavingsQuoteForm } from "@/components/form/SavingsQuoteForm";

export function SavingsQuoteSection() {
  return (
    <section
      id="savings-devis"
      className="scroll-mt-24 bg-gradient-to-b from-white via-[#f5f2ff] to-surface px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-xl lg:max-w-2xl">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Devis personnalisés
          </p>
          <h2 className="mt-2 font-manrope text-2xl font-bold tracking-tight text-[#3b0764] sm:text-3xl">
            Finalisez votre demande de devis
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
            Vos informations du calculateur sont déjà enregistrées. Il ne reste
            que quelques questions pour recevoir vos propositions.
          </p>
        </div>
        <SavingsQuoteForm />
      </div>
    </section>
  );
}
