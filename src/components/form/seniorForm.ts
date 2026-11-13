"use client";

import { createContext, useContext } from "react";
import { useLgUp } from "./useLgUp";

/**
 * Senior homepage variant of the quote form (larger type and tap targets).
 * Only the visual layer changes; step logic, validation and tracking are shared.
 */
export const SeniorFormContext = createContext(false);

export function useSeniorForm(): boolean {
  return useContext(SeniorFormContext);
}

/**
 * Main LP (/) + /tiktok redesign visuals (option buttons, etc.).
 * Other LPs keep the classic look.
 */
export const RedesignFormContext = createContext(false);

export function useRedesignForm(): boolean {
  return useContext(RedesignFormContext);
}

export const SENIOR_QUESTION_TITLE =
  "text-balance text-center font-poppins text-[1.375rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-brand sm:text-[1.75rem]";

/** Same as SENIOR_QUESTION_TITLE but black — main LP (/) + /tiktok redesign. */
export const REDESIGN_QUESTION_TITLE =
  "text-balance text-center font-poppins text-[1.375rem] font-normal leading-[1.2] tracking-[-0.02em] text-black sm:text-[1.75rem]";

export function useQuestionTitleClass(): string {
  return useRedesignForm() ? REDESIGN_QUESTION_TITLE : SENIOR_QUESTION_TITLE;
}

export const SENIOR_LABEL = "block text-[1.05rem] font-medium text-foreground";

export const SENIOR_INPUT =
  "mt-1.5 min-h-16 w-full min-w-0 rounded-[18px] border-2 border-brand-muted bg-white px-[18px] py-4 text-[1.2rem] text-foreground outline-none placeholder:text-zinc-400 focus:border-brand focus:ring-[3px] focus:ring-brand/15 disabled:opacity-60";

/** Same size as SENIOR_INPUT; border matches pastel violet option buttons. */
export const REDESIGN_INPUT =
  "mt-1.5 min-h-16 w-full min-w-0 rounded-[18px] border-2 border-brand-muted bg-white px-[18px] py-4 text-[1.2rem] text-foreground outline-none placeholder:text-zinc-400 focus:border-brand focus:ring-[3px] focus:ring-brand/15 disabled:opacity-60";

/** `/tranches-age` — square fields, gray outline. */
export const TRANCHES_INPUT =
  "mt-1.5 min-h-16 w-full min-w-0 rounded-none border-2 border-[#9ca3af] bg-white px-[18px] py-4 text-[1.2rem] text-foreground outline-none placeholder:text-zinc-400 focus:border-[#6b7280] focus:ring-0 disabled:opacity-60";

const DEFAULT_FORM_INPUT =
  "mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-base outline-none ring-brand/30 focus:border-brand focus:ring-2";

export const TranchesAgeFormContext = createContext(false);

export function useTranchesAgeForm(): boolean {
  return useContext(TranchesAgeFormContext);
}

/**
 * Desktop chrome of the validated `/tranches-age` form, for independent V2 URLs.
 * Must stay false on V1 `/`, `/tiktok` and `/reste-a-charge`.
 */
export const LpV2DesktopFormContext = createContext(false);

export function useLpV2DesktopForm(): boolean {
  return useContext(LpV2DesktopFormContext);
}

/** Square gray fields / choice buttons: `/tranches-age` or any LP V2, from `lg`. */
export function useDeskFormChrome(): boolean {
  const tranches = useTranchesAgeForm();
  const lpV2 = useLpV2DesktopForm();
  const lgUp = useLgUp();
  return (tranches || lpV2) && lgUp;
}

/** Input frame for the active form variant (redesign / senior purple / default). */
export function useFormInputClass(): string {
  const tranches = useTranchesAgeForm();
  const lpV2 = useLpV2DesktopForm();
  const lgUp = useLgUp();
  const redesign = useRedesignForm();
  const senior = useSeniorForm();
  if (tranches || (lpV2 && lgUp)) return TRANCHES_INPUT;
  if (redesign) return REDESIGN_INPUT;
  if (senior) return SENIOR_INPUT;
  return DEFAULT_FORM_INPUT;
}

export const SENIOR_ERROR = "mt-1.5 text-base font-medium text-error";

export const SENIOR_INFO =
  "rounded-[18px] border border-brand-muted bg-[#f7f4ff] px-4 py-3.5 text-center";
