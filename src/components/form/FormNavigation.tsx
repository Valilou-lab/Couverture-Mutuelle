"use client";

type FormNavigationProps = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  disabled?: boolean;
};

export function FormNavigation({
  onBack,
  onNext,
  nextLabel = "Continuer",
  showBack = true,
  showNext = true,
  disabled = false,
}: FormNavigationProps) {
  if (!showBack && !showNext) return null;

  return (
    <div className="mt-6 flex items-center gap-3 sm:mt-8">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="min-h-12 flex-1 rounded-full border border-border bg-white px-4 font-sora text-sm font-semibold text-foreground transition duration-200 hover:border-brand hover:bg-brand-soft hover:text-brand hover:shadow-sm disabled:opacity-50 sm:flex-none sm:min-w-[7.5rem] sm:px-6"
        >
          Retour
        </button>
      ) : null}
      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="min-h-12 flex-[1.6] rounded-full bg-brand px-4 font-sora text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#5b21b6] hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:min-w-[10rem] sm:px-8"
        >
          {nextLabel}
        </button>
      ) : null}
    </div>
  );
}
