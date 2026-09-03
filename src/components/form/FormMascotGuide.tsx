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
          featured
            ? "min-h-[10.5rem] gap-3 py-3 sm:min-h-[12rem] sm:gap-2 sm:py-3.5"
            : "h-[8.75rem] sm:h-[10.5rem]"
        } ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        {/* Moitié gauche — personnage entier, dépasse légèrement haut/bas */}
        <div
          className={`relative flex shrink-0 items-center justify-center self-stretch overflow-visible ${
            featured
              ? "w-[38%] sm:w-[46%]"
              : "w-1/2"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- mascot PNGs */}
          <img
            src={getMascotPoseSrc(display.pose)}
            alt=""
            className={`form-mascot-pose relative z-[1] -mt-2 -ml-5 block h-[10.75rem] w-[8.25rem] shrink-0 select-none object-cover object-[52%_center] drop-shadow-[0_10px_18px_rgba(15,15,20,0.16)] sm:-mt-2.5 sm:ml-1.5 sm:h-[12.5rem] sm:w-auto sm:max-w-none sm:object-contain sm:object-center ${
              featured ? "h-[10.5rem] sm:h-[13.5rem]" : ""
            } ${step === "analyzing" ? "form-mascot-searching" : ""} ${
              visible ? "form-mascot-pop" : ""
            }`}
            draggable={false}
          />
        </div>

        {/* Texte — au-dessus de la mascotte, sans recouvrement sur mobile */}
        <div
          className={`relative z-[2] flex min-w-0 items-center pr-2.5 sm:pr-3 ${
            featured
              ? "w-[62%] translate-x-0 pl-3 sm:w-[54%] sm:-translate-x-3 sm:pl-0 sm:-translate-y-1"
              : "w-1/2 translate-x-0 pl-4 -translate-y-2 sm:-translate-x-7 sm:pl-0 sm:-translate-y-2.5"
          }`}
        >
          <div
            className={`text-left font-nunito ${
              featured
                ? "max-w-none pr-1"
                : "max-w-[13rem] sm:max-w-[15rem]"
            }`}
          >
            <p
              className={`font-bold leading-tight text-[#3b0764] ${
                featured
                  ? "text-[0.9375rem] sm:text-base"
                  : "text-base sm:text-lg"
              }`}
            >
              {display.title}
            </p>
            {step === "contact" && offersCount != null ? (
              <p className="mt-0.5 text-sm font-semibold leading-snug text-zinc-700 sm:text-[0.9375rem]">
                J’ai trouvé{" "}
                <strong className="font-extrabold text-brand tabular-nums">
                  {offersCount}
                </strong>{" "}
                offres dans
                <br />
                votre région.
              </p>
            ) : null}
            {step === "confirmation" ? (
              <p className="mt-1 text-[0.8125rem] font-semibold leading-snug text-zinc-700 sm:text-sm">
                Un conseiller Couverture Mutuelle va vous appeler dans quelques
                minutes pour finaliser votre comparaison et vous présenter{" "}
                <strong className="font-extrabold text-brand">vos offres</strong>
                .
              </p>
            ) : (
              display.lines.map((line) => (
                <p
                  key={line}
                  className="mt-0.5 text-sm font-semibold leading-snug text-zinc-700 sm:text-[0.9375rem]"
                >
                  {line}
                </p>
              ))
            )}
            {display.reassurance ? (
              <p className="mt-1 text-xs font-medium leading-snug text-zinc-500 sm:text-sm">
                {display.reassurance}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
