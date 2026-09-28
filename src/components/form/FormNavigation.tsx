"use client";

type FormNavigationProps = {
  onNext?: () => void;
  nextLabel?: string;
  showNext?: boolean;
  disabled?: boolean;
};

export function FormNavigation({
  onNext,
  nextLabel = "Continuer",
  showNext = true,
  disabled = false,
}: FormNavigationProps) {
  if (!showNext) return null;

  return (
    <div className="mt-6 flex items-center sm:mt-8">
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="min-h-12 w-full rounded-full bg-brand px-4 font-sora text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#5b21b6] hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[10rem] sm:px-8"
      >
        {nextLabel}
      </button>
    </div>
  );
}
