"use client";

import {
  useLpV2DesktopForm,
  useRedesignForm,
  useSeniorForm,
  useTranchesAgeForm,
} from "./seniorForm";

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
  const deskChrome = useTranchesAgeForm() || useLpV2DesktopForm();
  if (!showNext) return null;

  const incomplete = !canContinue;
  const blocked = disabled || incomplete;
  const tranchesDesktopCta = deskChrome
    ? " lg:min-h-[4.35rem] lg:text-[1.4rem] lg:tracking-[-0.02em]"
    : "";

  if (senior) {
    const toneClass = incomplete
      ? `bg-zinc-300 text-zinc-500 shadow-none${tranchesDesktopCta}`
      : redesign
        ? "bg-[#9b4ff0] text-white shadow-[0_12px_28px_-10px_rgba(155,79,240,0.55)] ring-2 ring-[#9b4ff0]/35 hover:bg-[#8b3de0] hover:brightness-105"
        : `bg-brand text-white shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)] ring-2 ring-brand/30 hover:brightness-110${deskChrome ? ` lg:bg-[#6d28d9] lg:shadow-[0_16px_36px_-12px_rgba(109,40,217,0.7)] lg:ring-0${tranchesDesktopCta}` : ""}`;

    return (
      <div className="mt-5">
        <button
          type="button"
          onClick={onNext}
          disabled={blocked}
          aria-disabled={blocked}
          className={`inline-flex min-h-16 w-full items-center justify-center rounded-full px-6 py-3.5 text-[1.2rem] font-extrabold transition-[background-color,box-shadow,opacity,filter] duration-200 disabled:cursor-not-allowed ${
            deskChrome ? "lg:rounded-none" : ""
          } ${toneClass} ${
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
