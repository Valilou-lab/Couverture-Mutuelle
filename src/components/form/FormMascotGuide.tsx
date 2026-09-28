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
  isFirstStep?: boolean;
};

export function FormMascotGuide({
  step,
  offersCount = null,
  featured = false,
  isFirstStep = false,
}: Props) {
  const content = getFormMascotContent(step, { isFirstStep });
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(content);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const next = getFormMascotContent(step, { isFirstStep });
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
  }, [isFirstStep, step]);

  if (!display) return null;

  const message = display.lines.join(" ");

  return (
    <aside
      key={animKey}
      className={`form-mascot-guide w-full overflow-hidden rounded-2xl bg-brand-soft/80 ${
        featured ? "mt-3 sm:mt-4" : "mt-5 sm:mt-6"
      }`}
      aria-live="polite"
    >
      <div
        className={`grid items-stretch transition-all duration-300 ease-out ${
          featured
            ? "min-h-[10.5rem] grid-cols-[minmax(8.5rem,44%)_1fr] sm:min-h-[12rem]"
            : "min-h-[8.75rem] grid-cols-[minmax(8rem,44%)_1fr] sm:min-h-[10.5rem]"
        } ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        <div className="relative min-h-0 overflow-hidden">
          <div className="absolute inset-0 scale-[1.22]">
            {/* eslint-disable-next-line @next/next/no-img-element -- mascot PNGs */}
            <img
              src={getMascotPoseSrc(display.pose)}
              alt=""
              className={`form-mascot-pose h-full w-full select-none object-cover object-[52%_center] drop-shadow-[0_8px_14px_rgba(15,15,20,0.14)] ${
                step === "analyzing" ? "form-mascot-searching" : ""
              } ${visible ? "form-mascot-pop" : ""}`}
              draggable={false}
            />
          </div>
        </div>

        <div className="flex min-w-0 items-center px-3 py-2.5 pr-3.5 font-baloo sm:px-4 sm:py-3">
          <div className="min-w-0">
            <p
              className={`font-bold leading-tight tracking-tight text-[#3b0764] ${
                featured
                  ? "text-[1.05rem] sm:text-xl"
                  : "text-[1.05rem] sm:text-lg"
              }`}
            >
              {display.title}
            </p>
            {step === "contact" && offersCount != null ? (
              <p className="mt-1 text-[0.8125rem] font-semibold leading-snug text-zinc-700 sm:text-sm">
                J’ai trouvé{" "}
                <strong className="font-extrabold text-brand tabular-nums">
                  {offersCount}
                </strong>{" "}
                offres dans votre région.
              </p>
            ) : null}
            {step === "confirmation" ? (
              <p className="mt-1 text-[0.8125rem] font-semibold leading-snug text-zinc-700 sm:text-sm">
                Un conseiller Couverture Mutuelle va vous appeler dans quelques
                minutes pour finaliser votre comparaison et vous présenter{" "}
                <strong className="font-extrabold text-brand">vos offres</strong>
                .
              </p>
            ) : message ? (
              <p className="mt-1 text-[0.8125rem] font-semibold leading-snug text-zinc-700 sm:text-sm">
                {message}
              </p>
            ) : null}
            {display.reassurance ? (
              <p className="mt-1 text-[0.75rem] font-medium leading-snug text-zinc-500 sm:text-[0.8125rem]">
                {display.reassurance}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
