"use client";

import type { ReactNode } from "react";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  /** Kept for compatibility — checkboxes are no longer shown. */
  showCheckbox?: boolean;
};

export function OptionCard({
  label,
  selected,
  onClick,
  description,
  disabled = false,
  icon,
}: OptionCardProps) {
  const hasIcon = Boolean(icon);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative flex h-full min-h-[3.75rem] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 py-3 text-center transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 sm:py-3.5 ${
        hasIcon ? "px-10 sm:px-11" : "px-4"
      } ${
        selected
          ? "border-brand bg-[#c4b5fd] text-[#3b0764] shadow-md ring-2 ring-brand/40"
          : "border-brand/45 bg-[#ede9fe] text-foreground shadow-sm hover:-translate-y-0.5 hover:border-brand hover:bg-[#ddd6fe] hover:shadow-md"
      }`}
    >
      {icon ? (
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center sm:left-3 sm:h-8 sm:w-8"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}

      <span className="w-full max-w-full text-balance text-[13px] font-semibold leading-snug text-[#3b0764] sm:text-[15px]">
        {label}
      </span>

      {description ? (
        <span
          className={`mt-1 block w-full max-w-full text-pretty text-xs leading-snug sm:text-sm ${
            selected ? "text-[#4c1d95]/90" : "text-zinc-600"
          }`}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}
