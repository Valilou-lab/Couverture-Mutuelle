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
  /**
   * Fired once after the minimal WebOTP get() is armed (or immediately if
   * unsupported). Parent sends the SMS from here.
   */
  onReadyForSms: () => void;
  onEditPhone: () => void;
};

/** TEMP — one shared get() across React Strict Mode remounts. */
type WebOtpProbeStore = {
  started: boolean;
  smsRequested: boolean;
  promise: Promise<Credential | null> | null;
  lastDebug: string;
};

const WEBOTP_STORE_KEY = "__cm_webotp_minimal_store";

function getWebOtpStore(): WebOtpProbeStore {
  const w = window as Window & { [WEBOTP_STORE_KEY]?: WebOtpProbeStore };
  if (!w[WEBOTP_STORE_KEY]) {
    w[WEBOTP_STORE_KEY] = {
      started: false,
      smsRequested: false,
      promise: null,
      lastDebug: "",
    };
  }
  return w[WEBOTP_STORE_KEY];
}

/**
 * V2 OTP screen — Twilio Verify via Main `/api/verify/*`.
 * TEMP: minimal WebOTP diagnostic with on-screen debug (no DevTools needed).
 */
export function StepPhoneVerifyV2({
  phone,
  verifying,
  sending = false,
  errorMessage,
  statusMessage = null,
  resendCooldownSec = 0,
  onConfirm,
  onReadyForSms,
  onEditPhone,
}: Props) {
  const [code, setCode] = useState("");
  const [webotpDebug, setWebotpDebug] = useState("…");
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedCodeRef = useRef<string | null>(null);
  const onConfirmRef = useRef(onConfirm);
  const onReadyForSmsRef = useRef(onReadyForSms);
  const inputClass = useFormInputClass();
  const busy = verifying || sending;

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    onReadyForSmsRef.current = onReadyForSms;
  }, [onReadyForSms]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      submittedCodeRef.current = null;
    }
  }, [errorMessage]);

  // TEMP minimal WebOTP probe — ONE get(), no re-arm, no cleanup abort.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const store = getWebOtpStore();
    const supported = "OTPCredential" in window;
    const inIframe = window.top !== window.self;
    const originLines = [
      `WEBOTP_SUPPORTED: ${supported}`,
      `href: ${window.location.href}`,
      `origin: ${window.location.origin}`,
      `hostname: ${window.location.hostname}`,
      `top===self: ${window.top === window.self}`,
      `visibilityState: ${document.visibilityState}`,
      `SMS domain must match: @${window.location.hostname} #CODE`,
      inIframe
        ? `iframe: YES — SMS must include @${window.location.hostname} #CODE AND @${window.location.origin} #CODE (iframe WebOTP syntax)`
        : `iframe: NO`,
    ].join("\n");

    if (!supported) {
      store.lastDebug = originLines;
      setWebotpDebug(originLines);
      if (!store.smsRequested) {
        store.smsRequested = true;
        onReadyForSmsRef.current();
      }
      return;
    }

    if (!store.started) {
      store.started = true;
      store.lastDebug = `${originLines}\nWEBOTP_WAITING`;
      const ac = new AbortController();
      // Intentionally no cleanup abort — isolates whether Chrome returns otp.code.
      store.promise = navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: ac.signal,
      } as CredentialRequestOptions);
      if (!store.smsRequested) {
        store.smsRequested = true;
        onReadyForSmsRef.current();
      }
    } else if (!store.lastDebug.includes("hostname:")) {
      // Remount before SUCCESS/ERROR — refresh origin lines, keep waiting status.
      store.lastDebug = `${originLines}\nWEBOTP_WAITING`;
    }

    setWebotpDebug(store.lastDebug || `${originLines}\nWEBOTP_WAITING`);

    const promise = store.promise;
    if (!promise) return;

    promise
      .then((otp) => {
        const cred = otp as (Credential & { code?: string }) | null;
        const raw = cred?.code;
        const line = `SUCCESS: ${raw ?? "NO_CODE"}`;
        store.lastDebug = `${originLines}\n${line}`;
        setWebotpDebug(store.lastDebug);
        if (raw) {
          const next = String(raw).replace(/\D/g, "").slice(0, 6);
          setCode(next);
          if (/^\d{6}$/.test(next)) {
            submittedCodeRef.current = next;
            onConfirmRef.current(next);
          }
        }
      })
      .catch((err: unknown) => {
        const name = err instanceof Error ? err.name : "Unknown";
        const message = err instanceof Error ? err.message : String(err);
        const line = `ERROR: ${name} - ${message}`;
        store.lastDebug = `${originLines}\n${line}`;
        setWebotpDebug(store.lastDebug);
      });
  }, []);

  // Manual entry auto-verify only (WebOTP calls onConfirm directly above).
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

      {/* TEMP WebOTP on-screen debug — remove after Android probe */}
      <pre
        className="mt-3 overflow-x-auto rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-left text-[0.75rem] font-mono leading-relaxed text-amber-950 whitespace-pre-wrap"
        data-testid="webotp-debug"
      >
        {webotpDebug}
      </pre>

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
          onClick={() => {
            // TEMP: resend SMS only — do not re-arm WebOTP during this probe.
            onReadyForSms();
          }}
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
