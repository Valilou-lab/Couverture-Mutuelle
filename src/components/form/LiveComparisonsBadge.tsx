"use client";

import { useEffect, useState } from "react";

const MIN = 12;
const MAX = 34;
const COUNT_TICK_MS = 3000;
const WIN_EVERY_MS = 20_000;
const WIN_VISIBLE_MS = 4500;

function nextCount(current: number): number {
  const direction = Math.random() > 0.45 ? 1 : -1;
  const delta = Math.random() > 0.7 ? 2 : 1;
  const next = current + direction * delta;
  if (next < MIN) return MIN + 1;
  if (next > MAX) return MAX - 1;
  return next;
}

type Props = {
  compact?: boolean;
};

export function LiveComparisonsBadge({ compact = false }: Props) {
  const [count, setCount] = useState(19);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((current) => nextCount(current));
    }, COUNT_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let hideTimer: number | undefined;

    const show = () => {
      setShowWin(true);
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        setShowWin(false);
      }, WIN_VISIBLE_MS);
    };

    const loopTimer = window.setInterval(show, WIN_EVERY_MS);

    return () => {
      window.clearInterval(loopTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={`inline-flex max-w-full items-center justify-center gap-2 rounded-full border transition-colors duration-300 ${
        showWin
          ? "border-emerald-200 bg-emerald-50"
          : "border-sky-200 bg-sky-50"
      } ${
        compact
          ? "px-2.5 py-1 text-xs sm:px-3.5 sm:py-1.5 sm:text-sm"
          : "mx-auto mb-4 px-3.5 py-1.5 text-sm sm:mb-5"
      }`}
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
            showWin ? "bg-emerald-400" : "bg-pink-400"
          }`}
        />
        <span
          className={`live-dot relative inline-flex h-2.5 w-2.5 rounded-full ${
            showWin ? "bg-emerald-500" : "bg-pink-500"
          }`}
        />
      </span>
      <p
        key={showWin ? "win" : "count"}
        className="text-center leading-snug text-foreground animate-[form-step-in_280ms_ease-out]"
      >
        {showWin ? (
          <>
            <strong className="font-bold text-emerald-700">1 personne</strong>{" "}
            <span className={compact ? "hidden sm:inline" : undefined}>
              vient de trouver mieux&nbsp;!
            </span>
            <span className={compact ? "sm:hidden" : "hidden"}>
              a trouvé mieux&nbsp;!
            </span>
          </>
        ) : (
          <>
            <strong className="font-bold text-sky-600">{count} personnes</strong>{" "}
            <span className={compact ? "hidden sm:inline" : undefined}>
              comparent en ce moment
            </span>
            <span className={compact ? "sm:hidden" : "hidden"}>comparent</span>
          </>
        )}
      </p>
    </div>
  );
}
