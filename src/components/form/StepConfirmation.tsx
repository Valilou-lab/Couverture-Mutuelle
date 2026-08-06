"use client";

type Props = {
  onRestart: () => void;
};

export function StepConfirmation({ onRestart }: Props) {
  return (
    <div className="py-6 text-center sm:py-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-success">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Demande enregistrée (temporaire)
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
        Merci. Votre demande de devis a bien été préparée côté interface. Aucune
        donnée n’a encore été transmise à un partenaire. Un conseiller pourra
        vous rappeler dès que l’envoi des leads sera connecté.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-8 min-h-12 rounded-full bg-brand px-8 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
      >
        Recommencer le formulaire
      </button>
    </div>
  );
}
