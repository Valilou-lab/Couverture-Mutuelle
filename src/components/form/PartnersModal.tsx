"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { PARTNERS, PARTNERS_INTRO } from "@/lib/partners";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PartnersModal({ open, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Fermer la liste des partenaires"
        className="absolute inset-0 bg-zinc-900/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(85vh,36rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,15,20,0.5)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 pr-2">
            <h2
              id={titleId}
              className="font-manrope text-xl font-bold tracking-tight text-brand"
            >
              Nos Partenaires
            </h2>
            <p className="mt-1.5 text-sm leading-snug text-zinc-600">
              {PARTNERS_INTRO}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-2xl leading-none text-brand transition hover:bg-brand hover:text-white"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <ul className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
          {PARTNERS.map((partner) => (
            <li
              key={`${partner.name}-${partner.orias}`}
              className="rounded-2xl border border-border bg-brand-soft/40 px-4 py-3"
            >
              <p className="font-semibold text-[#3b0764]">{partner.name}</p>
              <p className="mt-0.5 text-sm text-zinc-500">
                ORIAS&nbsp;: {partner.orias}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
