"use client";

import { useEffect, useState } from "react";

type Props = {
  onDone: () => void;
};

export function StepAnalyzing({ onDone }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const duration = 2800;
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(timer);
        onDone();
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [onDone]);

  return (
    <div className="py-8 text-center sm:py-12">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Nous analysons votre profil
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 sm:text-base">
        Nous préparons les informations utiles pour un conseiller spécialisé.
        Aucune donnée n’est envoyée pour le moment.
      </p>
      <div className="mx-auto mt-8 h-2 max-w-sm overflow-hidden rounded-full bg-brand-soft">
        <div
          className="h-full rounded-full bg-brand transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-zinc-500">{progress} %</p>
    </div>
  );
}
