import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Check, HeartHandshake, PhoneCall, Quote, ShieldCheck, Timer } from "lucide-react";
import { SeniorQuoteForm } from "@/components/form/SeniorQuoteForm";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";
import { IkiFooter } from "./IkiFooter";
import { IkiHeader } from "./IkiHeader";
import { IkiStickyCta } from "./IkiStickyCta";
import "./iki-theme.css";

const CTA_LABEL = "Je compare gratuitement";

const H2 =
  "text-balance text-center text-[clamp(1.7rem,5.6vw,2.4rem)] font-bold leading-[1.15] text-[var(--iki-ink)]";
const H3 = "text-[1.3rem] font-bold leading-[1.2] text-[var(--iki-ink)]";
const TEXT = "text-[1.15rem] leading-[1.55] text-[var(--iki-text)]";
const CARD = "rounded-[24px] border-2 border-[var(--iki-violet-20)] bg-white p-5";

function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`mx-auto grid w-full max-w-[1100px] gap-6 px-4 pt-14 min-[900px]:px-8 min-[900px]:pt-20 ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-[1rem] font-bold uppercase tracking-[0.08em] text-[var(--iki-violet)]">
      {children}
    </p>
  );
}

function Cta({ className = "" }: { className?: string }) {
  return (
    <a href="#devis" className={`iki-cta min-h-16 max-w-[440px] ${className}`}>
      {CTA_LABEL}
    </a>
  );
}

/* ---------- Hero + formulaire ---------- */

const HERO_POINTS = [
  { icon: Check, label: "Gratuit et sans engagement" },
  { icon: Timer, label: "5 questions, moins d’une minute" },
  { icon: PhoneCall, label: "Un conseiller vous rappelle" },
] as const;

function IkiHero() {
  return (
    <div className="relative overflow-hidden">
      {/* Soft IKI gradient wash, decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.16] blur-3xl"
        style={{ backgroundImage: "linear-gradient(135deg, #d900e0, #ff7a00)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-40 h-[420px] w-[420px] rounded-full opacity-[0.12] blur-3xl"
        style={{ backgroundImage: "linear-gradient(135deg, #5a00ff, #7700f8)" }}
      />
      <TikTokFunnelTracker />
      <div className="relative mx-auto grid max-w-[1200px] gap-6 px-4 pb-4 pt-6 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,540px)] min-[1000px]:items-start min-[1000px]:gap-12 min-[1000px]:px-8 min-[1000px]:pt-14">
        <div className="grid gap-4 text-center min-[1000px]:gap-6 min-[1000px]:pt-4 min-[1000px]:text-left">
          <p className="inline-flex items-center justify-center gap-2 text-[0.95rem] font-bold uppercase tracking-[0.08em] text-[var(--iki-violet)] min-[1000px]:justify-start">
            <HeartHandshake aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
            IKI Assurance × Couverture Mutuelle
          </p>
          <h1 className="text-balance text-[clamp(2rem,7.6vw,3.25rem)] font-bold leading-[1.08] text-[var(--iki-ink)]">
            <span className="font-light">Votre mutuelle santé, </span>
            <span className="text-[var(--iki-violet)]">enfin plus simple.</span>
          </h1>
          <p className="text-balance text-[clamp(1.2rem,4.6vw,1.5rem)] font-semibold leading-snug text-[var(--iki-text)]">
            Anticipez la hausse de votre mutuelle : comparez en 1 minute et{" "}
            <strong className="font-bold text-[var(--iki-ink)]">
              un conseiller vous rappelle
            </strong>{" "}
            avec les offres adaptées à votre âge.
          </p>
          <ul className="m-0 hidden list-none gap-3 p-0 min-[1000px]:grid">
            {HERO_POINTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-[1.2rem] font-semibold text-[var(--iki-ink)]"
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[var(--iki-violet)] text-white"
                >
                  <Icon className="h-5 w-5" strokeWidth={2.6} />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <Image
            src="/images/hero-couple-canape-v4.jpg"
            alt="Couple de retraités souriants assis sur un canapé"
            width={1024}
            height={576}
            sizes="560px"
            className="hidden aspect-[16/9] h-auto w-full rounded-[28px] object-cover shadow-[11px_11px_1px_rgba(119,0,248,0.2)] min-[1000px]:block"
          />
        </div>
        <div id="devis" className="mx-auto w-full max-w-[560px] scroll-mt-4">
          <SeniorQuoteForm />
        </div>
      </div>
      <ul className="relative m-0 mx-auto flex max-w-[560px] list-none flex-wrap justify-center gap-x-5 gap-y-2 px-4 pt-3 min-[1000px]:hidden">
        {HERO_POINTS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2 text-[1.05rem] font-semibold text-[var(--iki-ink)]"
          >
            <Icon aria-hidden="true" className="h-5 w-5 text-[var(--iki-violet)]" strokeWidth={2.6} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Réassurance : comment ça marche ---------- */

const STEPS = [
  {
    title: "Vous répondez à 5 questions",
    text: "Moins d’une minute, depuis votre téléphone ou votre ordinateur.",
  },
  {
    title: "Un conseiller étudie votre situation",
    text: "Il compare les garanties, pas seulement le prix.",
  },
  {
    title: "Vous recevez vos propositions",
    text: "Vous êtes libre de ne rien changer.",
  },
] as const;

function IkiSteps() {
  return (
    <Section id="etapes-titre">
      <Eyebrow>Simple comme bonjour</Eyebrow>
      <h2 id="etapes-titre" className={H2}>
        3 étapes pour trouver votre mutuelle
      </h2>
      <ol className="m-0 grid list-none gap-4 p-0 min-[800px]:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className={`${CARD} grid content-start gap-3`}>
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full text-[1.6rem] font-bold text-white"
              style={{
                backgroundColor: index === 1 ? "#d900e0" : index === 2 ? "#ff7a00" : "#7700f8",
              }}
            >
              {index + 1}
            </span>
            <h3 className={H3}>{step.title}</h3>
            <p className={TEXT}>{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------- Garanties (pictos) ---------- */

const GUARANTEES = [
  {
    label: "Hospitalisation",
    text: "Opération, dépassements d’honoraires : choisissez des garanties plus solides.",
    icon: "/images/Pictos/picto-hopital.png",
  },
  {
    label: "Dentaire",
    text: "Couronnes, bridges, implants : les remboursements varient beaucoup.",
    icon: "/images/Pictos/picto-dent.png",
  },
  {
    label: "Optique",
    text: "Avec le 100 % Santé et un contrat responsable, certaines lunettes sont sans reste à charge.",
    icon: "/images/Pictos/picto-optique.png",
  },
  {
    label: "Audioprothèse",
    text: "Avec le 100 % Santé, certaines aides auditives sont sans reste à charge ; pour les autres, tout dépend de vos garanties.",
    icon: "/images/Pictos/picto-audition.png",
  },
  {
    label: "Soins courants",
    text: "Consultations et soins du quotidien, selon les garanties choisies.",
    icon: "/images/Pictos/picto-soins-courant.png",
  },
  {
    label: "Un tarif adapté",
    text: "Payez pour les garanties qui vous servent, pas pour les autres.",
    icon: null,
  },
] as const;

function IkiGuarantees() {
  return (
    <Section id="garanties-titre">
      <Eyebrow>Vos garanties</Eyebrow>
      <h2 id="garanties-titre" className={H2}>
        Une bonne mutuelle protège l’essentiel
      </h2>
      <ul className="m-0 grid list-none gap-4 p-0 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3">
        {GUARANTEES.map((item) => (
          <li key={item.label} className={`${CARD} grid grid-cols-[64px_1fr] items-start gap-4`}>
            <span
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-[20px] bg-[var(--iki-lavender)]"
            >
              {item.icon ? (
                <i
                  className="h-9 w-9 bg-[var(--iki-violet)] [mask:var(--m)_center/contain_no-repeat]"
                  style={{ "--m": `url("${item.icon}")` } as CSSProperties}
                />
              ) : (
                <ShieldCheck className="h-9 w-9 text-[var(--iki-violet)]" strokeWidth={2} />
              )}
            </span>
            <div className="grid gap-1">
              <h3 className={H3}>{item.label}</h3>
              <p className="text-[1.05rem] leading-[1.5] text-[var(--iki-text)]">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-center text-[1.2rem] font-semibold text-[var(--iki-ink)]">
        Une mutuelle moins chère n’est pas toujours la meilleure.
      </p>
    </Section>
  );
}

/* ---------- Pourquoi comparer maintenant ---------- */

const REASONS = [
  "Les tarifs augmentent avec l’âge : après 55 ans, chaque tranche d’âge coûte plus cher.",
  "Un contrat signé il y a longtemps n’est souvent plus adapté à vos besoins d’aujourd’hui.",
  "Un conseiller compare les garanties, pas seulement le prix.",
] as const;

function IkiWhy() {
  return (
    <Section id="pourquoi-titre">
      <div className="grid gap-6 overflow-hidden rounded-[32px] bg-[var(--iki-lavender)] p-5 min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] min-[860px]:items-center min-[860px]:gap-10 min-[860px]:p-8">
        <Image
          src="/seniors-promenade.png"
          alt="Couple de seniors en promenade"
          width={1024}
          height={682}
          sizes="(min-width: 860px) 480px, 100vw"
          className="block h-auto w-full rounded-[24px] object-cover"
        />
        <div className="grid gap-5">
          <h2 id="pourquoi-titre" className={`${H2} min-[860px]:text-left`}>
            Pourquoi comparer votre mutuelle maintenant&nbsp;?
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {REASONS.map((reason) => (
              <li key={reason} className={`${TEXT} flex gap-3`}>
                <Check
                  aria-hidden="true"
                  className="mt-1 h-6 w-6 flex-none text-[var(--iki-violet)]"
                  strokeWidth={3}
                />
                {reason}
              </li>
            ))}
          </ul>
          <div className="rounded-[24px] bg-[var(--iki-ink)] p-5 text-center text-[1.15rem] font-semibold text-white">
            Les seniors qui comparent économisent en moyenne
            <strong className="mt-1 block text-[2rem] font-bold text-[var(--iki-orange)]">
              200 à 400 €/an
            </strong>
          </div>
        </div>
      </div>
      <div className="grid justify-items-center pt-2">
        <Cta />
      </div>
    </Section>
  );
}

/* ---------- Partenaires ---------- */

const PARTNERS = [
  { src: "/images/partners/santiane.webp", alt: "Santiane", width: 300, height: 60 },
  { src: "/images/partners/spvie.webp", alt: "SPVIE Assurances", width: 309, height: 160 },
  { src: "/images/partners/majelis.webp", alt: "Majelis", width: 119, height: 160 },
  {
    src: "/images/partners/aveyronnaise.webp",
    alt: "L’Aveyronnaise d’Assurances",
    width: 237,
    height: 160,
  },
  { src: "/images/partners/skarlett.webp", alt: "Skarlett", width: 720, height: 128 },
] as const;

function IkiPartners() {
  return (
    <Section id="partenaires-titre" className="!pt-10 min-[900px]:!pt-14">
      <div className="grid gap-5 rounded-[24px] bg-[var(--iki-lavender)] px-4 py-6 text-center min-[900px]:px-8">
        <p
          id="partenaires-titre"
          className="text-[1rem] font-bold uppercase tracking-[0.08em] text-[var(--iki-violet)]"
        >
          Nos partenaires sélectionnés
        </p>
        <ul className="m-0 flex list-none flex-wrap justify-center gap-3 p-0">
          {PARTNERS.map((logo) => (
            <li
              key={logo.src}
              className="grid min-h-[72px] place-items-center rounded-[16px] bg-white px-4 py-2 shadow-[6px_6px_1px_rgba(119,0,248,0.12)]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                sizes="140px"
                className="block h-10 w-auto max-w-[140px] object-contain"
              />
            </li>
          ))}
        </ul>
        <p className="text-[1rem] text-[var(--iki-text)]">
          Votre demande peut être transmise à ces partenaires pour vous établir un devis.
        </p>
      </div>
    </Section>
  );
}

/* ---------- Témoignages ---------- */

function IkiTestimonials() {
  const people = [
    {
      name: "Marie, 67 ans",
      price: "95 € → 74 €/mois",
      text: "Elle a comparé avant la hausse et garde les mêmes remboursements.",
      src: "/portrait-marie.png",
      alt: "Portrait de Marie",
    },
    {
      name: "Jean, 72 ans",
      price: "65 €/mois",
      text: "Il paie peu, mais il est mal remboursé sur ses appareils auditifs.",
      src: "/portrait-jean.png",
      alt: "Portrait de Jean",
    },
  ];

  return (
    <Section id="profils-titre">
      <Eyebrow>Témoignages</Eyebrow>
      <h2 id="profils-titre" className={H2}>
        Ils ont comparé
      </h2>
      <div className="grid gap-5 min-[700px]:grid-cols-2">
        {people.map((person) => (
          <figure
            key={person.name}
            className="relative m-0 grid grid-cols-[76px_1fr] items-start gap-4 rounded-[24px] bg-[var(--iki-lavender)] p-5 shadow-[11px_11px_1px_rgba(119,0,248,0.2)]"
          >
            <Quote
              aria-hidden="true"
              className="absolute right-4 top-4 h-8 w-8 text-[var(--iki-violet-20)]"
              strokeWidth={2.4}
            />
            <div
              className="h-[76px] w-[76px] rounded-full p-[3px]"
              style={{ backgroundImage: "var(--iki-gradient)" }}
            >
              <div className="h-full w-full overflow-hidden rounded-full bg-white">
                <Image
                  src={person.src}
                  alt={person.alt}
                  width={723}
                  height={1024}
                  sizes="76px"
                  className="block h-full w-full object-cover object-top"
                />
              </div>
            </div>
            <figcaption className="grid gap-1">
              <h3 className={H3}>{person.name}</h3>
              <p className="text-[1.25rem] font-bold tabular-nums text-[var(--iki-violet)]">
                {person.price}
              </p>
              <p className="text-[1.1rem] leading-[1.5] text-[var(--iki-text)]">{person.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-center text-[0.95rem] text-[var(--iki-text)]">
        Exemples illustratifs, non contractuels.
      </p>
    </Section>
  );
}

/* ---------- FAQ ---------- */

const FAQ = [
  {
    question: "Le comparatif est-il vraiment gratuit ?",
    answer: "Oui, entièrement gratuit et sans engagement.",
  },
  {
    question: "Êtes-vous une mutuelle ?",
    answer:
      "Non. Nous vous mettons en relation avec des partenaires qui comparent les offres pour vous.",
  },
  {
    question: "Puis-je comparer si j’ai déjà une mutuelle ?",
    answer: "Oui. Après un an de contrat, vous pouvez changer à tout moment.",
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
    <Section id="faq-titre" className="max-w-[860px]">
      <Eyebrow>Vos questions</Eyebrow>
      <h2 id="faq-titre" className={H2}>
        Questions fréquentes
      </h2>
      <div className="grid gap-3">
        {FAQ.map((item, index) => (
          <details
            key={item.question}
            open={index === 0}
            className="group rounded-[20px] border-2 border-[var(--iki-violet-20)] bg-white px-5 py-4 open:border-[var(--iki-violet)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.2rem] font-bold text-[var(--iki-ink)] after:grid after:h-9 after:w-9 after:flex-none after:place-items-center after:rounded-full after:bg-[var(--iki-lavender)] after:text-[1.5rem] after:leading-none after:text-[var(--iki-violet)] after:content-['+'] group-open:after:content-['−'] [&::-webkit-details-marker]:hidden">
              {item.question}
            </summary>
            <p className={`${TEXT} mt-3`}>{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CTA final ---------- */

function IkiFinalCta() {
  return (
    <Section id="final-titre" className="pb-16 min-[900px]:pb-20">
      <div
        className="grid justify-items-center gap-5 rounded-[32px] px-5 py-10 text-center text-white"
        style={{ backgroundImage: "linear-gradient(120deg, #5a00ff 0%, #7700f8 45%, #a000e6 100%)" }}
      >
        <h2 id="final-titre" className="text-balance text-[clamp(1.7rem,5.6vw,2.4rem)] font-bold leading-[1.15]">
          <span className="font-light">Prêt(e) à </span>comparer les offres&nbsp;?
        </h2>
        <p className="max-w-[560px] text-[1.2rem] leading-snug text-[#f1e5fe]">
          5 questions, moins d’une minute. Un conseiller vous rappelle, vous êtes
          libre de ne rien changer.
        </p>
        <a
          href="#devis"
          className="inline-flex min-h-16 w-full max-w-[440px] items-center justify-center rounded-full bg-white px-7 py-3.5 text-[1.3rem] font-bold text-[var(--iki-violet)] no-underline shadow-[11px_11px_1px_rgba(36,0,79,0.3)] transition hover:bg-[var(--iki-lavender)] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--iki-orange)]"
        >
          {CTA_LABEL}
        </a>
      </div>
    </Section>
  );
}

/**
 * Co-branded proposal page « IKI Assurance × Couverture Mutuelle » (/iki).
 * Same quote form as the homepage (SeniorQuoteForm, logic untouched); the whole
 * page, the form and the cookie banner follow the IKI brand guidelines
 * (iki-theme.css). Couverture Mutuelle only appears as the co-brand logo.
 */
export function IkiLanding() {
  return (
    <div className="theme-iki flex min-h-0 flex-1 flex-col bg-white text-[18px] leading-[1.55]">
      <IkiHeader />
      <main className="w-full flex-1 pb-4">
        <IkiHero />
        <IkiPartners />
        <IkiSteps />
        <IkiGuarantees />
        <IkiWhy />
        <IkiTestimonials />
        <IkiFaq />
        <IkiFinalCta />
      </main>
      <IkiFooter />
      <IkiStickyCta ctaLabel={CTA_LABEL} />
    </div>
  );
}
