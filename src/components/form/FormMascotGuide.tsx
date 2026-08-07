"use client";

import { useEffect, useState } from "react";
import type { FormStepId } from "./types";
import {
  getFormMascotContent,
  getMascotPoseSrc,
} from "./mascotGuideConfig";

type Props = {
  step: FormStepId;
  /** Animated offers count for the contact step. */
  offersCount?: number | null;
  /** Slightly roomier layout on analyzing / confirmation. */
  featured?: boolean;
};

export function FormMascotGuide({
  step,
  offersCount = null,
  featured = false,
}: Props) {
  const content = getFormMascotContent(step);
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(content);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const next = getFormMascotContent(step);
    if (!next) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(next);
      setVisible(true);
      return;
    }

    setVisible(false);
    const id = window.setTimeout(() => {
      setDisplay(next);
      setAnimKey((key) => key + 1);
      setVisible(true);
    }, 130);
    return () => window.clearTimeout(id);
  }, [step]);

  if (!display) return null;

  return (
    <aside
      key={animKey}
      className={`form-mascot-guide relative w-full overflow-visible ${
        featured ? "mt-3 sm:mt-4" : "mt-5 sm:mt-6"
      }`}
      aria-live="polite"
    >
      {/* Fond du bloc — la mascotte peut dépasser par-dessus */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-soft/80"
        aria-hidden="true"
      />

      <div
        className={`relative flex items-center transition-all duration-300 ease-out ${
          featured ? "h-[9.5rem] sm:h-[11rem]" : "h-[8.75rem] sm:h-[10.5rem]"
        } ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        {/* Moitié gauche — personnage entier, dépasse légèrement haut/bas */}
        <div className="relative flex w-1/2 shrink-0 items-center justify-center self-stretch overflow-visible">
          {/* eslint-disable-next-line @next/next/no-img-element -- mascot PNGs */}
          <img
            src={getMascotPoseSrc(display.pose)}
            alt=""
            className={`form-mascot-pose relative z-10 -mt-1.5 ml-1.5 block w-auto max-w-none select-none object-contain drop-shadow-[0_10px_18px_rgba(15,15,20,0.16)] sm:-mt-2 sm:ml-2 ${
              featured
                ? "h-[11.75rem] sm:h-[13.25rem]"
                : "h-[10.75rem] sm:h-[12.25rem]"
            } ${step === "analyzing" ? "form-mascot-searching" : ""} ${
              visible ? "form-mascot-pop" : ""
            }`}
            draggable={false}
          />
        </div>

        {/* Texte compact — collé à la mascotte */}
        <div className="relative z-[1] flex min-w-0 w-1/2 -translate-x-5 -translate-y-2 items-center pr-2.5 sm:-translate-x-7 sm:-translate-y-2.5 sm:pr-3">
          <div className="max-w-[13rem] text-left sm:max-w-[15rem]">
            <p className="text-base font-bold leading-tight text-[#3b0764] sm:text-lg">
              {display.title}
            </p>
            {step === "contact" && offersCount != null ? (
              <p className="mt-0.5 text-sm leading-snug text-zinc-700 sm:text-[0.9375rem]">
                J’ai trouvé{" "}
                <strong className="font-bold text-brand tabular-nums">
                  {offersCount}
                </strong>{" "}
                offres dans
                <br />
                votre région.
              </p>
            ) : null}
            {display.lines.map((line) => (
              <p
                key={line}
                className="mt-0.5 text-sm leading-snug text-zinc-700 sm:text-[0.9375rem]"
              >
                {line}
              </p>
            ))}
            {display.reassurance ? (
              <p className="mt-1 text-xs leading-snug text-zinc-500 sm:text-sm">
                {display.reassurance}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
