import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, BadgeEuro } from "lucide-react";
import { CTA_CLASS } from "@/components/landing/senior/SeniorSections";

const H2 =
  "text-balance text-center font-poppins text-[clamp(1.4rem,5.2vw,1.85rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]";
const H3 =
  "font-poppins text-[1.15rem] font-bold leading-[1.25] tracking-[-0.01em] text-[#3b0764]";
const CARD = "rounded-[20px] border border-[#ddd6fe] bg-white p-5";
const TEXT = "text-[1.05rem] text-zinc-700";
const NOTE = "text-[0.85rem] text-zinc-600";

function Block({
  labelledBy,
  className = "",
  children,
}: {
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`mx-auto grid max-w-[960px] gap-5 pt-12 ${className}`}
    >
      {children}
    </section>
  );
}

/** CTA that scrolls back to the quote form (#devis). */
export function RacCta({ label }: { label: string }) {
  return (
    <div className="mx-auto grid max-w-[960px] justify-items-center pt-10">
      <a href="#devis" className={`${CTA_CLASS} min-h-16 max-w-[420px]`}>
        {label}
      </a>
    </div>
  );
}

/* 3. Les avantages */

const ADVANTAGES = [
  {
    icon: "/images/Pictos/picto-hopital.png",
    title: "Hospitalisation et dépassements d’honoraires mieux couverts",
    text: "Une opération de la hanche ou du genou ? Choisissez des garanties plus solides sur l’hôpital et les dépassements d’honoraires.",
  },
  {
    icon: "/images/Pictos/picto-dent.png",
    title: "Dentaire et prothèses",
    text: "Couronnes, bridges, implants : les remboursements varient beaucoup d’un contrat à l’autre.",
  },
  {
    icon: "/images/Pictos/picto-optique.png",
    title: "Optique et audition",
    text: "Avec le 100 % Santé, certaines lunettes et aides auditives sont sans reste à charge avec un contrat responsable. Pour les autres, tout dépend de vos garanties.",
  },
  {
    icon: null,
    title: "Un tarif adapté à votre budget",
    text: "Payez pour les garanties qui vous servent, pas pour celles dont vous n’avez pas besoin.",
  },
] as const;

export function RacAdvantages() {
  return (
    <Block labelledBy="avantages-titre">
      <h2 id="avantages-titre" className={H2}>
        Les avantages
      </h2>
      <ul className="m-0 grid list-none gap-3.5 p-0 min-[700px]:grid-cols-2">
        {ADVANTAGES.map(({ icon, title, text }) => (
          <li key={title} className={`${CARD} grid content-start gap-3`}>
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)]"
            >
              {icon ? (
                <i
                  className="h-8 w-8 bg-white [mask:var(--m)_center/contain_no-repeat]"
                  style={{ "--m": `url("${icon}")` } as CSSProperties}
                />
              ) : (
                <BadgeEuro className="h-8 w-8" strokeWidth={2} />
              )}
            </span>
            <h3 className={H3}>{title}</h3>
            <p className={TEXT}>{text}</p>
          </li>
        ))}
      </ul>
    </Block>
  );
}

/* 4. Pourquoi encore un reste à charge + exemple de la vidéo */

const REASONS = [
  "Un contrat signé il y a longtemps, qui n’est plus adapté à vos besoins d’aujourd’hui.",
  "Des garanties trop faibles là où vous en avez besoin : hospitalisation, dentaire, optique, audition. Et parfois trop fortes là où vous n’en avez pas besoin.",
  "Des dépassements d’honoraires mal couverts : chez certains spécialistes et chirurgiens, la différence reste pour vous.",
] as const;

export function RacWhy() {
  return (
    <Block labelledBy="pourquoi-titre">
      <div className="grid gap-6 rounded-[28px] border border-[#ddd6fe] bg-white p-4 shadow-[0_24px_60px_-30px_rgba(59,7,100,0.45)] min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] min-[860px]:items-center min-[860px]:gap-8 min-[860px]:p-6">
        <Image
          src="/images/hero-couple-canape-v4.jpg"
          alt="Couple de retraités souriants assis sur un canapé"
          width={1024}
          height={576}
          sizes="(min-width: 960px) 430px, (min-width: 640px) 600px, 100vw"
          className="block aspect-[16/9] h-auto w-full rounded-[20px] object-cover min-[860px]:aspect-[4/5]"
        />
        <div className="grid gap-4">
          <h2 id="pourquoi-titre" className={`${H2} min-[860px]:text-left`}>
            Pourquoi vous avez encore un reste à charge&nbsp;?
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {REASONS.map((reason) => (
              <li
                key={reason}
                className={`${TEXT} relative pl-7 before:absolute before:left-0 before:top-[0.55em] before:h-3 before:w-3 before:rounded-full before:bg-brand before:content-['']`}
              >
                {reason}
              </li>
            ))}
          </ul>
          <div className="grid gap-2 rounded-[20px] bg-[#f7f4ff] p-4">
            <p className="font-poppins text-[1.05rem] font-bold text-[#3b0764]">
              Comme dans la vidéo
            </p>
            <p className="text-base text-zinc-700">
              Même mutuelle depuis 7 ans, un souci de hanche, 420&nbsp;€ de reste
              à charge. Après son comparatif&nbsp;:
            </p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[1.4rem] font-extrabold tabular-nums text-zinc-500 line-through decoration-2">
                102&nbsp;€/mois
              </span>
              <ArrowRight aria-hidden="true" className="h-6 w-6 text-brand" />
              <span className="text-[1.75rem] font-extrabold tabular-nums text-brand">
                68&nbsp;€/mois
              </span>
            </p>
            <p className={NOTE}>
              Exemple raconté dans la vidéo. Les économies dépendent de votre
              situation et des garanties choisies.
            </p>
          </div>
        </div>
      </div>
    </Block>
  );
}

/* 6. Questions fréquentes (cartes, pas d’accordéon) */

const FAQ = [
  {
    question: "Puis-je changer de mutuelle en cours d’année ?",
    answer:
      "Oui, après un an de contrat. Depuis décembre 2020 (loi du 14 juillet 2019), vous pouvez résilier à tout moment, sans frais. La résiliation prend effet un mois après. Votre nouvelle mutuelle peut s’occuper des démarches.",
  },
  {
    question: "Un problème de santé m’empêche\u2011t\u2011il de changer ?",
    answer:
      "En général, non. La plupart des mutuelles santé individuelles ne demandent pas de questionnaire médical.",
  },
  {
    question: "Vais-je être moins bien remboursé(e) ?",
    answer:
      "Pas si ce n’est pas ce que vous voulez. Nous comparons les garanties et le prix, selon vos priorités. Vous voyez les offres avant de décider.",
  },
  {
    question: "C’est vraiment gratuit ?",
    answer:
      "Oui. Le comparatif est gratuit et sans engagement. Vous êtes libre de garder votre mutuelle actuelle.",
  },
] as const;

export function RacFaq() {
  return (
    <Block labelledBy="faq-titre">
      <h2 id="faq-titre" className={H2}>
        Questions fréquentes
      </h2>
      <div className="grid gap-3.5 min-[700px]:grid-cols-2">
        {FAQ.map((item) => (
          <article key={item.question} className={`${CARD} grid content-start gap-2`}>
            <h3 className={H3}>{item.question}</h3>
            <p className={TEXT}>{item.answer}</p>
          </article>
        ))}
      </div>
    </Block>
  );
}

/* 8. Ils ont comparé — mêmes exemples que sur les autres pages (Marie, Jean) */

export function RacPeople({ mariePrice = 39 }: { mariePrice?: number }) {
  const people = [
    {
      name: "Marie, 67 ans",
      price: `95 € → ${mariePrice} €/mois`,
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
    <Block labelledBy="profils-titre">
      <h2 id="profils-titre" className={H2}>
        Ils ont comparé
      </h2>
      <div className="grid gap-3.5 min-[700px]:grid-cols-2">
        {people.map((person) => (
          <div
            key={person.name}
            className={`${CARD} grid grid-cols-[64px_1fr] items-start gap-4`}
          >
            <div className="h-16 w-16 overflow-hidden rounded-full bg-brand-soft">
              <Image
                src={person.src}
                alt={person.alt}
                width={723}
                height={1024}
                sizes="64px"
                className="block h-full w-full object-cover object-top"
              />
            </div>
            <div className="grid gap-1">
              <h3 className={H3}>{person.name}</h3>
              <p className="text-[1.15rem] font-extrabold tabular-nums text-brand">
                {person.price}
              </p>
              <p className="text-base text-zinc-700">{person.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className={`${NOTE} text-center`}>Exemples illustratifs, non contractuels.</p>
    </Block>
  );
}
