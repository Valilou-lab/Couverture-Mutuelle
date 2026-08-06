"use client";

import { INSURERS, type QuoteFormData } from "./types";
import { OptionCard } from "./OptionCard";
import { FormNavigation } from "./FormNavigation";
import type { FieldErrors } from "./validation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onSelectAndAdvance: (value: string) => void;
  onBack: () => void;
};

export function StepInsurer({
  data,
  errors,
  disabled = false,
  onSelectAndAdvance,
  onBack,
}: Props) {
  const logoInsurers = INSURERS.filter((item) => Boolean(item.logo));
  const textInsurers = INSURERS.filter(
    (item) => item.name === "Autres" || item.name === "Je ne sais pas",
  );

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Qui est votre assureur actuellement ?
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {logoInsurers.map((item) => {
          const selected = data.insurer === item.name;
          return (
            <button
              key={item.name}
              type="button"
              disabled={disabled}
              aria-label={item.name}
              aria-pressed={selected}
              onClick={() => onSelectAndAdvance(item.name)}
              className={`relative mx-auto flex aspect-square w-full max-w-[8.5rem] items-center justify-center rounded-2xl border bg-white p-2.5 shadow-[0_6px_16px_-12px_rgba(15,15,20,0.35)] transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-none sm:p-3 ${
                selected
                  ? "border-brand bg-brand-soft shadow-md ring-2 ring-brand/25"
                  : "border-border hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_10px_22px_-14px_rgba(109,40,217,0.45)]"
              }`}
            >
              {selected ? (
                <span
                  className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-sm"
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
              ) : null}

              {/* eslint-disable-next-line @next/next/no-img-element -- static public insurer logos */}
              <img
                src={item.logo!}
                alt=""
                width={120}
                height={120}
                className="max-h-[78%] max-w-[88%] object-contain"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {textInsurers.map((item) => (
          <OptionCard
            key={item.name}
            label={item.name}
            selected={data.insurer === item.name}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(item.name)}
          />
        ))}
      </div>

      {errors.insurer ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {errors.insurer}
        </p>
      ) : null}
      <FormNavigation onBack={onBack} showNext={false} disabled={disabled} />
    </div>
  );
}
