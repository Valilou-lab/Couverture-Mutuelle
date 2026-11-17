"use client";

import { useEffect, useRef, useState } from "react";
import { useFormInputClass } from "@/components/form/seniorForm";

type Props = {
  phone: string;
  verifying: boolean;
  sending?: boolean;
  errorMessage: string | null;
  statusMessage?: string | null;
  resendCooldownSec?: number;
  onConfirm: (code: string) => void;
  onResend: () => void;
  onEditPhone: () => void;
};

type OtpCredentialLike = Credential & { code: string };

function isOtpCredential(value: Credential | null): value is OtpCredentialLike {
  return Boolean(
    value &&
      typeof value === "object" &&
      "code" in value &&
      typeof (value as OtpCredentialLike).code === "string",
  );
}

/**
 * V2 OTP screen — Twilio Verify via Main `/api/verify/*`.
 * Mobile autofill: autocomplete=one-time-code (iOS) + WebOTP (Android/Chrome).
 * Auto-submits when 6 digits are present; manual button remains as fallback.
 */
export function StepPhoneVerifyV2({
  phone,
  verifying,
  sending = false,
  errorMessage,
  statusMessage = null,
  resendCooldownSec = 0,
  onConfirm,
  onResend,
  onEditPhone,
}: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedCodeRef = useRef<string | null>(null);
  const onConfirmRef = useRef(onConfirm);
  const inputClass = useFormInputClass();
  const busy = verifying || sending;

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Allow retry with the same digits after a failed check.
  useEffect(() => {
    if (errorMessage) {
      submittedCodeRef.current = null;
    }
  }, [errorMessage]);

  // WebOTP API (Android Chrome) — falls back silently when unavailable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("OTPCredential" in window)) return;
    if (typeof navigator.credentials?.get !== "function") return;

    const ac = new AbortController();

    void (async () => {
      try {
        const credential = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        } as CredentialRequestOptions);

        if (ac.signal.aborted || !isOtpCredential(credential)) return;

        const next = credential.code.replace(/\D/g, "").slice(0, 6);
        if (!next) return;
        setCode(next);
      } catch {
        // User cancel / unsupported / timeout — manual entry remains available.
      }
    })();

    return () => {
      ac.abort();
    };
  }, []);

  // Auto-verify as soon as 6 digits are present (autofill or manual).
  useEffect(() => {
    if (busy) return;
    if (!/^\d{6}$/.test(code)) return;
    if (submittedCodeRef.current === code) return;

    submittedCodeRef.current = code;
    onConfirmRef.current(code);
  }, [busy, code]);

  const canSubmit = /^\d{6}$/.test(code) && !busy;
  const canResend = !busy && resendCooldownSec <= 0;

  function handleManualConfirm() {
    if (!canSubmit) return;
    // Same guard as autofill effect — blocks autofill + click double fire.
    if (submittedCodeRef.current === code) return;
    submittedCodeRef.current = code;
    onConfirm(code);
  }

  return (
    <div>
      <div className="rounded-[22px] bg-brand-soft/70 px-4 py-3.5 text-center">
        <p className="text-balance font-poppins text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.55rem]">
          Saisissez le code reçu par SMS
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
        name="one-time-code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        pattern="[0-9]*"
        maxLength={6}
        value={code}
        disabled={busy}
        enterKeyHint="done"
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, "").slice(0, 6);
          setCode(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSubmit) {
            event.preventDefault();
            handleManualConfirm();
          }
        }}
        className={`${inputClass} text-center text-[1.75rem] font-extrabold tracking-[0.35em] text-[#3b0764]`}
        aria-describedby="v2-phone-otp-help"
      />

      <p
        id="v2-phone-otp-help"
        className="mt-2 text-center text-xs leading-snug text-zinc-500 sm:text-sm"
      >
        Sur mobile, le code peut être proposé automatiquement. Sinon, saisissez-le
        manuellement.
      </p>

      {statusMessage ? (
        <p className="mt-2 text-center text-sm text-zinc-600">{statusMessage}</p>
      ) : null}

      {errorMessage ? (
        <p className="mt-2 text-center text-sm text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleManualConfirm}
          className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-[#9b4ff0] px-6 py-3.5 text-[1.2rem] font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(155,79,240,0.55)] ring-2 ring-[#9b4ff0]/35 transition hover:bg-[#8b3de0] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? "Vérification…" : "Confirmer mon numéro"}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          disabled={!canResend}
          onClick={onResend}
          className="text-[#3b0764] underline underline-offset-2 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:no-underline"
        >
          {sending
            ? "Envoi du code…"
            : resendCooldownSec > 0
              ? `Renvoyer le code (${resendCooldownSec}s)`
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
