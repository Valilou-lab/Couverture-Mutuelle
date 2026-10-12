"use client";

import { useSeniorForm } from "./seniorForm";

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
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

  if (senior) {
    const label = `Question ${safeCurrent} / ${safeTotal}`;
    const labelClass =
      "pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-[0.95rem] font-bold tabular-nums";
    return (
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
    </div>
  );
}
