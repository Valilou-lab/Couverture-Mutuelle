"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormStepId } from "./types";
import {
  getFormMascotContent,
  type FormMascotContent,
} from "./mascotGuideConfig";

type Props = {
  step: FormStepId;
  isFirstStep?: boolean;
  /** Used on the last step: « Bonne nouvelle {prénom} ! » */
  firstName?: string;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Types `text` character by character; waits while `active` is false. */
function useTypedText(text: string, active: boolean, charsPerSecond = 48) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(text.length === 0);

  useEffect(() => {
    if (text.length === 0) {
      setShown("");
      setDone(true);
      return;
    }

    if (!active) {
      setShown("");
      setDone(false);
      return;
    }

    if (prefersReducedMotion()) {
      setShown(text);
      setDone(true);
      return;
    }

    setShown("");
    setDone(false);
    let i = 0;
    const delay = Math.max(14, Math.round(1000 / charsPerSecond));
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, delay);

    return () => window.clearInterval(id);
  }, [active, charsPerSecond, text]);

  return { shown, done };
}

function bubbleSurface(tone: FormMascotContent["bubbleTone"], featured: boolean) {
  if (tone === "green") {
    return featured
      ? "rounded-[1.35rem] border-2 border-emerald-300 bg-emerald-50 px-4 py-3.5 shadow-[0_12px_28px_-16px_rgba(5,150,105,0.45)] sm:rounded-[1.5rem] sm:px-5 sm:py-4"
      : "rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-3.5 py-2.5 shadow-[0_8px_20px_-14px_rgba(5,150,105,0.4)]";
  }
  return featured
    ? "rounded-[1.35rem] border border-[#ddd6fe] bg-white px-4 py-3.5 shadow-[0_12px_28px_-16px_rgba(98,41,208,0.35)] sm:rounded-[1.5rem] sm:px-5 sm:py-4"
    : "rounded-[1.15rem] border border-[#ddd6fe] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_-14px_rgba(98,41,208,0.35)] sm:rounded-2xl sm:px-4 sm:py-3";
}

function bubbleTail(tone: FormMascotContent["bubbleTone"], featured: boolean) {
  if (tone === "green") {
    return featured
      ? "absolute -left-2 bottom-5 h-0 w-0 border-y-[9px] border-r-[11px] border-y-transparent border-r-emerald-50"
      : "absolute -left-1.5 bottom-3.5 h-0 w-0 border-y-[8px] border-r-[10px] border-y-transparent border-r-emerald-50";
  }
  return featured
    ? "absolute -left-2 bottom-5 h-0 w-0 border-y-[9px] border-r-[11px] border-y-transparent border-r-white"
    : "absolute -left-1.5 bottom-3.5 h-0 w-0 border-y-[8px] border-r-[10px] border-y-transparent border-r-white";
}

/**
 * Cape mascot + speech bubble above the quote form.
 * Contact step is larger with a green confirmation bubble.
 */
export function FormMascotBubble({
  step,
  isFirstStep = false,
  firstName,
}: Props) {
  const content = getFormMascotContent(step, { isFirstStep, firstName });
  const title = content?.title ?? "";
  const message = content?.lines.join(" ") ?? "";
  const reassurance = content?.reassurance ?? "";
  const featured = step === "contact";

  const typedTitle = useTypedText(title, Boolean(content));
  const typedMessage = useTypedText(message, typedTitle.done && Boolean(message));
  const typedReassurance = useTypedText(
    reassurance,
    typedTitle.done && typedMessage.done && Boolean(reassurance),
  );

  if (!content) return null;

  const typing =
    !typedTitle.done ||
    (Boolean(message) && !typedMessage.done) ||
    (Boolean(reassurance) && !typedReassurance.done);

  const fullSpoken = [title, message, reassurance].filter(Boolean).join(" ");
  const tone = content.bubbleTone;

  return (
    <aside
      className={
        featured
          ? "mb-3.5 flex items-end gap-3 px-0.5 sm:mb-4 sm:gap-4"
          : "mb-3 flex items-end gap-2.5 px-0.5 sm:mb-3.5 sm:gap-3"
      }
      aria-live="polite"
    >
      <Image
        src="/mascotte-cape.png"
        alt=""
        width={448}
        height={481}
        className={
          featured
            ? "h-auto w-[5.75rem] shrink-0 drop-shadow-[0_10px_18px_rgba(59,7,100,0.24)] sm:w-28"
            : "h-auto w-[4.25rem] shrink-0 drop-shadow-[0_8px_14px_rgba(59,7,100,0.22)] sm:w-[4.75rem]"
        }
        priority={false}
      />

      <div className={`relative min-w-0 flex-1 ${featured ? "mb-1.5" : "mb-1"}`}>
        <span
          aria-hidden="true"
          className={bubbleTail(tone, featured)}
        />
        <div className={bubbleSurface(tone, featured)}>
          <span className="sr-only">{fullSpoken}</span>
          <div aria-hidden="true">
            <p
              className={
                featured
                  ? "font-poppins text-[1.05rem] font-extrabold leading-snug text-emerald-950 sm:text-[1.2rem]"
                  : "font-poppins text-[0.95rem] font-bold leading-snug text-[#3b0764] sm:text-[1.05rem]"
              }
            >
              {typedTitle.shown}
              {typing && typedTitle.done === false ? (
                <TypingCaret featured={featured} />
              ) : null}
            </p>
            {message ? (
              <p
                className={
                  featured
                    ? "mt-1.5 min-h-[1.2em] text-[0.95rem] font-semibold leading-snug text-emerald-900 sm:text-[1.05rem]"
                    : "mt-1 min-h-[1.1em] text-[0.85rem] font-medium leading-snug text-zinc-600 sm:text-[0.92rem]"
                }
              >
                {typedMessage.shown}
                {typing && typedTitle.done && !typedMessage.done ? (
                  <TypingCaret featured={featured} />
                ) : null}
              </p>
            ) : null}
            {reassurance ? (
              <p
                className={
                  featured
                    ? "mt-2 min-h-[1.2em] text-[0.8rem] font-medium leading-snug text-emerald-800/85 sm:text-[0.88rem]"
                    : "mt-1.5 min-h-[1.1em] text-[0.78rem] font-medium leading-snug text-zinc-500 sm:text-[0.82rem]"
                }
              >
                {typedReassurance.shown}
                {typing && typedTitle.done && typedMessage.done ? (
                  <TypingCaret featured={featured} />
                ) : null}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}

function TypingCaret({ featured = false }: { featured?: boolean }) {
  return (
    <span
      className={
        featured
          ? "ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.1em] animate-pulse rounded-sm bg-emerald-600 align-baseline"
          : "ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.1em] animate-pulse rounded-sm bg-[#7c3aed] align-baseline"
      }
      aria-hidden="true"
    />
  );
}
