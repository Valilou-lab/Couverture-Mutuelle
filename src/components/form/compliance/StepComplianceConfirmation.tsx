"use client";

export function StepComplianceConfirmation() {
  return (
    <div className="relative py-4 text-center sm:py-6">
      <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wide text-amber-800">
        Démonstration
      </p>
      <h2 className="font-poppins text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
        Dossier confirmé — aucun lead envoyé
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-snug text-zinc-700 sm:text-base">
        Dans la version finale, votre demande serait transmise uniquement aux
        organismes éligibles. Ici, rien n’a été envoyé à Vertikl ni à un
        partenaire.
      </p>
    </div>
  );
}
