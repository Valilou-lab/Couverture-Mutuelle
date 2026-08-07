"use client";

type ProgressBarProps = {
  current: number;
  total: number;
  /** When set, overrides current/total percentage (used for narrative progress). */
  percent?: number;
};

export function ProgressBar({ current, total, percent: percentOverride }: ProgressBarProps) {
  const percent =
    percentOverride != null
      ? Math.min(100, Math.max(0, Math.round(percentOverride)))
      : Math.min(100, Math.round((current / total) * 100));

  // Couleurs plus “peps” à mesure que l’on avance
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
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progression : ${percent} %`}
      >
        <div
          className="progress-liquid relative h-full overflow-hidden rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${percent}%`,
            backgroundImage: gradient,
          }}
        >
          <span className="progress-liquid-shine" aria-hidden="true" />
          <span className="progress-liquid-wave" aria-hidden="true" />
        </div>
        <span
          className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-xs font-bold tabular-nums sm:text-sm ${
            percent >= 45 ? "text-white drop-shadow-sm" : "text-[#3b0764]"
          }`}
        >
          {percent}&nbsp;%
        </span>
      </div>
    </div>
  );
}
