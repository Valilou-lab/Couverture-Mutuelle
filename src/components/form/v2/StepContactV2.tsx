"use client";

import { useEffect, useRef, useState } from "react";
import { type QuoteFormData } from "@/components/form/types";
import { FormNavigation } from "@/components/form/FormNavigation";
import type { FieldErrors } from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_INPUT,
  SENIOR_LABEL,
} from "@/components/form/seniorForm";
import {
  getV2PhoneInputError,
  normalizeV2PhoneToE164,
} from "@/lib/v2/phone";
import {
  getV2EmailClientIssue,
  isV2PhoneComplete,
  validateV2EmailOnServer,
  V2_EMAIL_INVALID_MESSAGE,
  V2_EMAIL_VERIFYING_MESSAGE,
} from "./emailValidation";

const PHONE_INPUT_ERROR =
  `${SENIOR_INPUT} border-error focus:border-error focus:ring-error/20`;

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  submitError?: string | null;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

const EMAIL_INPUT_ERROR =
  `${SENIOR_INPUT} border-error focus:border-error focus:ring-error/20`;

type EmailUiState =
  | { status: "idle" }
  | { status: "verifying" }
  | { status: "ok"; email: string }
  | {
      status: "error";
      email: string;
      message: string;
      suggestion?: string;
    };

/**
 * Q5 — email + phone, then « Vérifier les offres ».
 * Format + typo on blur; MX via `/api/v2/validate-email` before CTA unlock.
 */
export function StepContactV2({
  data,
  errors,
  disabled = false,
  submitError = null,
  onPatch,
  onNext,
}: Props) {
  const [emailUi, setEmailUi] = useState<EmailUiState>({ status: "idle" });
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const verifySeq = useRef(0);

  const emailTrimmed = data.email.trim();
  const clientIssue = getV2EmailClientIssue(data.email);
  const phoneOk = isV2PhoneComplete(data);
  const phoneErrorMessage =
    errors.phone ||
    (phoneTouched ? getV2PhoneInputError(data.phone) : null);
  const showPhoneError = Boolean(phoneErrorMessage);
  const emailServerOk =
    emailUi.status === "ok" && emailUi.email === emailTrimmed;

  const emailErrorMessage = (() => {
    if (errors.email) return errors.email;
    if (!emailTouched) return null;
    if (clientIssue) return clientIssue.message;
    if (emailUi.status === "error" && emailUi.email === emailTrimmed) {
      return emailUi.message;
    }
    return null;
  })();

  const suggestion =
    (clientIssue?.kind === "typo" ? clientIssue.suggestion : undefined) ??
    (emailUi.status === "error" && emailUi.email === emailTrimmed
      ? emailUi.suggestion
      : undefined);

  const showEmailError = Boolean(emailErrorMessage);
  const showVerifying =
    emailUi.status === "verifying" && !clientIssue && !showEmailError;

  // Invalidate MX result when the address changes.
  useEffect(() => {
    setEmailUi((prev) => {
      if (
        (prev.status === "ok" || prev.status === "error") &&
        prev.email !== emailTrimmed
      ) {
        return { status: "idle" };
      }
      return prev;
    });
  }, [emailTrimmed]);

  async function runServerValidation(email: string): Promise<boolean> {
    const seq = ++verifySeq.current;
    setEmailUi({ status: "verifying" });

    try {
      const result = await validateV2EmailOnServer(email);
      if (seq !== verifySeq.current) return false;

      if (result.ok) {
        setEmailUi({ status: "ok", email });
        return true;
      }

      setEmailUi({
        status: "error",
        email,
        message: result.message || V2_EMAIL_INVALID_MESSAGE,
        ...(result.suggestion ? { suggestion: result.suggestion } : {}),
      });
      return false;
    } catch {
      if (seq !== verifySeq.current) return false;
      setEmailUi({
        status: "error",
        email,
        message: V2_EMAIL_INVALID_MESSAGE,
      });
      return false;
    }
  }

  async function handleEmailBlur() {
    setEmailTouched(true);
    const issue = getV2EmailClientIssue(data.email);
    if (issue) {
      verifySeq.current += 1;
      setEmailUi({
        status: "error",
        email: emailTrimmed,
        message: issue.message,
        ...(issue.kind === "typo" ? { suggestion: issue.suggestion } : {}),
      });
      return;
    }

    if (!emailTrimmed) return;
    if (emailUi.status === "ok" && emailUi.email === emailTrimmed) return;
    if (emailUi.status === "verifying") return;

    await runServerValidation(emailTrimmed);
  }

  function applySuggestion(nextEmail: string) {
    onPatch({ email: nextEmail });
    setEmailTouched(true);
    verifySeq.current += 1;
    setEmailUi({ status: "idle" });

    void (async () => {
      const issue = getV2EmailClientIssue(nextEmail);
      if (issue) {
        setEmailUi({
          status: "error",
          email: nextEmail.trim(),
          message: issue.message,
          ...(issue.kind === "typo" ? { suggestion: issue.suggestion } : {}),
        });
        return;
      }
      await runServerValidation(nextEmail.trim());
    })();
  }

  function handlePhoneBlur() {
    setPhoneTouched(true);
    const e164 = normalizeV2PhoneToE164(data.phone);
    if (e164 && e164 !== data.phone.trim()) {
      onPatch({ phone: e164 });
    }
  }

  async function handleNext() {
    setEmailTouched(true);
    setPhoneTouched(true);

    const issue = getV2EmailClientIssue(data.email);
    if (issue || !phoneOk) {
      if (issue) {
        setEmailUi({
          status: "error",
          email: emailTrimmed,
          message: issue.message,
          ...(issue.kind === "typo" ? { suggestion: issue.suggestion } : {}),
        });
      }
      return;
    }

    const e164 = normalizeV2PhoneToE164(data.phone);
    if (e164 && e164 !== data.phone.trim()) {
      onPatch({ phone: e164 });
    }

    if (emailServerOk) {
      onNext();
      return;
    }

    const ok = await runServerValidation(emailTrimmed);
    if (ok) onNext();
  }

  return (
    <div>
      <header className="text-center">
        <h2 className="text-balance font-poppins text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-brand sm:text-[1.55rem]">
          Plus qu’une étape&nbsp;!
        </h2>
        <p className="mt-1.5 text-[0.9rem] leading-snug text-zinc-500 sm:text-[0.95rem]">
          Renseignez votre e-mail et votre numéro de téléphone pour vérifier
          les offres disponibles pour votre profil.
        </p>
      </header>

      <div className="mt-4">
        <label htmlFor="v2-email" className={SENIOR_LABEL}>
          E-mail
        </label>
        <input
          id="v2-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="prenom.nom@exemple.fr"
          value={data.email}
          onChange={(event) => {
            onPatch({ email: event.target.value });
          }}
          onBlur={() => {
            void handleEmailBlur();
          }}
          aria-invalid={showEmailError}
          className={showEmailError ? EMAIL_INPUT_ERROR : SENIOR_INPUT}
        />
        {showVerifying ? (
          <p className="mt-2 text-sm text-zinc-500" aria-live="polite">
            {V2_EMAIL_VERIFYING_MESSAGE}
          </p>
        ) : null}
        {emailErrorMessage ? (
          <p className={SENIOR_ERROR} role="alert">
            {emailErrorMessage}
          </p>
        ) : null}
        {suggestion ? (
          <button
            type="button"
            className="mt-2 text-left text-sm font-semibold text-[#5b21b6] underline-offset-2 hover:underline"
            onClick={() => applySuggestion(suggestion)}
          >
            Utiliser {suggestion}
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        <label htmlFor="v2-phone" className={SENIOR_LABEL}>
          Téléphone
        </label>
        <input
          id="v2-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
          value={data.phone}
          onChange={(event) => onPatch({ phone: event.target.value })}
          onBlur={handlePhoneBlur}
          aria-invalid={showPhoneError}
          className={showPhoneError ? PHONE_INPUT_ERROR : SENIOR_INPUT}
        />
        {phoneErrorMessage ? (
          <p className={SENIOR_ERROR} role="alert">
            {phoneErrorMessage}
          </p>
        ) : null}
      </div>

      <aside
        className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-[#fffbeb] px-3 py-2 text-left sm:px-3.5 sm:py-2.5"
        aria-label="Une dernière vérification ensuite"
      >
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-amber-700/80"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[1.125rem] w-[1.125rem]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2.5" />
            <path d="M10 18h4" />
            <path d="M9 7h4.5" />
            <path d="M9 10.5h6" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold leading-snug text-amber-950/80 sm:text-sm">
            Une dernière vérification ensuite
          </p>
          <p className="mt-0.5 text-[0.75rem] leading-snug text-amber-950/60 sm:text-[0.8125rem]">
            Votre dossier sera confirmé grâce à un code reçu par SMS. Cela nous
            permet de vérifier votre numéro et de sécuriser votre demande.
          </p>
        </div>
      </aside>

      {submitError ? (
        <p className={`${SENIOR_ERROR} mt-3`} role="alert">
          {submitError}
        </p>
      ) : null}

      <FormNavigation
        onNext={() => {
          void handleNext();
        }}
        nextLabel={
          disabled || emailUi.status === "verifying"
            ? "Vérification…"
            : "Vérifier les offres"
        }
        disabled={
          disabled ||
          emailUi.status === "verifying" ||
          !phoneOk ||
          !emailServerOk
        }
      />
    </div>
  );
}
