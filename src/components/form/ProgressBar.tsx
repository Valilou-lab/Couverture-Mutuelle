"use client";

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500 sm:text-sm">
        <span>
          Étape {current} sur {total}
        </span>
        <span>{percent} %</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
