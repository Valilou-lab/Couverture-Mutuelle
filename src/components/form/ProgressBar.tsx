"use client";

import { useSeniorForm } from "./seniorForm";

type ProgressBarProps = {
  current: number;
  total: number;
  /** `percent` shows a compact bar with % — used above the main LP form. */
  display?: "questions" | "percent";
};

export function ProgressBar({
  current,
  total,
  display = "questions",
}: ProgressBarProps) {
  const senior = useSeniorForm();
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(safeTotal, Math.max(1, current));
  const percent = Math.min(100, Math.round((safeCurrent / safeTotal) * 100));

  const gradient =
    percent < 35
      ? "linear-gradient(105deg, #7c3aed 0%, #8b5cf6 35%, #a855f7 70%, #c084fc 100%)"
      : percent < 70
        ? "linear-gradient(105deg, #7c3aed 0%, #9333ea 30%, #d946ef 65%, #f472b6 100%)"
        : "linear-gradient(105deg, #6d28d9 0%, #a855f7 25%, #d946ef 55%, #f472b6 80%, #fb7185 100%)";

  const lastQuestionNote =
    display === "percent" || safeCurrent !== safeTotal ? null : (
      <p className="mt-2 text-balance text-center text-[0.9rem] font-medium leading-snug text-zinc-600 sm:text-[0.95rem]">
        Vos données sont précieuses et seront utilisées uniquement pour vos
        devis
      </p>
    );

  if (display === "percent") {
    return (
      <div className="mb-3 flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_8px_20px_-12px_rgba(59,7,100,0.35)]">
        <div
          className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#ede9fe]"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression ${percent} pour cent`}
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="shrink-0 text-[0.95rem] font-extrabold tabular-nums text-[#3b0764]">
          {percent}&nbsp;%
        </span>
      </div>
    );
  }

  if (senior) {
    const label = `Question ${safeCurrent} / ${safeTotal}`;
    const labelClass =
      "pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-[0.95rem] font-bold tabular-nums";
    return (
      <div>
        <div
          className="relative h-8 overflow-hidden rounded-full bg-brand-soft"
          role="progressbar"
          aria-valuenow={safeCurrent}
          aria-valuemin={1}
          aria-valuemax={safeTotal}
          aria-label={`Question ${safeCurrent} sur ${safeTotal}`}
        >
          <span aria-hidden="true" className={`${labelClass} w-full text-[#3b0764]`}>
            {label}
          </span>
          {/* Filled part (with a white copy of the label), clipped to the progress. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-[clip-path] duration-500 ease-out motion-reduce:transition-none"
            style={{
              backgroundImage: gradient,
              clipPath: `inset(0 ${100 - percent}% 0 0 round 9999px)`,
            }}
          >
            <span className={`${labelClass} w-full text-white`}>{label}</span>
          </div>
        </div>
        {lastQuestionNote}
      </div>
    );
  }

  return (
    <div className="mb-4 lg:mb-4">
      <div
        className="relative h-7 overflow-hidden rounded-full bg-brand-soft shadow-inner sm:h-8 lg:h-6"
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-label={`Question ${safeCurrent} sur ${safeTotal}`}
      >
        <div
          className="relative h-full overflow-hidden rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${percent}%`,
            backgroundImage: gradient,
          }}
        />
        <span
          className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-xs font-bold tabular-nums sm:text-sm ${
            percent >= 45 ? "text-white drop-shadow-sm" : "text-[#3b0764]"
          }`}
        >
          Question {safeCurrent} / {safeTotal}
        </span>
      </div>
      {lastQuestionNote}
    </div>
  );
}
