"use client";

import { Timer } from "lucide-react";

type ProgressBarProps = {
  current: number;
  total: number;
  /**
   * Kept for call-site compatibility. All modes now use the same thin full-width
   * bar with « Étape X / Y » + duration above.
   */
  display?: "questions" | "percent";
  /** Right-side duration above the bar. Default « 1 minute ». */
  durationLabel?: string;
};

function DurationBadge({ label }: { label: string }) {
  return (
    <p className="inline-flex items-center gap-1 text-[0.95rem] font-extrabold tabular-nums text-[#ff2d8f]">
      <Timer
        className="h-3.5 w-3.5 shrink-0"
        strokeWidth={2.5}
        aria-hidden
      />
      <span>{label}</span>
    </p>
  );
}

export function ProgressBar({
  current,
  total,
  durationLabel = "1 minute",
}: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(safeTotal, Math.max(1, current));
  const percent = Math.min(100, Math.round((safeCurrent / safeTotal) * 100));

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="text-[0.95rem] font-bold tabular-nums text-brand">
          Étape {safeCurrent}&nbsp;/&nbsp;{safeTotal}
        </p>
        <DurationBadge label={durationLabel} />
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-brand-soft"
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-label={`Étape ${safeCurrent} sur ${safeTotal}`}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
