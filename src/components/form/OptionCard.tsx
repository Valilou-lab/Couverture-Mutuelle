"use client";

import type { ReactNode } from "react";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  showCheckbox?: boolean;
};

function CheckBox({ selected }: { selected: boolean }) {
  return (
    <span
      className={`hidden h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition sm:inline-flex ${
        selected
          ? "border-white bg-white text-brand"
          : "border-brand/50 bg-white text-transparent"
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CornerCheck() {
  return (
    <span
      className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-sm sm:hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function OptionCard({
  label,
  selected,
  onClick,
  description,
  disabled = false,
  icon,
  showCheckbox = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative flex h-full min-h-[3.75rem] w-full items-center justify-center rounded-2xl border-2 px-4 py-3.5 text-center transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 sm:px-4 sm:py-4 sm:text-left ${
        selected
          ? "border-brand bg-brand-soft text-[#3b0764] shadow-md ring-2 ring-brand/20 sm:bg-brand sm:text-white sm:ring-brand/30"
          : "border-brand/45 bg-[#ede9fe] text-foreground shadow-sm hover:-translate-y-0.5 hover:border-brand hover:bg-[#ddd6fe] hover:shadow-md"
      }`}
    >
      {selected ? <CornerCheck /> : null}

      <span
        className={`flex w-full flex-row items-center justify-center gap-2.5 ${
          showCheckbox ? "sm:justify-start" : "sm:justify-center"
        }`}
      >
        {showCheckbox ? <CheckBox selected={selected} /> : null}
        {icon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span
          className={`max-w-full text-pretty text-[15px] font-semibold leading-snug sm:text-base ${
            selected ? "text-[#3b0764] sm:text-white" : "text-[#3b0764]"
          }`}
        >
          {label}
        </span>
      </span>
      {description ? (
        <span
          className={`mt-1 block w-full text-pretty text-xs leading-snug sm:text-sm ${
            showCheckbox ? "sm:pl-7" : ""
          } ${selected ? "text-zinc-600 sm:text-violet-100" : "text-zinc-600"}`}
        >
          {description}
        </span>
      ) : null}
    </button>
  );
}
