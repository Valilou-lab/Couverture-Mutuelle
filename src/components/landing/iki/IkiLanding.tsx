"use client";

import { useCallback, useState, type ReactNode } from "react";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import type { FormStepId } from "@/components/form/types";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { IkiFooter } from "./IkiFooter";
import { IkiHeader } from "./IkiHeader";
import { IkiIcon, type IkiIconName } from "./IkiIcon";
import { IkiReviews } from "./IkiReviews";
import { Stars } from "./IkiStars";
import "./iki-theme.css";

/** From question 2 through analyzing / confirmation — strip marketing below the form. */
function isIkiFormFocused(
  step: FormStepId,
  questionNumber: number | null,
): boolean {
  if (step === "analyzing" || step === "confirmation") return true;
  return questionNumber != null && questionNumber >= 2;
}

const CTA_LABEL = "Je compare gratuitement";

function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1120px] px-4 min-[900px]:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

/** One-line reassurance under the headline (approved IKI facts only). */
function IkiProofLine() {
  return (
    <p className="iki-proof">
      <span className="iki-proof-item">
        <span aria-hidden="true" className="iki-proof-star">
          ★
        </span>{" "}
        <strong>4,7/5</strong> Trustpilot
      </span>
      <span aria-hidden="true" className="iki-proof-dot">
        ·
      </span>
      <span className="iki-proof-item">
        <strong>300&nbsp;000</strong> clients
      </span>
      <span aria-hidden="true" className="iki-proof-dot">
        ·
      </span>
      <span className="iki-proof-item">depuis 2008</span>
    </p>
  );
}

function IkiTrustpilotNote() {
  return (
    <p className="m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[1.05rem] text-[var(--encre-700)]">
      <Stars size={20} className="text-[var(--or-500)]" />
      <span>
        <strong className="text-[var(--encre-900)]">4,7/5</strong> sur
        Trustpilot
      </span>
    </p>
  );
}

/* ---------- Hero: logo (header), headline, proof line, form ---------- */

function IkiHero({
  formFocused,
  onStepChange,
}: {
  formFocused: boolean;
  onStepChange: (step: FormStepId, questionNumber: number | null) => void;
}) {
  return (
    <section aria-labelledby="hero-titre" className="iki-hero">
      <TikTokFunnelTracker />
      <Container className="iki-hero-grid">
        <div className="iki-hero-text">
          <h1 id="hero-titre" className="iki-hero-title text-balance">
            Une offre{" "}
            <span className="iki-logo-word">11&nbsp;% moins chère</span> que
            le marché
          </h1>
          <p className="iki-hero-sub text-balance">
            Jusqu’à <strong>150&nbsp;€ d’économie</strong> par rapport aux
            autres offres du marché. Un conseiller IKI compare pour vous,
            gratuitement.
          </p>
          <IkiProofLine />
        </div>

        <div
          id="devis"
          className="iki-form-shell mx-auto grid w-full max-w-[560px] gap-4"
        >
          <SeniorQuoteForm consentVariant="iki" onStepChange={onStepChange} />
          {formFocused ? <IkiTrustpilotNote /> : null}
        </div>
      </Container>
    </section>
  );
}

/* ---------- Pourquoi IKI (trust, approved facts only) ---------- */

const TRUST_FIGURES: {
  icon: IkiIconName | null;
  figure: string;
  label: string;
}[] = [
  { icon: null, figure: "4,7/5", label: "sur Trustpilot" },
  { icon: "message-circle", figure: "3 200+", label: "avis clients" },
  { icon: "users", figure: "300 000", label: "clients" },
  { icon: "clock", figure: "Depuis 2008", label: "courtier spécialisé" },
];

function IkiTrust() {
  return (
    <section aria-labelledby="confiance-titre" className="iki-section">
      <Container className="grid gap-6">
        <div className="grid gap-2 text-center">
          <p className="iki-eyebrow text-[var(--violet-500)]">
            Pourquoi IKI
          </p>
          <h2 id="confiance-titre" className="iki-h2 text-balance">
            Un courtier spécialisé, à vos côtés
          </h2>
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 min-[900px]:grid-cols-4 min-[900px]:gap-4">
          {TRUST_FIGURES.map((item) => (
            <li key={item.figure} className="iki-trust-tile">
              {item.icon ? (
                <IkiIcon
                  name={item.icon}
                  size={24}
                  className="text-[var(--violet-500)]"
                />
              ) : (
                <Stars size={18} className="text-[var(--or-500)]" />
              )}
              <span className="iki-trust-figure">{item.figure}</span>
              <span className="iki-trust-label">{item.label}</span>
            </li>
          ))}
        </ul>
        <p className="iki-trust-note">
          <IkiIcon
            name="user-check"
            size={26}
            className="mt-0.5 flex-none text-[var(--violet-500)]"
          />
          <span>
            <strong>Courtier spécialisé en mutuelle santé</strong>, IKI compare
            pour vous les offres d’un réseau de partenaires assureurs et
            mutuelles reconnus. Gratuit et sans engagement.
          </span>
        </p>
      </Container>
    </section>
  );
}

/* ---------- Avis Google ---------- */

function IkiReviewsSection() {
  return (
    <section className="iki-section">
      <Container>
        <IkiReviews />
      </Container>
    </section>
  );
}

/* ---------- FAQ (Accordion) ---------- */

const FAQ = [
  {
    question: "Le service est-il vraiment gratuit ?",
    answer:
      "Oui, entièrement gratuit et sans engagement. Vous êtes libre de ne rien changer.",
  },
  {
    question: "Qui va me rappeler ?",
    answer:
      "Un conseiller IKI Assurances, courtier spécialisé en mutuelle santé. Il étudie votre situation et vous présente des offres adaptées de nos partenaires assureurs et mutuelles.",
  },
  {
    question: "Je suis déjà assuré ailleurs. Puis-je changer ?",
    answer:
      "Oui. Après un an de contrat, votre complémentaire santé est résiliable à tout moment, sans frais et sans justification.",
  },
  {
    question: "Comment sont utilisées mes données ?",
    answer:
      "Uniquement pour vous proposer des offres de complémentaire santé. Vous pouvez retirer votre accord à tout moment.",
  },
] as const;

function IkiFaq() {
  return (
    <section aria-labelledby="faq-titre" className="iki-section">
      <Container>
        <div className="mx-auto grid max-w-[760px] gap-6">
          <div className="grid gap-2 text-center">
            <p className="iki-eyebrow text-[var(--violet-500)]">
              Questions fréquentes
            </p>
            <h2 id="faq-titre" className="iki-h2 text-balance">
              Vos questions, nos réponses
            </h2>
          </div>
          <div className="grid gap-3">
            {FAQ.map((item) => (
              <details key={item.question} className="iki-accordion group">
                <summary>
                  {item.question}
                  <IkiIcon
                    name="chevron-down"
                    size={26}
                    className="flex-none text-[var(--violet-500)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="grid justify-items-center pt-2">
            <a
              href="#devis"
              className="iki-btn iki-btn-accent iki-btn-lg w-full max-w-[420px]"
            >
              {CTA_LABEL}
              <IkiIcon name="arrow-right" size={22} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * IKI landing (/iki) for Meta senior traffic — short, form-first.
 * First mobile screen: IKI logo, headline echoing the ads (one offer 11 %
 * cheaper than the market / up to 150 € saved), one proof line, and the
 * first question of the quote form. Below: trust, Google reviews, FAQ.
 * The quote form (SeniorQuoteForm, consentVariant="iki") is the shared one:
 * questions, texts, logic, submission and tracking are untouched; only its
 * look is re-skinned by scoped CSS (iki-theme.css).
 * From question 2 onward, content below the form is replaced by the
 * Trustpilot rating.
 */
export function IkiLanding() {
  const [formFocused, setFormFocused] = useState(false);

  const onStepChange = useCallback(
    (step: FormStepId, questionNumber: number | null) => {
      setFormFocused(isIkiFormFocused(step, questionNumber));
    },
    [],
  );

  return (
    <div className="theme-iki flex min-h-0 flex-1 flex-col">
      <IkiHeader />
      <main className="w-full flex-1 pb-14 min-[900px]:pb-20">
        <IkiHero formFocused={formFocused} onStepChange={onStepChange} />
        {!formFocused ? (
          <>
            <IkiTrust />
            <IkiReviewsSection />
            <IkiFaq />
          </>
        ) : null}
      </main>
      {!formFocused ? <IkiFooter /> : null}
    </div>
  );
}
