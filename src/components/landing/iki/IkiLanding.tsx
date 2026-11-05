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

const CTA_LABEL = "Comparer les mutuelles seniors";

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

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="iki-h2 text-balance text-center">
      {children}
    </h2>
  );
}

function CompareLink() {
  return (
    <a href="#devis" className="iki-compare-link">
      <IkiIcon name="arrow-right" size={20} />
      {CTA_LABEL}
    </a>
  );
}

/* ---------- Hero: violet comparator band with the quote form ---------- */

const HERO_REASSURANCE: { icon: IkiIconName; label: string }[] = [
  { icon: "circle-check", label: "Gratuit" },
  { icon: "circle-check", label: "Sans engagement" },
  { icon: "lock", label: "Données protégées" },
];

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
      <Container className="iki-hero-inner">
        <div className="iki-hero-head">
          <div className="iki-hero-text">
            <h1 id="hero-titre" className="iki-hero-title">
              Votre <strong>DEVIS GRATUIT</strong>{" "}
              <span className="whitespace-nowrap">en 2 minutes</span> seulement
            </h1>
            <p className="iki-hero-sub">
              Jusqu’à 150&nbsp;€ d’économies par rapport aux autres offres du
              marché.
              <span className="iki-hero-sub-extra">
                {" "}
                Un conseiller IKI compare pour vous, gratuitement.
              </span>
            </p>
          </div>
          <p className="iki-badge" aria-hidden="true">
            <span className="iki-badge-small">Jusqu’à</span>
            <span className="iki-badge-big">150&nbsp;€</span>
            <span className="iki-badge-small">d’économies</span>
          </p>
        </div>

        <div id="devis" className="iki-form-shell">
          <SeniorQuoteForm consentVariant="iki" onStepChange={onStepChange} />
        </div>

        <ul className="iki-hero-reassurance">
          {HERO_REASSURANCE.map((item) => (
            <li key={item.label}>
              <IkiIcon name={item.icon} size={20} />
              {item.label}
            </li>
          ))}
          {formFocused ? (
            <li>
              <Stars size={16} className="text-[var(--or-500)]" />
              4,7/5 Trustpilot
            </li>
          ) : null}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- Avis clients (Trustpilot rating text + Google reviews) ---------- */

function IkiReviewsSection() {
  return (
    <section aria-labelledby="avis-titre" className="iki-section">
      <Container className="grid gap-6">
        <div className="grid justify-items-center gap-3 text-center">
          <SectionTitle id="avis-titre">
            Avis clients mutuelle senior&nbsp;: nos clients témoignent
          </SectionTitle>
          <div className="grid justify-items-center gap-1.5">
            <Stars size={26} className="text-[var(--or-500)]" />
            <p className="m-0 text-[1.1rem] text-[var(--encre-800)]">
              <span className="whitespace-nowrap">
                Note de <strong>4,7/5</strong> sur Trustpilot
              </span>{" "}
              ·{" "}
              <strong className="whitespace-nowrap">plus de 3&nbsp;200 avis</strong>
            </p>
          </div>
          <p className="iki-google-label">
            <span aria-hidden="true" className="iki-google-g">
              G
            </span>
            Quelques avis Google
          </p>
        </div>
        <IkiReviews />
      </Container>
    </section>
  );
}

/* ---------- Comparaison : exemple illustratif avant / après ---------- */

type Split = { secu: number; mutuelle: number; reste: number };

const EXAMPLE: {
  tone: "avant" | "apres";
  title: string;
  subtitle: string;
  split: Split;
  note: ReactNode;
}[] = [
  {
    tone: "avant",
    title: "Remboursements avant",
    subtitle: "mutuelle classique",
    split: { secu: 20, mutuelle: 9, reste: 31 },
    note: (
      <>
        Reste à charge&nbsp;: <strong>31&nbsp;€</strong>
      </>
    ),
  },
  {
    tone: "apres",
    title: "Remboursements après",
    subtitle: "mutuelle senior adaptée",
    split: { secu: 20, mutuelle: 39, reste: 1 },
    note: (
      <>
        Reste à charge&nbsp;: <strong>1&nbsp;€</strong>
      </>
    ),
  },
];

const SPLIT_PARTS: { key: keyof Split; label: string }[] = [
  { key: "secu", label: "Remboursement Sécu" },
  { key: "mutuelle", label: "Mutuelle" },
  { key: "reste", label: "Reste à charge" },
];

function SplitBar({ split }: { split: Split }) {
  const total = split.secu + split.mutuelle + split.reste;
  return (
    <div className="iki-split" role="img" aria-label={SPLIT_PARTS.map((p) => `${p.label} ${split[p.key]} €`).join(", ")}>
      {SPLIT_PARTS.map((part) => (
        <span
          key={part.key}
          className={`iki-split-${part.key}`}
          style={{ flexGrow: split[part.key] / total, flexBasis: 0 }}
        >
          {split[part.key] >= 5 ? `${split[part.key]} €` : ""}
        </span>
      ))}
    </div>
  );
}

function IkiComparison() {
  return (
    <section aria-labelledby="comparaison-titre" className="iki-band iki-band-lavender">
      <Container className="grid gap-6">
        <div className="mx-auto grid max-w-[820px] gap-3 text-center">
          <SectionTitle id="comparaison-titre">
            Comparaison mutuelle senior&nbsp;: économisez sur vos frais de santé
          </SectionTitle>
          <p className="iki-lead-text">
            Une mutuelle senior répond aux besoins spécifiques après 60 ans.
            Elle couvre les frais de santé essentiels comme l’<strong>optique</strong>,
            le <strong>dentaire</strong> et l’<strong>audition</strong>, souvent
            mal remboursés par l’Assurance Maladie.
          </p>
        </div>
        <div className="grid gap-4 min-[900px]:grid-cols-2 min-[900px]:gap-6">
          {EXAMPLE.map((item) => (
            <div key={item.tone} className={`iki-example iki-example-${item.tone}`}>
              <span className="iki-example-tag">Exemple illustratif</span>
              <p className="iki-example-title">
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </p>
              <SplitBar split={item.split} />
              <ul className="iki-split-legend">
                {SPLIT_PARTS.map((part) => (
                  <li key={part.key}>
                    <span aria-hidden="true" className={`iki-split-${part.key}`} />
                    {part.label}
                  </li>
                ))}
              </ul>
              <p className="iki-example-note">{item.note}</p>
            </div>
          ))}
        </div>
        <p className="m-0 text-center text-[0.95rem] text-[var(--encre-600)]">
          Exemple illustratif, montants non contractuels&nbsp;: les
          remboursements dépendent du contrat et des garanties choisies.
        </p>
      </Container>
    </section>
  );
}

/* ---------- Avantages ---------- */

const ADVANTAGES_CHECKS = [
  "Tiers payant – sans avance de frais",
  "On s’occupe de résilier votre ancienne mutuelle",
] as const;

const CARE_AREAS: { icon: IkiIconName; title: string; caption: string }[] = [
  { icon: "vaccine", title: "Médecine générale", caption: "Consultations, analyses, pharmacie" },
  { icon: "eyeglass", title: "Optique senior", caption: "Lunettes et lentilles" },
  { icon: "ear", title: "Audition senior", caption: "Appareils auditifs" },
  { icon: "dental", title: "Dentaire senior", caption: "Soins et prothèses" },
];

function IkiAdvantages() {
  return (
    <section aria-labelledby="avantages-titre" className="iki-band">
      <Container className="grid gap-7">
        <div className="grid justify-items-center gap-4">
          <SectionTitle id="avantages-titre">
            Avantages d’une mutuelle senior adaptée à vos besoins
          </SectionTitle>
          <ul className="iki-checks">
            {ADVANTAGES_CHECKS.map((label) => (
              <li key={label}>
                <IkiIcon name="circle-check" size={24} className="text-[var(--menthe-500)]" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <ul className="iki-care-grid">
          {CARE_AREAS.map((area) => (
            <li key={area.title}>
              <IkiIcon name={area.icon} size={56} strokeWidth={1.5} className="text-[var(--violet-500)]" />
              <strong>{area.title}</strong>
              <span>{area.caption}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- 3 étapes ---------- */

const STEPS = [
  {
    title: "Devis mutuelle senior personnalisé",
    text: "Répondez à 5 questions sur votre profil et vos besoins, depuis chez vous.",
  },
  {
    title: "Comparaison des offres senior",
    text: "Un conseiller IKI compare gratuitement les offres de nos partenaires assureurs et mutuelles reconnus.",
  },
  {
    title: "Souscription et résiliation simplifiées",
    text: "Vous choisissez librement. Nous résilions votre ancien contrat pour vous simplifier les démarches.",
  },
] as const;

function IkiSteps() {
  return (
    <section aria-labelledby="etapes-titre" className="iki-band iki-band-lavender">
      <Container className="iki-steps-grid">
        <div aria-hidden="true" className="iki-steps-art">
          <span className="iki-steps-art-circle">
            <IkiIcon name="file-text" size={72} strokeWidth={1.5} />
          </span>
        </div>
        <div className="grid gap-6">
          <h2 id="etapes-titre" className="iki-h2 text-balance">
            Souscrire une mutuelle senior en 3 étapes simples
          </h2>
          <ol className="iki-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true" className="iki-step-num">
                  {index + 1}
                </span>
                <span className="grid gap-1">
                  <strong>
                    Étape {index + 1}&nbsp;: {step.title}
                  </strong>
                  <span>{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ---------- FAQ (Accordion) ---------- */

const FAQ = [
  {
    question: "Pourquoi comparer les mutuelles seniors ?",
    answer:
      "Avec l’âge, les besoins en santé évoluent : lunettes, prothèses dentaires, appareils auditifs, hospitalisation… Comparer plusieurs offres permet de trouver le meilleur rapport garanties / prix, sans payer pour des options inutiles.",
  },
  {
    question: "À partir de quel âge peut-on souscrire une mutuelle senior ?",
    answer:
      "Il n’y a pas d’âge minimum légal. Les offres dites « senior » s’adressent en général aux personnes de 60 ans et plus, retraitées ou non.",
  },
  {
    question: "Quels soins sont particulièrement couverts par une mutuelle senior ?",
    answer:
      "Les postes les plus utiles après 60 ans : optique, dentaire, audition et hospitalisation. Le niveau de remboursement dépend des garanties choisies.",
  },
  {
    question: "Est-ce payant d’utiliser le comparateur ?",
    answer:
      "Non. Le service est entièrement gratuit et sans engagement : vous êtes libre de ne rien changer.",
  },
  {
    question: "Combien de temps faut-il pour recevoir les devis ?",
    answer:
      "Répondre aux 5 questions prend environ 2 minutes. Un conseiller IKI, courtier spécialisé en mutuelle santé, vous recontacte ensuite pour vous présenter les offres adaptées.",
  },
] as const;

function IkiFaq() {
  return (
    <section aria-labelledby="faq-titre" className="iki-band">
      <Container>
        <div className="mx-auto grid max-w-[880px] gap-6">
          <SectionTitle id="faq-titre">Questions fréquentes</SectionTitle>
          <div className="grid gap-3">
            {FAQ.map((item, index) => (
              <details
                key={item.question}
                className="iki-accordion group"
                open={index === 0}
              >
                <summary>
                  {item.question}
                  <IkiIcon
                    name="chevron-down"
                    size={26}
                    className="flex-none text-[var(--violet-500)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="iki-accordion-body">
                  <p>{item.answer}</p>
                  <CompareLink />
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * IKI comparator landing (/iki) for Meta senior traffic, modelled on IKI's
 * own « comparateur mutuelle senior » page: white header with the comparator
 * claim, violet band holding the quote form, reviews, illustrative
 * before / after example, advantages, 3 steps, FAQ, footer.
 * The quote form (SeniorQuoteForm, consentVariant="iki") is the shared one:
 * questions, texts, logic, submission and tracking are untouched; only its
 * look is re-skinned by scoped CSS (iki-theme.css).
 * From question 2 onward, content below the form is hidden.
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
      <main className="w-full flex-1">
        <IkiHero formFocused={formFocused} onStepChange={onStepChange} />
        {!formFocused ? (
          <>
            <IkiReviewsSection />
            <IkiComparison />
            <IkiAdvantages />
            <IkiSteps />
            <IkiFaq />
          </>
        ) : null}
      </main>
      {!formFocused ? <IkiFooter /> : null}
    </div>
  );
}
