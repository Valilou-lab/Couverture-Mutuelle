"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type QuoteFormData } from "@/components/form/types";
import { FormNavigation } from "@/components/form/FormNavigation";
import type { FieldErrors } from "@/components/form/validation";
import {
  SENIOR_ERROR,
  SENIOR_LABEL,
  useFormInputClass,
} from "@/components/form/seniorForm";
import {
  getV2EmailClientIssue,
  validateV2EmailOnServer,
  V2_EMAIL_INVALID_MESSAGE,
  V2_EMAIL_VERIFYING_MESSAGE,
} from "./emailValidation";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onNext: () => void;
};

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
 * Email alone (before phone) — reduces abandonment vs combined contact.
 */
export function StepEmailV2({
  data,
  errors,
  disabled = false,
  onPatch,
  onNext,
}: Props) {
  const inputClass = useFormInputClass();
  const inputErrorClass = `${inputClass} border-error focus:border-error focus:ring-error/20`;
  const [emailUi, setEmailUi] = useState<EmailUiState>({ status: "idle" });
  const [emailTouched, setEmailTouched] = useState(false);
  const verifySeq = useRef(0);

  const emailTrimmed = data.email.trim();
  const clientIssue = getV2EmailClientIssue(data.email);
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

  async function handleNext() {
    setEmailTouched(true);

    const issue = getV2EmailClientIssue(data.email);
    if (issue) {
      setEmailUi({
        status: "error",
        email: emailTrimmed,
        message: issue.message,
        ...(issue.kind === "typo" ? { suggestion: issue.suggestion } : {}),
      });
      return;
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
          Vous y êtes presque&nbsp;!
        </h2>
        <div className="mx-auto mt-3 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-left sm:px-4 sm:py-3.5">
          <p className="flex items-start gap-2.5 text-[0.875rem] font-medium leading-snug text-emerald-900 sm:text-[0.9rem]">
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.65rem] font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>
              Vous verrez quels courtiers peuvent vous proposer un devis en
              dernière étape.
            </span>
          </p>
        </div>
      </header>

      <div className="mt-4">
        <label htmlFor="v2-email" className={SENIOR_LABEL}>
          Votre adresse e-mail
        </label>
        <input
          id="v2-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="jean.dupont@exemple.fr"
          value={data.email}
          onChange={(event) => {
            onPatch({ email: event.target.value });
          }}
          onBlur={() => {
            void handleEmailBlur();
          }}
          aria-invalid={showEmailError}
          className={showEmailError ? inputErrorClass : inputClass}
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
        ) : (
          <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500 sm:text-sm">
            Pour vous envoyer le récapitulatif de votre demande.
          </p>
        )}
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

      <FormNavigation
        onNext={() => {
          void handleNext();
        }}
        nextLabel={
          disabled || emailUi.status === "verifying"
            ? "Vérification…"
            : "Continuer"
        }
        disabled={disabled || emailUi.status === "verifying"}
        canContinue={
          !disabled &&
          emailUi.status !== "verifying" &&
          Boolean(emailTrimmed) &&
          !clientIssue
        }
      />

      <p className="mt-3 text-center text-[0.75rem] leading-snug text-zinc-500 sm:text-[0.78rem]">
        Couverture Mutuelle (VALEADATA SL) traite vos données pour vous
        présenter les courtiers disponibles. Aucune donnée n’est transmise à un
        courtier sans votre accord à l’étape suivante.{" "}
        <Link
          href="/politique-de-confidentialite"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#5b21b6] underline underline-offset-2 hover:text-[#7c3aed]"
        >
          Politique de confidentialité
        </Link>
      </p>
    </div>
  );
}
