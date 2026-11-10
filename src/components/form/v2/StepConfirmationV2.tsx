"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const CONFETTI_COLORS = [
  "#6d28d9",
  "#a855f7",
  "#c4b5fd",
  "#f472b6",
  "#fbbf24",
  "#34d399",
  "#ffffff",
];

function fireConfirmationConfetti() {
  const defaults = {
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
    zIndex: 80,
  };

  confetti({
    ...defaults,
    particleCount: 90,
    spread: 72,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.28 },
  });

  window.setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 55,
      angle: 60,
      spread: 58,
      startVelocity: 42,
      origin: { x: 0.08, y: 0.55 },
    });
    confetti({
      ...defaults,
      particleCount: 55,
      angle: 120,
      spread: 58,
      startVelocity: 42,
      origin: { x: 0.92, y: 0.55 },
    });
  }, 180);
}

/**
 * V2 confirmation — same visual universe as the main LP.
 * Lead wiring remains via the existing V2 adapters (unchanged).
 */
export function StepConfirmationV2() {
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setTimeout(() => {
      fireConfirmationConfetti();
    }, 120);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative py-4 text-center sm:py-6">
      <h2 className="font-poppins text-xl font-extrabold tracking-tight text-brand sm:text-2xl">
        C&apos;est fait&nbsp;! Votre demande de devis est en cours.&nbsp;✅
      </h2>
      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-[#ddd6fe] bg-[#f5f0ff] px-4 py-4 text-center text-[#3b0764] sm:mt-5 sm:px-5">
        <p className="font-poppins text-sm font-bold leading-snug sm:text-base">
          Gardez votre téléphone à proximité
        </p>
        <p className="mt-1.5 text-sm font-medium leading-snug text-zinc-700">
          Votre conseiller vous appellera dans les{" "}
          <strong className="font-bold text-[#3b0764]">1 à 5 minutes</strong>,
          depuis un numéro de téléphone français classique.
        </p>
      </div>

      <p className="mx-auto mt-3 max-w-md px-1 text-center text-xs font-medium leading-snug text-zinc-500 sm:text-[0.8125rem]">
        Pensez à décrocher même si le numéro n’est pas enregistré dans vos
        contacts.
      </p>

      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center sm:mt-5 sm:px-5">
        <p className="font-poppins text-sm font-bold leading-snug text-emerald-900 sm:text-base">
          3 conseils pour bien choisir votre mutuelle&nbsp;💜
        </p>
        <p className="mt-2 text-sm font-medium leading-snug text-emerald-900/80">
          Pendant l&apos;appel avec votre conseiller, pensez à vérifier&nbsp;:
        </p>
        <ul className="mt-2 list-none space-y-1.5 p-0 text-sm font-medium leading-snug text-emerald-900/80">
          <li>
            <strong className="font-bold text-emerald-900">Votre budget</strong>
            &nbsp;: combien payez-vous aujourd&apos;hui&nbsp;?
          </li>
          <li>
            <strong className="font-bold text-emerald-900">Vos priorités</strong>
            &nbsp;: dentaire, optique, hospitalisation…
          </li>
          <li>
            <strong className="font-bold text-emerald-900">Vos garanties</strong>
            &nbsp;: lesquelles utilisez-vous vraiment&nbsp;?
          </li>
        </ul>
        <p className="mt-3 text-sm font-medium leading-snug text-emerald-900/80">
          <strong className="font-bold text-emerald-900">Un bon conseil</strong>
          &nbsp;: posez toutes vos questions pour trouver une mutuelle adaptée,
          sans payer pour le superflu&nbsp;!
        </p>
      </div>
    </div>
  );
}
