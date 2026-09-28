"use client";

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(safeTotal, Math.max(1, current));
  const percent = Math.min(100, Math.round((safeCurrent / safeTotal) * 100));

  const gradient =
    percent < 35
      ? "linear-gradient(105deg, #7c3aed 0%, #8b5cf6 35%, #a855f7 70%, #c084fc 100%)"
      : percent < 70
        ? "linear-gradient(105deg, #7c3aed 0%, #9333ea 30%, #d946ef 65%, #f472b6 100%)"
        : "linear-gradient(105deg, #6d28d9 0%, #a855f7 25%, #d946ef 55%, #f472b6 80%, #fb7185 100%)";

  return (
    <div className="mb-4 lg:mb-6">
      <div
        className="relative h-7 overflow-hidden rounded-full bg-brand-soft shadow-inner sm:h-8"
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
