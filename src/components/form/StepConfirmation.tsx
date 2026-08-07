"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { FormMascotGuide } from "./FormMascotGuide";

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

export function StepConfirmation() {
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
      <FormMascotGuide step="confirmation" featured />

      <div className="mx-auto mt-5 max-w-md rounded-2xl border border-brand/20 bg-brand-soft/60 px-4 py-4 text-left text-[#3b0764] sm:px-5">
        <p className="font-nunito text-sm font-bold leading-snug sm:text-base">
          📞 Gardez votre téléphone à proximité
        </p>
        <p className="mt-1.5 font-nunito text-sm font-medium leading-snug text-zinc-700">
          Votre conseiller vous appellera dans les{" "}
          <strong className="font-bold text-[#3b0764]">1 à 5 minutes</strong>,
          depuis{" "}
          <span className="underline underline-offset-2">
            un numéro de téléphone français
          </span>{" "}
          classique (pas de 08, 09)
        </p>
      </div>

      <p className="mx-auto mt-3 max-w-md px-1 text-center text-xs font-medium leading-snug text-zinc-500 sm:text-[0.8125rem]">
        Pensez à décrocher même si le numéro n’est pas enregistré dans vos
        contacts.
      </p>
    </div>
  );
}
