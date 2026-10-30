import Image from "next/image";
import type { ReactNode } from "react";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { IkiFooter } from "./IkiFooter";
import { IkiHeader } from "./IkiHeader";
import { IkiIcon, type IkiIconName } from "./IkiIcon";
import { IkiStickyCta } from "./IkiStickyCta";
import "./iki-theme.css";

const CTA_LABEL = "Je compare gratuitement";
const HEADER_CTA_LABEL = "Être rappelé";

/* ---------- Design-system building blocks ---------- */

function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1248px] px-4 min-[900px]:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

/** « SectionHeading »: Manrope capital eyebrow, Outfit title, lead. */
function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  center = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`grid gap-3 ${center ? "justify-items-center text-center" : ""}`}
    >
      <p className="iki-eyebrow text-[var(--violet-500)]">{eyebrow}</p>
      <h2 id={id} className="iki-h2 text-balance">
        {title}
      </h2>
      {lead ? (
        <p className="iki-lead max-w-[62ch] text-[var(--encre-600)]">{lead}</p>
      ) : null}
    </div>
  );
}

function CheckList({
  items,
  className = "",
}: {
  items: readonly ReactNode[];
  className?: string;
}) {
  return (
    <ul className={`m-0 grid list-none gap-3.5 p-0 ${className}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-[1.15rem] leading-[1.5] text-[var(--encre-800)]"
        >
          <IkiIcon
            name="circle-check"
            size={26}
            className="mt-px text-[var(--menthe-500)]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Hero « photo fondue » + formulaire ---------- */

const HERO_POINTS = [
  <>
    <strong>Courtier spécialisé</strong> en mutuelle santé, activité historique
    depuis 2008.
  </>,
  <>
    Un conseiller <strong>compare les garanties</strong> pour vous, pas
    seulement le prix.
  </>,
  <>Un réseau de partenaires assureurs et mutuelles reconnus.</>,
  <>Gratuit et sans engagement : vous êtes libre de ne rien changer.</>,
] as const;

const TRUST_ITEMS: { icon: IkiIconName; label: ReactNode }[] = [
  {
    icon: "star",
    label: (
      <>
        <strong>4,7/5</strong> sur Trustpilot
      </>
    ),
  },
  {
    icon: "message-circle",
    label: (
      <>
        Plus de <strong>3 200 avis</strong>
      </>
    ),
  },
  {
    icon: "users",
    label: (
      <>
        <strong>300 000</strong> clients
      </>
    ),
  },
  {
    icon: "clock",
    label: (
      <>
        Depuis <strong>2008</strong>
      </>
    ),
  },
  { icon: "user-check", label: <>Courtier spécialisé</> },
];

function IkiHero() {
  return (
    <section
      aria-labelledby="hero-titre"
      className="iki-hero relative isolate overflow-hidden"
    >
      <TikTokFunnelTracker />
      <div aria-hidden="true" className="iki-hero-photo">
        <Image
          src="/images/iki/hero-senior.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_28%]"
        />
      </div>
      <div aria-hidden="true" className="iki-hero-veil" />

      <Container className="relative z-[2] grid gap-7 pb-6 pt-7 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,560px)] min-[1000px]:items-start min-[1000px]:gap-14 min-[1000px]:pb-10 min-[1000px]:pt-14">
        <div className="grid content-start gap-5 min-[1000px]:gap-6 min-[1000px]:pt-4">
          <p className="iki-eyebrow text-[var(--mandarine-700)]">
            Mutuelle santé senior
          </p>
          <h1 id="hero-titre" className="iki-display text-balance">
            Votre mutuelle santé, avec un conseiller à vos côtés.
          </h1>
          <p className="iki-lead max-w-[34ch] text-[var(--encre-700)]">
            Un conseiller IKI vous rappelle, compare les garanties et vous dit
            exactement ce que vous payez.
          </p>
          <CheckList items={HERO_POINTS} className="hidden min-[1000px]:grid" />
          <div className="iki-advisor hidden min-[1000px]:flex">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[var(--violet-50)] text-[var(--violet-500)]">
              <IkiIcon name="phone-call" size={24} />
            </span>
            <span className="grid gap-0.5">
              <strong className="text-[1.1rem] text-[var(--encre-900)]">
                Une vraie personne au téléphone
              </strong>
              <span className="text-[1rem] text-[var(--encre-600)]">
                Du lundi au vendredi, 9 h – 18 h
              </span>
            </span>
          </div>
        </div>

        <div id="devis" className="iki-form-shell mx-auto w-full max-w-[560px]">
          <SeniorQuoteForm />
        </div>

        <CheckList items={HERO_POINTS} className="min-[1000px]:hidden" />
      </Container>

      <Container className="relative z-[2] pb-4 min-[1000px]:pb-6">
        <ul
          className="iki-trustbar"
          aria-label="IKI Assurances en quelques chiffres"
        >
          {TRUST_ITEMS.map(({ icon, label }, index) => (
            <li key={index}>
              <IkiIcon
                name={icon}
                size={22}
                className="text-[var(--violet-500)]"
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- Accompagnement (MediaPanel) ---------- */

const SUPPORT_POINTS = [
  "Il fait le point avec vous : hospitalisation, dentaire, optique, audition.",
  "Il compare les garanties de nos partenaires assureurs et mutuelles, pas seulement le prix.",
  "Il vous explique clairement ce qui restera à votre charge, avant que vous choisissiez.",
  "Le même conseiller reste joignable après la signature.",
] as const;

function IkiSupport() {
  return (
    <section aria-labelledby="accompagnement-titre" className="iki-section">
      <Container>
        <div className="iki-panel grid gap-7 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] min-[900px]:items-center min-[900px]:gap-12">
          <div className="relative self-stretch overflow-hidden rounded-[var(--radius-card)]">
            <Image
              src="/seniors-promenade.png"
              alt="Couple de seniors souriants en promenade"
              width={1024}
              height={682}
              sizes="(min-width: 900px) 540px, 100vw"
              className="block aspect-[4/3] h-auto w-full object-cover min-[900px]:aspect-auto min-[900px]:h-full min-[900px]:min-h-[420px]"
            />
            <span className="iki-floating-tag">
              <IkiIcon
                name="user-check"
                size={20}
                className="text-[var(--violet-500)]"
              />
              Un conseiller dédié
            </span>
          </div>
          <div className="grid content-start gap-5">
            <span className="iki-tag iki-tag-menthe">Accompagnement</span>
            <h2
              id="accompagnement-titre"
              className="iki-display-2 text-balance"
            >
              Un expert vous accompagne, du premier appel à la signature.
            </h2>
            <p className="iki-lead text-[var(--encre-700)]">
              Chez IKI, chaque demande est suivie par un conseiller, courtier
              spécialisé en assurance santé. Vous parlez à une vraie personne,
              qui prend le temps de vous expliquer.
            </p>
            <CheckList items={SUPPORT_POINTS} />
            <div>
              <a href="#devis" className="iki-btn iki-btn-primary">
                Parler à un conseiller
                <IkiIcon name="arrow-right" size={22} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Chiffres clés (carte encre) ---------- */

const FIGURES = [
  { figure: "4,7/5", label: "sur Trustpilot pour IKI", stars: true },
  { figure: "3 200+", label: "Plus de 3 200 avis" },
  { figure: "300 000", label: "clients" },
  { figure: "2008", label: "Activité historique depuis 2008" },
] as const;

function IkiFigures() {
  return (
    <section aria-labelledby="confiance-titre" className="iki-section">
      <Container>
        <div className="iki-ink-card grid gap-8">
          <div className="grid gap-3 text-center">
            <p className="iki-eyebrow text-[var(--mandarine-300)]">
              Avis clients
            </p>
            <h2
              id="confiance-titre"
              className="iki-h2 text-balance !text-white"
            >
              Ils nous font confiance, pourquoi pas vous&nbsp;?
            </h2>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 min-[640px]:gap-4 min-[1000px]:grid-cols-4">
            {FIGURES.map((item) => (
              <li key={item.figure} className="iki-figure-tile">
                <span className="iki-figure">{item.figure}</span>
                {"stars" in item ? (
                  <span
                    className="flex gap-1 text-[var(--mandarine-400)]"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="currentColor"
                      >
                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                      </svg>
                    ))}
                  </span>
                ) : null}
                <span className="leading-snug text-[var(--encre-200)]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Les quatre postes (Card) ---------- */

const GUARANTEES: {
  icon: IkiIconName;
  title: string;
  text: string;
  tag: string;
}[] = [
  {
    icon: "building-hospital",
    title: "Hospitalisation",
    text: "Opération, chambre particulière, dépassements d’honoraires : des garanties à vérifier de près.",
    tag: "Votre priorité",
  },
  {
    icon: "mood-smile",
    title: "Dentaire",
    text: "Couronnes, bridges, implants : votre conseiller vous dit ce qui reste à votre charge.",
    tag: "Devis expliqué",
  },
  {
    icon: "eyeglass",
    title: "Optique",
    text: "Monture et verres progressifs : avec le 100 % Santé, certaines lunettes sont sans reste à charge.",
    tag: "100 % Santé",
  },
  {
    icon: "ear",
    title: "Aides auditives",
    text: "Avec le 100 % Santé, certaines aides auditives sont sans reste à charge.",
    tag: "100 % Santé",
  },
];

function IkiGuarantees() {
  return (
    <section aria-labelledby="garanties-titre" className="iki-section">
      <Container className="grid gap-8">
        <SectionHeading
          id="garanties-titre"
          eyebrow="Ce qui compte après 60 ans"
          title="Les quatre postes qui pèsent vraiment"
          lead="Votre conseiller renforce ce que vous utilisez, sans vous faire payer le reste."
        />
        <ul className="m-0 grid list-none gap-4 p-0 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {GUARANTEES.map((item) => (
            <li key={item.title} className="iki-card grid content-start gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-[var(--radius-md)] bg-[var(--violet-50)] text-[var(--violet-500)]">
                <IkiIcon name={item.icon} size={30} />
              </span>
              <h3 className="iki-h3">{item.title}</h3>
              <p className="text-[1.1rem] leading-[1.55] text-[var(--encre-700)]">
                {item.text}
              </p>
              <p className="iki-eyebrow mt-auto pt-1 text-[var(--violet-600)]">
                {item.tag}
              </p>
            </li>
          ))}
        </ul>
        <div className="iki-callout">
          <IkiIcon
            name="info-circle"
            size={26}
            className="mt-0.5 text-[var(--violet-600)]"
          />
          <p>
            <strong>« Reste à charge », en clair.</strong> C’est ce que vous
            payez de votre poche une fois la Sécurité sociale et votre mutuelle
            passées.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Comment ça se passe (StepList sur panneau craie) ---------- */

const STEPS = [
  {
    title: "Vous répondez à 5 questions",
    text: "Moins d’une minute, en ligne.",
  },
  {
    title: "Un conseiller IKI vous rappelle",
    text: "Il étudie votre situation et compare les garanties.",
  },
  {
    title: "Vous choisissez, librement",
    text: "Sans engagement : vous pouvez ne rien changer.",
  },
] as const;

function IkiSteps() {
  return (
    <section aria-labelledby="etapes-titre" className="iki-section">
      <Container>
        <div className="iki-sheet grid gap-8 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[900px]:items-center min-[900px]:gap-12">
          <div className="grid content-start gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-[var(--radius-md)] bg-white text-[var(--violet-500)] shadow-[var(--shadow-sm)]">
              <IkiIcon name="rotate" size={28} />
            </span>
            <p className="iki-eyebrow text-[var(--violet-500)]">
              Comment ça se passe
            </p>
            <h2 id="etapes-titre" className="iki-h2 text-balance">
              Déjà assuré ailleurs&nbsp;? On s’en occupe.
            </h2>
            <p className="text-[1.15rem] leading-[1.6] text-[var(--encre-700)]">
              Depuis la loi du 14 juillet 2019, votre complémentaire santé est
              résiliable à tout moment après un an, sans frais et sans
              justification. Votre conseiller vous accompagne dans les
              démarches, pour éviter tout trou de couverture.
            </p>
          </div>
          <ol className="m-0 grid list-none gap-3 p-0">
            {STEPS.map((step, index) => (
              <li key={step.title} className="iki-step">
                <span
                  className={`iki-step-num ${index === STEPS.length - 1 ? "text-[var(--menthe-500)]" : ""}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid gap-1">
                  <strong className="text-[1.2rem] text-[var(--encre-900)]">
                    {step.title}
                  </strong>
                  <span className="text-[1.05rem] text-[var(--encre-600)]">
                    {step.text}
                  </span>
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
  {
    question: "Combien de temps prend le formulaire ?",
    answer: "Moins d’une minute : 5 questions.",
  },
] as const;

function IkiFaq() {
  return (
    <section aria-labelledby="faq-titre" className="iki-section">
      <Container>
        <div className="mx-auto grid max-w-[860px] gap-8">
          <SectionHeading
            id="faq-titre"
            eyebrow="Questions fréquentes"
            title="Ce que nos clients nous demandent"
            center
          />
          <div className="grid gap-3">
            {FAQ.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="iki-accordion group"
              >
                <summary>
                  {item.question}
                  <IkiIcon
                    name="chevron-down"
                    size={26}
                    className="text-[var(--violet-500)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- CTA final (bandeau encre) ---------- */

function IkiFinalCta() {
  return (
    <section
      aria-labelledby="final-titre"
      className="iki-final mt-16 min-[900px]:mt-24"
    >
      <Container className="grid justify-items-center gap-5 py-16 text-center min-[900px]:py-20">
        <span className="iki-tag iki-tag-inverse">Rappel gratuit</span>
        <h2
          id="final-titre"
          className="iki-display-2 max-w-[18ch] text-balance !text-white"
        >
          Un conseiller IKI vous rappelle.
        </h2>
        <p className="iki-lead max-w-[40ch] text-[var(--encre-200)]">
          5 questions, moins d’une minute. Gratuit et sans engagement.
        </p>
        <a
          href="#devis"
          className="iki-btn iki-btn-accent iki-btn-lg w-full max-w-[420px]"
        >
          {CTA_LABEL}
          <IkiIcon name="arrow-right" size={22} />
        </a>
      </Container>
    </section>
  );
}

/**
 * Co-branded proposal page « IKI Assurances × Couverture Mutuelle » (/iki),
 * built on IKI's design system and reference senior landing page.
 * Same quote form as the homepage (SeniorQuoteForm, logic and tracking
 * untouched); only its look is re-skinned by scoped CSS (iki-theme.css).
 */
export function IkiLanding() {
  return (
    <div className="theme-iki flex min-h-0 flex-1 flex-col">
      <IkiHeader ctaLabel={HEADER_CTA_LABEL} />
      <main className="w-full flex-1">
        <IkiHero />
        <IkiSupport />
        <IkiFigures />
        <IkiGuarantees />
        <IkiSteps />
        <IkiFaq />
        <IkiFinalCta />
      </main>
      <IkiFooter />
      <IkiStickyCta ctaLabel={CTA_LABEL} />
    </div>
  );
}
