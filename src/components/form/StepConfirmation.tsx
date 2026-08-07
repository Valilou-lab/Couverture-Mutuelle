"use client";

import { FormMascotGuide } from "./FormMascotGuide";

type Props = {
  onRestart: () => void;
};

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M3.5 4.5c0-.8.7-1.5 1.5-1.5h1.4c.6 0 1.1.4 1.3 1l.7 2.2c.2.5 0 1.1-.4 1.4L6.8 8.8a9.5 9.5 0 0 0 4.4 4.4l1.2-1.2c.3-.4.9-.6 1.4-.4l2.2.7c.6.2 1 .7 1 1.3V16c0 .8-.7 1.5-1.5 1.5C8.8 17.5 2.5 11.2 2.5 4.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepConfirmation({ onRestart }: Props) {
  return (
    <div className="py-4 text-center sm:py-6">
      <FormMascotGuide step="confirmation" featured />

      <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2.5 rounded-2xl border border-brand/20 bg-brand-soft/60 px-4 py-3 text-sm text-[#3b0764]">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <PhoneIcon />
        </span>
        <p className="text-left font-medium leading-snug">
          Délai de rappel&nbsp;:{" "}
          <strong className="font-bold">1 à 5 minutes</strong>
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-8 min-h-12 rounded-full bg-brand px-8 font-sora text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
      >
        Recommencer le formulaire
      </button>
    </div>
  );
}
