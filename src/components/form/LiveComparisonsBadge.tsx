"use client";

import { useEffect, useState } from "react";

const MIN = 12;
const MAX = 34;

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

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((current) => nextCount(current));
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50 ${
        compact
          ? "px-2.5 py-1 text-xs sm:px-3.5 sm:py-1.5 sm:text-sm"
          : "mx-auto mb-4 px-3.5 py-1.5 text-sm sm:mb-5"
      }`}
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-60" />
        <span className="live-dot relative inline-flex h-2.5 w-2.5 rounded-full bg-pink-500" />
      </span>
      <p className="text-center leading-snug text-foreground">
        <strong className="font-bold text-sky-600">{count} personnes</strong>{" "}
        <span className={compact ? "hidden sm:inline" : undefined}>
          comparent en ce moment
        </span>
        <span className={compact ? "sm:hidden" : "hidden"}>comparent</span>
      </p>
    </div>
  );
}
