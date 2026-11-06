"use client";

import { useEffect, useRef, useState } from "react";
import { useFormInputClass } from "@/components/form/seniorForm";

type Props = {
  phone: string;
  verifying: boolean;
  errorMessage: string | null;
  onConfirm: (code: string) => void;
  onEditPhone: () => void;
};

/**
 * V2 OTP screen — scaffold only (local adapter).
 * No Twilio / `/api/verify` calls. Presentation aligned with main LP.
 */
export function StepPhoneVerifyV2({
  phone,
  verifying,
  errorMessage,
  onConfirm,
  onEditPhone,
}: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputClass = useFormInputClass();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = /^\d{6}$/.test(code) && !verifying;

  return (
    <div>
      <div className="rounded-[22px] bg-brand-soft/70 px-4 py-3.5 text-center">
        <p className="font-poppins text-[1.35rem] font-extrabold tracking-tight text-[#3b0764]">
          Plus qu’une étape&nbsp;!
        </p>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-zinc-600">
          Saisissez le code reçu par SMS pour confirmer votre numéro.
        </p>
        <p className="mt-2 text-sm font-semibold text-[#3b0764]">{phone}</p>
      </div>

      <label
        htmlFor="v2-phone-otp"
        className="mt-5 block text-base font-semibold text-[#3b0764]"
      >
        Code à 6 chiffres
      </label>
      <input
        ref={inputRef}
        id="v2-phone-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        value={code}
        disabled={verifying}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSubmit) {
            onConfirm(code);
          }
        }}
        className={`${inputClass} text-center text-[1.75rem] font-extrabold tracking-[0.35em] text-[#3b0764]`}
      />

      {errorMessage ? (
        <p className="mt-2 text-center text-sm text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onConfirm(code)}
          className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-[#3f76bc] px-6 py-3.5 text-[1.2rem] font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(63,118,188,0.8)] ring-2 ring-[#3f76bc]/40 transition hover:bg-[#3566a6] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? "Vérification…" : "Confirmer mon numéro"}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          disabled={verifying}
          onClick={onEditPhone}
          className="text-zinc-600 underline underline-offset-2 disabled:opacity-50"
        >
          Modifier mon numéro
        </button>
      </div>
    </div>
  );
}
