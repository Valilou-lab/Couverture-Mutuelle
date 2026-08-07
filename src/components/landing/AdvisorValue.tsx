"use client";

import { useEffect, useState } from "react";

const aloneItems = [
  "Exclusions cachées",
  "Délais de carence méconnus",
  "Plafonds trop bas",
  "Remboursements réels décevants",
];

const advisorItems = [
  "Les exclusions et zones grises",
  "Les délais de carence",
  "Les remboursements réels",
  "Les plafonds et renforts utiles",
  "Les offres disponibles pour votre profil",
];

const ALONE_LABEL = "SEUL EN LIGNE";
const ADVISOR_LABEL = "AVEC UN CONSEILLER";

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0 text-[#fb7185]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path
        d="M4.5 10.5l3.5 3.5 7.5-8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AloneTypingLabel() {
  const [text, setText] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    if (media.matches) {
      setText(ALONE_LABEL);
      return;
    }

    let index = 0;
    let deleting = false;
    let timeoutId = 0;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setText(ALONE_LABEL.slice(0, index));
        if (index >= ALONE_LABEL.length) {
          deleting = true;
          timeoutId = window.setTimeout(tick, 1600);
          return;
        }
        timeoutId = window.setTimeout(tick, 85);
        return;
      }

      index -= 1;
      setText(ALONE_LABEL.slice(0, Math.max(index, 0)));
      if (index <= 0) {
        deleting = false;
        timeoutId = window.setTimeout(tick, 450);
        return;
      }
      timeoutId = window.setTimeout(tick, 45);
    };

    timeoutId = window.setTimeout(tick, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <p
      className="min-h-[1.6em] font-manrope text-lg font-extrabold uppercase tracking-[0.08em] text-violet-100 sm:text-xl"
      aria-label={ALONE_LABEL}
    >
      <span>{text}</span>
      {!reducedMotion ? (
        <span
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-violet-100 align-baseline coverage-speech-caret"
          aria-hidden="true"
        />
      ) : null}
    </p>
  );
}

function AdvisorTypingLabel() {
  const [text, setText] = useState("");
  const [complete, setComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    if (media.matches) {
      setText(ADVISOR_LABEL);
      setComplete(true);
      return;
    }

    let index = 0;
    let deleting = false;
    let timeoutId = 0;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setText(ADVISOR_LABEL.slice(0, index));
        setComplete(index >= ADVISOR_LABEL.length);
        if (index >= ADVISOR_LABEL.length) {
          deleting = true;
          timeoutId = window.setTimeout(tick, 1800);
          return;
        }
        timeoutId = window.setTimeout(tick, 85);
        return;
      }

      setComplete(false);
      index -= 1;
      setText(ADVISOR_LABEL.slice(0, Math.max(index, 0)));
      if (index <= 0) {
        deleting = false;
        timeoutId = window.setTimeout(tick, 450);
        return;
      }
      timeoutId = window.setTimeout(tick, 45);
    };

    timeoutId = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <p
      className="flex min-h-[1.6em] flex-wrap items-center gap-2 font-manrope text-lg font-extrabold uppercase tracking-[0.08em] text-emerald-400 sm:text-xl"
      aria-label={ADVISOR_LABEL}
    >
      <span className="inline-flex items-center">
        <span>{text}</span>
        {!reducedMotion && !complete ? (
          <span
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-emerald-400 align-baseline coverage-speech-caret"
            aria-hidden="true"
          />
        ) : null}
      </span>
      {complete ? (
        <span className="text-[1.15em] leading-none" aria-hidden="true">
          👍
        </span>
      ) : null}
    </p>
  );
}

export function AdvisorValue() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#4c1d95] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200 sm:text-sm">
            Pourquoi parler à un conseiller&nbsp;?
          </p>
          <h2 className="mt-3 font-manrope text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
            Un accompagnement humain change tout
          </h2>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-white/10 px-5 py-6 sm:px-6 sm:py-7">
            <AloneTypingLabel />
            <p className="mt-2 text-base font-bold leading-snug sm:text-lg">
              Vous comparez uniquement le prix
            </p>
            <ul className="mt-5 space-y-3">
              {aloneItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-snug text-violet-100 sm:text-[0.9375rem]"
                >
                  <CrossIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-violet-200/55 bg-white/[0.06] px-5 py-6 sm:px-6 sm:py-7">
            <AdvisorTypingLabel />
            <p className="mt-2 text-base font-bold leading-snug sm:text-lg">
              Vous comparez ce qui compte vraiment
            </p>
            <ul className="mt-5 space-y-3">
              {advisorItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-snug text-white sm:text-[0.9375rem]"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="offers-count-blink mx-auto mt-8 max-w-2xl text-center text-sm font-semibold leading-relaxed text-white sm:mt-10 sm:text-base">
          Une mutuelle moins chère n’est pas toujours la meilleure.
        </p>

        <div className="mt-5 flex justify-center sm:mt-6">
          <a
            href="#devis"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c4b5fd] px-7 font-sora text-sm font-semibold text-white transition hover:bg-[#ddd6fe] hover:text-[#4c1d95] sm:min-h-[3.25rem] sm:px-8 sm:text-base"
          >
            Parler à un conseiller
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
