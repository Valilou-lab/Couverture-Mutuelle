"use client";

/** Local confirmation only — no Vertikl / leads / CAPI. */
export function StepConfirmationV2() {
  return (
    <div className="relative py-4 text-center sm:py-6">
      <p className="mb-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wide text-violet-800">
        Scaffold V2
      </p>
      <h2 className="font-poppins text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
        Dossier confirmé — aucun lead envoyé
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-snug text-zinc-700 sm:text-base">
        Scaffold V2 : éligibilité + consentement serveur via `/api/v2/*`, OTP
        local. Pas d’appel à `/api/leads`, Vertikl, Twilio ni Lead Meta/GTM.
        Ces branchements viendront ensuite sur `/api/v2/leads`.
      </p>
    </div>
  );
}
