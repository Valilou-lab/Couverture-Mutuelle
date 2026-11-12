"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
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

/** White buttons with a marked violet border; fill brand on press/select. */
const REDESIGN_BTN =
  "rounded-[18px] border-[2.5px] border-brand bg-white text-[#3b0764] hover:bg-[#f7f4ff] active:bg-brand active:text-white";
const REDESIGN_BTN_SELECTED =
  "rounded-[18px] border-[2.5px] border-brand bg-brand text-white shadow-md";

function ChoiceChevron({ selected }: { selected: boolean }) {
  return (
    <ChevronRight
      className={`h-6 w-6 shrink-0 ${selected ? "text-white" : "text-brand"}`}
      strokeWidth={2.5}
      aria-hidden
    />
  );
}

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
  showCheckbox = false,
}: OptionCardProps) {
  const senior = useSeniorForm();
  const redesign = useRedesignForm();
  const showChoiceArrow = redesign && !showCheckbox;

  if (senior) {
    const centered = seniorAlign === "center";
    if (showChoiceArrow) {
      const centered = seniorAlign === "center";
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={selected}
          className={`flex min-h-[72px] w-full items-center px-5 py-3.5 text-[1.1rem] font-semibold leading-snug transition-[background-color,border-color,box-shadow,color,transform] duration-150 active:scale-[0.99] disabled:cursor-not-allowed ${
            centered
              ? "relative justify-center text-center"
              : "justify-between gap-3 text-left"
          } ${selected ? REDESIGN_BTN_SELECTED : REDESIGN_BTN} ${className ?? ""}`}
        >
          {centered || !icon ? null : (
            <span className="inline-flex shrink-0 items-center justify-center" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={centered ? "text-center tracking-[0.06em]" : "min-w-0 flex-1 text-pretty"}>
            {label}
          </span>
          <span className={centered ? "absolute right-5 top-1/2 -translate-y-1/2" : undefined}>
            <ChoiceChevron selected={selected} />
          </span>
        </button>
      );
    }

    const toneClass = selected
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
            selected ? "text-[#8a6cf0]" : "text-[#8b5cf6]"
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
    if (showChoiceArrow) {
      return (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={selected}
          className={`flex h-full min-h-[3.75rem] w-full items-center justify-between gap-3 overflow-hidden px-5 py-3.5 text-left transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 ${
            selected ? REDESIGN_BTN_SELECTED : REDESIGN_BTN
          } ${className ?? ""}`}
        >
          <span
            className={
              labelClassName
                ? `${labelClassName} min-w-0 flex-1`
                : "min-w-0 flex-1 text-pretty text-[1.05rem] font-semibold leading-snug sm:text-[1.1rem]"
            }
          >
            {label}
          </span>
          {description ? (
            <span className="sr-only">{description}</span>
          ) : null}
          <ChoiceChevron selected={selected} />
        </button>
      );
    }

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
                ? `inline-flex h-6 items-center justify-center sm:h-7 ${selected ? "text-white" : "text-brand"}`
                : isRow
                  ? `inline-flex h-6 w-6 shrink-0 items-center justify-center sm:h-7 sm:w-7 ${selected ? "text-white" : "text-brand"}`
                  : `pointer-events-none absolute left-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center sm:left-3 sm:h-8 sm:w-8 ${selected ? "text-white" : "text-brand"}`)
            }
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <span
          className={
            labelClassName
              ? `${labelClassName} !text-[#3b0764]`
              : "w-full max-w-full text-balance text-[13px] font-semibold leading-snug text-[#3b0764] sm:text-[15px]"
          }
        >
          {label}
        </span>

        {description ? (
          <span className="mt-1 block w-full max-w-full text-pretty text-xs leading-snug text-[#4c1d95]/90 sm:text-sm">
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
