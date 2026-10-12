"use client";

import { useSeniorForm } from "./seniorForm";

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
  const senior = useSeniorForm();
  if (!showNext) return null;

  if (senior) {
    return (
      <div className="mt-5">
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-[1.2rem] font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {nextLabel}
        </button>
      </div>
    );
  }

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
