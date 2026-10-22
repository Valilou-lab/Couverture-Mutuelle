import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

const H2 =
  "text-balance text-center font-poppins text-[clamp(1.35rem,5vw,1.75rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#3b0764]";
const H3 =
  "font-poppins text-[1.1rem] font-bold leading-[1.2] tracking-[-0.02em] text-[#3b0764]";
const CARD = "rounded-[20px] border border-[#ddd6fe] bg-white p-4";
const NOTE = "text-[0.82rem] text-zinc-600";
const PHOTO =
  "block h-auto w-full rounded-[28px] shadow-[0_24px_60px_-30px_rgba(59,7,100,0.45)]";
const GRADIENT =
  "linear-gradient(90deg, #6d35e0 0%, #9b4ff0 35%, #c64fe0 60%, #ea7a86 100%)";

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
      className={`mx-auto grid max-w-[760px] gap-4 pt-10 ${className}`}
    >
      {children}
    </section>
  );
}

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

export function SeniorPartners() {
  return (
    <Block labelledBy="partenaires-titre" className="text-center">
      <p
        id="partenaires-titre"
        className="font-poppins text-[0.9rem] font-bold uppercase tracking-[0.06em] text-brand"
      >
        Nos partenaires sélectionnés
      </p>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-2.5 p-0">
        {PARTNERS.map((logo) => (
          <li
            key={logo.src}
            className="grid min-h-16 place-items-center rounded-[14px] border border-[#ddd6fe] bg-white px-3.5 py-2"
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
      <p className={NOTE}>
        Votre demande peut être transmise à ces partenaires pour vous établir un
        devis.
      </p>
    </Block>
  );
}

const STEPS = [
  {
    title: "Vous remplissez le formulaire",
    text: "{count} questions, moins d’une minute.",
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

export function SeniorSteps({ questionsCount = 5 }: { questionsCount?: number }) {
  return (
    <Block labelledBy="etapes-titre">
      <h2 id="etapes-titre" className={H2}>
        3 étapes simples pour trouver votre mutuelle
      </h2>
      <Image
        src="/seniors-promenade.png"
        alt="Couple de seniors en promenade"
        width={1024}
        height={682}
        sizes="(min-width: 792px) 760px, 100vw"
        className={PHOTO}
      />
      <ol className="m-0 grid list-none gap-3 p-0">
        {STEPS.map((item, index) => (
          <li
            key={item.title}
            className={`${CARD} grid grid-cols-[48px_1fr] items-center gap-3.5`}
          >
            <span
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-full text-[1.3rem] font-extrabold text-white"
              style={{ backgroundImage: GRADIENT }}
            >
              {index + 1}
            </span>
            <div>
              <h3 className={H3}>{item.title}</h3>
              <p className="text-base text-zinc-600">
                {item.text.replace("{count}", String(questionsCount))}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Block>
  );
}

const PEOPLE = [
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
] as const;

export function SeniorPeople() {
  return (
    <Block labelledBy="profils-titre">
      <h2 id="profils-titre" className={H2}>
        Deux personnes à la retraite peuvent payer un prix très différent
      </h2>
      <div className="grid gap-3">
        {PEOPLE.map((person) => (
          <div
            key={person.name}
            className={`${CARD} grid grid-cols-[56px_1fr] items-start gap-3.5`}
          >
            <div className="h-14 w-14 overflow-hidden rounded-full bg-brand-soft">
              <Image
                src={person.src}
                alt={person.alt}
                width={723}
                height={1024}
                sizes="56px"
                className="block h-full w-full object-cover object-top"
              />
            </div>
            <div className="grid gap-1">
              <h3 className={H3}>{person.name}</h3>
              <p className="text-[1.15rem] font-extrabold tabular-nums text-brand">
                {person.price}
              </p>
              <p className="text-base text-zinc-600">{person.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className={`${NOTE} text-center`}>Exemples illustratifs, non contractuels.</p>
    </Block>
  );
}

export function SeniorPricing() {
  return (
    <Block labelledBy="tarifs-titre">
      <h2 id="tarifs-titre" className={H2}>
        Combien coûte une mutuelle senior ?
      </h2>
      <div className="overflow-x-auto rounded-[20px] border border-[#ddd6fe] bg-white">
        <table className="w-full border-collapse tabular-nums">
          <thead>
            <tr>
              <th className="border-b border-brand-soft bg-[#f7f4ff] px-4 py-[13px] text-left text-[0.9rem] font-bold text-[#3b0764]">
                Âge
              </th>
              <th className="border-b border-brand-soft bg-[#f7f4ff] px-4 py-[13px] text-right text-[0.9rem] font-bold text-[#3b0764]">
                Prix mensuel indicatif
              </th>
            </tr>
          </thead>
          <tbody className="text-[1.02rem]">
            <tr>
              <td className="border-b border-brand-soft px-4 py-[13px]">55 à 59 ans</td>
              <td className="border-b border-brand-soft px-4 py-[13px] text-right">
                ≈ 45 à 70 €
              </td>
            </tr>
            <tr>
              <td className="px-4 py-[13px]">75 ans et +</td>
              <td className="px-4 py-[13px] text-right">≈ 95 à 180 €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={`${NOTE} text-center`}>
        Les prix varient selon l’âge, le département, les garanties et le profil.
      </p>
      <div
        className="rounded-[20px] p-[18px] text-center font-semibold text-white"
        style={{ backgroundImage: GRADIENT }}
      >
        Les seniors qui comparent économisent en moyenne
        <strong className="block text-[1.6rem] font-extrabold">
          200 à 400 €/an
        </strong>
      </div>
    </Block>
  );
}

const GUARANTEES = [
  { label: "Hospitalisation", icon: "/images/Pictos/picto-hopital.png" },
  { label: "Dentaire", icon: "/images/Pictos/picto-dent.png" },
  { label: "Optique", icon: "/images/Pictos/picto-optique.png" },
  { label: "Audioprothèse", icon: "/images/Pictos/picto-audition.png" },
  { label: "Soins courants", icon: "/images/Pictos/picto-soins-courant.png" },
  { label: "Médecines douces", icon: null },
] as const;

export function SeniorGuarantees() {
  return (
    <Block labelledBy="garanties-titre">
      <h2 id="garanties-titre" className={H2}>
        Une bonne mutuelle doit protéger l’essentiel
      </h2>
      <Image
        src="/images/style-age-fashion-business-concept-indoor-shot-handsome-friendly-mature-man-with-gray-beard-bald-head-working-desk-from-home-smiling-broadly-dressed-formal-clothes.jpg"
        alt="Conseiller souriant à son bureau"
        width={4939}
        height={3292}
        sizes="(min-width: 792px) 760px, 100vw"
        className={PHOTO}
      />
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5 p-0">
        {GUARANTEES.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2.5 rounded-2xl border border-[#ddd6fe] bg-white p-3.5 text-base font-semibold text-[#3b0764]"
          >
            {item.icon ? (
              <i
                aria-hidden="true"
                className="h-[30px] w-[30px] flex-none bg-brand [mask:var(--m)_center/contain_no-repeat]"
                style={{ "--m": `url("${item.icon}")` } as CSSProperties}
              />
            ) : null}
            {item.label}
          </li>
        ))}
      </ul>
      <p className="text-center font-semibold text-[#3b0764]">
        Une mutuelle moins chère n’est pas toujours la meilleure.
      </p>
    </Block>
  );
}

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

export function SeniorFaq() {
  return (
    <Block labelledBy="faq-titre">
      <h2 id="faq-titre" className={H2}>
        Questions fréquentes
      </h2>
      <div className="grid gap-2.5">
        {FAQ.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-[#ddd6fe] bg-white px-4 py-3.5"
          >
            <summary className="flex cursor-pointer list-none justify-between gap-3 font-semibold text-[#3b0764] after:text-[1.4rem] after:leading-none after:text-brand after:content-['+'] group-open:after:content-['−'] [&::-webkit-details-marker]:hidden">
              {item.question}
            </summary>
            <p className="mt-2 text-base text-zinc-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </Block>
  );
}

export const CTA_CLASS =
  "inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-[1.2rem] font-extrabold text-white no-underline shadow-[0_8px_20px_-10px_rgba(98,41,208,0.7)] transition hover:brightness-110";

export function SeniorFinalCta({
  ctaLabel = "Je compare gratuitement",
}: {
  ctaLabel?: string;
}) {
  return (
    <section
      aria-labelledby="final-titre"
      className="grid justify-items-center gap-4 py-11 text-center"
    >
      <Image
        src="/images/mascotte-ombrelle.png"
        alt=""
        width={972}
        height={989}
        sizes="150px"
        className="block h-auto w-[150px]"
      />
      <h2 id="final-titre" className={H2}>
        Prêt(e) à comparer les offres ?
      </h2>
      <a href="#devis" className={`${CTA_CLASS} min-h-16 max-w-[420px]`}>
        {ctaLabel}
      </a>
    </section>
  );
}
