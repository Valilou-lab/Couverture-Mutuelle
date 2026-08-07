"use client";

import { useEffect } from "react";
import { getMascotPoseSrc } from "./mascotGuideConfig";

type Props = {
  onDone: () => void;
};

export function StepAnalyzing({ onDone }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDone();
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="py-6 text-center sm:py-8">
      <h2 className="font-manrope text-xl font-bold tracking-tight text-brand sm:text-2xl">
        Analyse en cours
      </h2>

      <div className="relative mx-auto mt-5 flex w-full max-w-[14rem] items-center justify-center sm:mt-6 sm:max-w-[16rem]">
        {/* eslint-disable-next-line @next/next/no-img-element -- mascot PNG */}
        <img
          src={getMascotPoseSrc("travaille")}
          alt=""
          className="form-mascot-pose form-mascot-searching block h-auto w-full select-none drop-shadow-[0_12px_20px_rgba(15,15,20,0.16)]"
          draggable={false}
        />
      </div>

      <div className="mt-5 flex justify-center sm:mt-6">
        <span
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand"
          aria-hidden="true"
        />
        <span className="sr-only">Chargement</span>
      </div>
    </div>
  );
}
