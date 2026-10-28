"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  phone: string;
  verifying: boolean;
  errorMessage: string | null;
  onConfirm: (code: string) => void;
  onEditPhone: () => void;
};

/**
 * DEMO OTP screen — visual only.
 * Does not call /api/verify or Twilio Verify production.
 * Any 6-digit code is accepted by the parent after a short delay.
 */
export function StepCompliancePhoneVerify({
  phone,
  verifying,
  errorMessage,
  onConfirm,
  onEditPhone,
}: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
          Vérification de votre numéro (démonstration).
        </p>
        <p className="mt-2 text-sm font-semibold text-[#3b0764]">{phone}</p>
      </div>

      <p className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-3.5 py-3 text-center text-[0.85rem] leading-snug text-amber-900">
        Mode démo — aucun SMS réel n’est envoyé. Saisissez n’importe quel code à
        6 chiffres pour continuer.
      </p>

      <label
        htmlFor="compliance-phone-otp"
        className="mt-5 block text-base font-semibold text-[#3b0764]"
      >
        Code à 6 chiffres
      </label>
      <input
        ref={inputRef}
        id="compliance-phone-otp"
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
        className="mt-2 w-full rounded-[18px] border-2 border-[#c4b5fd] bg-white px-4 py-4 text-center text-[1.75rem] font-extrabold tracking-[0.35em] text-[#3b0764] outline-none ring-brand/30 focus:border-brand focus:ring-2"
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
          className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-[1.2rem] font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
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
