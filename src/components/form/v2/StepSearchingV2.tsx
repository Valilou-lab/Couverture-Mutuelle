"use client";

import { useEffect, useState } from "react";
import { getMascotPoseSrc } from "@/components/form/mascotGuideConfig";
import { FormNavigation } from "@/components/form/FormNavigation";
import { SENIOR_ERROR } from "@/components/form/seniorForm";

const STATUS_LINES = [
  "Analyse de votre profil",
  "Recherche des organismes",
  "Offres disponibles",
] as const;

type Props = {
  errorMessage?: string | null;
  onRetry?: () => void;
};

/** Loading screen while `/api/v2/eligibility` is in flight. */
export function StepSearchingV2({
  errorMessage = null,
  onRetry,
}: Props) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (errorMessage) return;
    const id = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_LINES.length);
    }, 700);
    return () => window.clearInterval(id);
  }, [errorMessage]);

  if (errorMessage) {
    return (
      <div className="py-4 text-center sm:py-6">
        <h2 className="font-poppins text-[1.35rem] font-extrabold tracking-[-0.02em] text-[#3b0764]">
          Recherche interrompue
        </h2>
        <p className={`${SENIOR_ERROR} mt-3 text-center`} role="alert">
          {errorMessage}
        </p>
        {onRetry ? (
          <FormNavigation onNext={onRetry} nextLabel="Réessayer" />
        ) : null}
      </div>
    );
  }

  return (
    <div className="py-6 text-center sm:py-8" aria-live="polite" aria-busy="true">
      <h2 className="font-poppins text-[1.35rem] font-extrabold tracking-[-0.02em] text-brand sm:text-[1.5rem]">
        Nous recherchons les offres disponibles…
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[0.95rem] leading-snug text-zinc-600">
        Nous vérifions quels organismes correspondent à votre profil.
      </p>

      <div className="relative mx-auto mt-5 flex w-full max-w-[14rem] items-center justify-center sm:mt-6 sm:max-w-[16rem]">
        {/* eslint-disable-next-line @next/next/no-img-element -- mascot PNG */}
        <img
          src={getMascotPoseSrc("travaille")}
          alt=""
          className="form-mascot-pose form-mascot-searching block h-auto w-full select-none drop-shadow-[0_12px_20px_rgba(15,15,20,0.16)]"
          draggable={false}
        />
      </div>

      <p
        key={STATUS_LINES[statusIndex]}
        className="form-mascot-pop mt-5 text-[1rem] font-semibold text-[#3b0764]"
      >
        {STATUS_LINES[statusIndex]}
      </p>

      <div className="mt-5 flex justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand"
          aria-hidden="true"
        />
        <span className="sr-only">Chargement</span>
      </div>
    </div>
  );
}
