"use client";

import type { ReactNode } from "react";
import { useRedesignForm, useSeniorForm } from "./seniorForm";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  labelClassName?: string;
  /** Kept for compatibility — checkboxes are no longer shown. */
  showCheckbox?: boolean;
  /** Icon placement. Default keeps the legacy left overlay used by other steps. */
  layout?: "default" | "stack" | "row";
  surface?: "brand" | "light";
  iconClassName?: string;
  /** Senior variant only: label alignment (icon stays on the left). */
  seniorAlign?: "left" | "center";
};

/** Button blue from design reference screenshot (~#3f76bc). */
const REDESIGN_BTN =
  "rounded-none border-2 border-[#3f76bc] bg-[#3f76bc] text-white hover:border-[#3566a6] hover:bg-[#3566a6]";
const REDESIGN_BTN_SELECTED =
  "rounded-none border-2 border-[#2f5a96] bg-[#2f5a96] text-white shadow-none";

export function OptionCard({
  label,
  selected,
  onClick,
  description,
  disabled = false,
  icon,
  className,
  labelClassName,
  layout = "default",
  surface = "brand",
  iconClassName,
  seniorAlign = "left",
}: OptionCardProps) {
  const senior = useSeniorForm();
  const redesign = useRedesignForm();

  if (senior) {
    const centered = seniorAlign === "center";
    const toneClass = redesign
      ? `${selected ? REDESIGN_BTN_SELECTED : REDESIGN_BTN} mx-auto w-[88%] sm:w-full`
      : selected
        ? "w-full rounded-[18px] border-2 border-brand bg-brand-muted text-[#3b0764] shadow-[0_0_0_3px_rgba(98,41,208,0.18)]"
        : "w-full rounded-[18px] border-2 border-brand-muted bg-white text-[#3b0764] hover:border-brand hover:bg-[#f8f6ff]";

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        className={`grid min-h-[72px] items-center gap-2.5 px-[18px] py-2.5 text-[1.1rem] font-semibold leading-snug transition-[background-color,border-color,box-shadow] duration-150 disabled:cursor-not-allowed ${
          centered
            ? "grid-cols-[56px_1fr_56px] text-center"
            : "grid-cols-[56px_1fr] text-left"
        } ${toneClass} ${className ?? ""}`}
      >
        <span
          className={`inline-flex justify-self-center ${
            redesign
              ? "text-white"
              : selected
                ? "text-[#8a6cf0]"
                : "text-[#8b5cf6]"
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="min-w-0 text-pretty">{label}</span>
        {centered ? <span aria-hidden="true" /> : null}
      </button>
    );
  }

  const hasIcon = Boolean(icon);
  const isStack = layout === "stack";
  const isRow = layout === "row";

  const layoutClass = isStack
    ? "flex-col items-center justify-center gap-1 px-2.5 py-2.5 text-center sm:gap-1 sm:px-3 sm:py-3"
    : isRow
      ? "flex-row items-center justify-center gap-2.5 px-4 py-3 text-left sm:gap-3 sm:px-5"
      : `flex-col items-center justify-center text-center ${
          hasIcon ? "px-12 sm:px-[3.25rem]" : "px-4"
        } py-3 sm:py-3.5`;

  if (redesign) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        className={`relative flex h-full min-h-[3.75rem] overflow-hidden transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 ${
          selected ? REDESIGN_BTN_SELECTED : REDESIGN_BTN
        } mx-auto w-[88%] sm:mx-0 sm:w-full ${layoutClass} ${className ?? ""}`}
      >
        {icon ? (
          <span
            className={
              iconClassName ??
              (isStack
                ? "inline-flex h-6 items-center justify-center text-white sm:h-7"
                : isRow
                  ? "inline-flex h-6 w-6 shrink-0 items-center justify-center text-white sm:h-7 sm:w-7"
                  : "pointer-events-none absolute left-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center text-white sm:left-3 sm:h-8 sm:w-8")
            }
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <span
          className={
            labelClassName
              ? `${labelClassName} !text-white`
              : "w-full max-w-full text-balance text-[13px] font-semibold leading-snug text-white sm:text-[15px]"
          }
        >
          {label}
        </span>

        {description ? (
          <span className="mt-1 block w-full max-w-full text-pretty text-xs leading-snug text-white/90 sm:text-sm">
            {description}
          </span>
        ) : null}
      </button>
    );
  }

  const surfaceClass = selected
    ? "border-brand bg-[#c4b5fd] text-[#3b0764] shadow-md ring-2 ring-brand/40"
    : surface === "light"
      ? "border-[#c4b5fd] bg-white text-foreground shadow-[0_6px_16px_-10px_rgba(109,40,217,0.32)] hover:-translate-y-0.5 hover:border-brand hover:bg-[#f7f4ff] hover:shadow-md"
      : "border-[#c4b5fd] bg-[#ede9fe] text-foreground shadow-sm hover:-translate-y-0.5 hover:border-brand hover:bg-[#ddd6fe] hover:shadow-md";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative flex h-full min-h-[3.75rem] w-full overflow-hidden rounded-2xl border-2 transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 ${layoutClass} ${surfaceClass} ${className ?? ""}`}
    >
      {icon ? (
        <span
          className={
            iconClassName ??
            (isStack
              ? "inline-flex h-6 items-center justify-center sm:h-7"
              : isRow
                ? "inline-flex h-6 w-6 shrink-0 items-center justify-center text-[#8b5cf6] sm:h-7 sm:w-7"
                : "pointer-events-none absolute left-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center sm:left-3 sm:h-8 sm:w-8")
          }
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}

      <span
        className={
          labelClassName ??
          "w-full max-w-full text-balance text-[13px] font-semibold leading-snug text-[#3b0764] sm:text-[15px]"
        }
      >
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
