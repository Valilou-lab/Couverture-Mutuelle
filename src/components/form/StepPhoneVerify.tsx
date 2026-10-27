"use client";

import { useEffect, useRef, useState } from "react";
import { useSeniorForm } from "./seniorForm";

type Props = {
  phone: string;
  sending: boolean;
  verifying: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  resendCooldownSec: number;
  onConfirm: (code: string) => void;
  onResend: () => void;
  onEditPhone: () => void;
};

export function StepPhoneVerify({
  phone,
  sending,
  verifying,
  statusMessage,
  errorMessage,
  resendCooldownSec,
  onConfirm,
  onResend,
  onEditPhone,
}: Props) {
  const senior = useSeniorForm();
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const busy = sending || verifying;
  const canSubmit = /^\d{6}$/.test(code) && !busy;

  return (
    <div>
      <div
        className={
          senior
            ? "rounded-[22px] bg-brand-soft/70 px-4 py-3.5 text-center"
            : "rounded-2xl bg-brand-soft/70 px-4 py-3.5 text-center sm:px-5 sm:py-4"
        }
      >
        <p
          className={
            senior
              ? "font-poppins text-[1.35rem] font-extrabold tracking-tight text-[#3b0764]"
              : "font-manrope text-xl font-extrabold tracking-tight text-[#3b0764] sm:text-2xl"
          }
        >
          Plus qu’une étape&nbsp;!
        </p>
        <p
          className={
            senior
              ? "mt-1.5 text-[0.95rem] leading-snug text-zinc-600"
              : "mt-2 text-sm leading-snug text-zinc-600 sm:text-[0.9375rem]"
          }
        >
          Nous venons de vous envoyer un code par SMS pour vérifier votre
          numéro.
        </p>
        <p className="mt-2 text-sm font-semibold text-[#3b0764]">{phone}</p>
      </div>

      <label
        htmlFor="phone-otp"
        className={
          senior
            ? "mt-5 block text-base font-semibold text-[#3b0764]"
            : "mt-5 block text-sm font-medium"
        }
      >
        Code à 6 chiffres
      </label>
      <input
        ref={inputRef}
        id="phone-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        value={code}
        disabled={busy}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSubmit) {
            onConfirm(code);
          }
        }}
        className={
          senior
            ? "mt-2 w-full rounded-[18px] border-2 border-[#c4b5fd] bg-white px-4 py-4 text-center text-[1.75rem] font-extrabold tracking-[0.35em] text-[#3b0764] outline-none ring-brand/30 focus:border-brand focus:ring-2"
            : "mt-2 w-full rounded-2xl border-2 border-[#c4b5fd] bg-white px-4 py-3.5 text-center text-2xl font-semibold tracking-[0.4em] text-[#3b0764] outline-none ring-brand/30 focus:border-brand focus:ring-2"
        }
        aria-describedby="phone-otp-help"
      />

      {statusMessage ? (
        <p
          id="phone-otp-help"
          className="mt-2 text-center text-sm font-medium text-[#5b21b6]"
        >
          {statusMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-2 text-center text-sm text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <p className="mt-3 text-center text-xs leading-snug text-zinc-500 sm:text-sm">
        Cette vérification nous permet de protéger votre demande et d’éviter
        l’utilisation de faux numéros.
      </p>

      <div className="mt-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onConfirm(code)}
          className={
            senior
              ? "inline-flex min-h-16 w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-[1.2rem] font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              : "min-h-12 w-full rounded-full bg-brand px-4 font-sora text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
          }
        >
          {verifying ? "Vérification…" : "Confirmer mon numéro"}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          disabled={busy || resendCooldownSec > 0}
          onClick={onResend}
          className="font-medium text-brand underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
        >
          {resendCooldownSec > 0
            ? `Renvoyer le code (${resendCooldownSec}s)`
            : sending
              ? "Envoi du code…"
              : "Renvoyer le code"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onEditPhone}
          className="text-zinc-600 underline underline-offset-2 disabled:opacity-50"
        >
          Modifier mon numéro
        </button>
      </div>
    </div>
  );
}
