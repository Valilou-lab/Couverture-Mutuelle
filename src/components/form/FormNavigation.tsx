"use client";

import { useRedesignForm, useSeniorForm } from "./seniorForm";

type FormNavigationProps = {
  onNext?: () => void;
  nextLabel?: string;
  showNext?: boolean;
  /** Hard block (submit / advance in progress). */
  disabled?: boolean;
  /**
   * When false, the CTA stays greyed out until required fields are filled.
   * Defaults to true so option-only steps keep their previous behaviour.
   */
  canContinue?: boolean;
};

export function FormNavigation({
  onNext,
  nextLabel = "Continuer",
  showNext = true,
  disabled = false,
  canContinue = true,
}: FormNavigationProps) {
  const senior = useSeniorForm();
  const redesign = useRedesignForm();
  if (!showNext) return null;

  const incomplete = !canContinue;
  const blocked = disabled || incomplete;

  if (senior) {
    const toneClass = incomplete
      ? "bg-zinc-300 text-zinc-500 shadow-none"
      : redesign
        ? "bg-[#3f76bc] text-white shadow-[0_12px_28px_-10px_rgba(63,118,188,0.8)] ring-2 ring-[#3f76bc]/40 hover:bg-[#3566a6] hover:brightness-105"
        : "bg-brand text-white shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)] ring-2 ring-brand/30 hover:brightness-110";

    return (
      <div className="mt-5">
        <button
          type="button"
          onClick={onNext}
          disabled={blocked}
          aria-disabled={blocked}
          className={`inline-flex min-h-16 w-full items-center justify-center rounded-full px-6 py-3.5 text-[1.2rem] font-extrabold transition-[background-color,box-shadow,opacity,filter] duration-200 disabled:cursor-not-allowed ${toneClass} ${
            disabled && !incomplete ? "opacity-60" : ""
          }`}
        >
          {nextLabel}
        </button>
      </div>
    );
  }

  const defaultTone = incomplete
    ? "bg-zinc-300 text-zinc-500 shadow-none"
    : "bg-brand text-white shadow-md ring-2 ring-brand/25 hover:bg-[#5b21b6] hover:shadow-lg hover:brightness-110";

  return (
    <div className="mt-6 flex items-center sm:mt-8">
      <button
        type="button"
        onClick={onNext}
        disabled={blocked}
        aria-disabled={blocked}
        className={`min-h-12 w-full rounded-full px-4 font-sora text-sm font-semibold transition duration-200 disabled:cursor-not-allowed sm:min-w-[10rem] sm:px-8 ${defaultTone} ${
          disabled && !incomplete ? "opacity-50" : ""
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
