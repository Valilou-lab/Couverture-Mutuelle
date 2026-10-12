"use client";

import { createContext, useContext } from "react";

/**
 * Senior homepage variant of the quote form (larger type and tap targets).
 * Only the visual layer changes; step logic, validation and tracking are shared.
 */
export const SeniorFormContext = createContext(false);

export function useSeniorForm(): boolean {
  return useContext(SeniorFormContext);
}

export const SENIOR_QUESTION_TITLE =
  "text-balance text-center font-poppins text-[1.375rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-brand sm:text-[1.75rem]";

export const SENIOR_LABEL = "block text-[1.05rem] font-medium text-foreground";

export const SENIOR_INPUT =
  "mt-1.5 min-h-16 w-full min-w-0 rounded-[18px] border-2 border-brand-muted bg-white px-[18px] py-4 text-[1.2rem] text-foreground outline-none placeholder:text-zinc-400 focus:border-brand focus:ring-[3px] focus:ring-brand/15 disabled:opacity-60";

export const SENIOR_ERROR = "mt-1.5 text-base font-medium text-error";

export const SENIOR_INFO =
  "rounded-[18px] border border-brand-muted bg-[#f7f4ff] px-4 py-3.5 text-center";
