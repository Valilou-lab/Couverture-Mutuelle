"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CARE_NEED_ICONS } from "@/components/form/CareNeedIcons";

const COVER_IMAGE =
  "/images/style-age-fashion-business-concept-indoor-shot-handsome-friendly-mature-man-with-gray-beard-bald-head-working-desk-from-home-smiling-broadly-dressed-formal-clothes.jpg";

const SPEECH_BEFORE = "Objectif : ";
const SPEECH_HIGHLIGHT = "0 € de reste à charge";
const SPEECH_AFTER =
  " sur les équipements éligibles au 100 % Santé !";
const SPEECH_TEXT = `${SPEECH_BEFORE}${SPEECH_HIGHLIGHT}${SPEECH_AFTER}`;

function renderTypedSpeech(typed: string) {
  const beforeLen = SPEECH_BEFORE.length;
  const highlightEnd = beforeLen + SPEECH_HIGHLIGHT.length;

  const before = typed.slice(0, Math.min(typed.length, beforeLen));
  const highlight =
    typed.length > beforeLen
      ? typed.slice(beforeLen, Math.min(typed.length, highlightEnd))
      : "";
  const after =
    typed.length > highlightEnd ? typed.slice(highlightEnd) : "";

  return (
    <>
      {before}
      {highlight ? (
        <span className="font-extrabold text-brand">{highlight}</span>
      ) : null}
      {after}
    </>
  );
}

const GUARANTEES: {
  id: keyof typeof CARE_NEED_ICONS;
  title: string;
  description: string;
}[] = [
  {
    id: "hospitalisation",
    title: "Hospitalisation",
    description:
      "Chambre particulière, forfait journalier et frais de séjour.",
  },
  {
    id: "optique",
    title: "Optique",
    description:
      "Lunettes, verres progressifs et équipements éligibles au 100 % Santé.",
  },
  {
    id: "dentaire",
    title: "Dentaire",
    description:
      "Couronnes, prothèses et soins pouvant générer des restes à charge importants.",
  },
  {
    id: "audition",
    title: "Audioprothèse",
    description:
      "Appareils auditifs et équipements éligibles au dispositif 100 % Santé.",
  },
  {
    id: "soins-courants",
    title: "Soins courants",
    description: "Consultations, pharmacie, analyses et radiologie.",
  },
];

function GuaranteeCard({
  title,
  description,
  icon,
  index,
  visible,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
  visible: boolean;
}) {
  return (
    <article
      className={`coverage-guarantee-card group flex min-w-[min(100%,17.5rem)] shrink-0 items-start gap-3 rounded-2xl border border-brand/15 bg-white/90 px-3.5 py-3 shadow-[0_10px_24px_-16px_rgba(76,29,149,0.35)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_14px_28px_-14px_rgba(76,29,149,0.4)] sm:min-w-0 sm:w-full ${
        visible ? "coverage-guarantee-in" : "opacity-0 translate-x-[-1rem]"
      }`}
      style={{ animationDelay: visible ? `${index * 90}ms` : undefined }}
    >
      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-zinc-600 sm:text-[0.8125rem]">
          {description}
        </p>
      </div>
    </article>
  );
}

function SpeechBubble({
  active,
  placement,
}: {
  active: boolean;
  placement: "mobile" | "desktop";
}) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setTyped("");
      setDone(false);
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setTyped(SPEECH_TEXT);
      setDone(true);
      return;
    }

    setTyped("");
    setDone(false);
    let index = 0;
    let tickId = 0;
    const startId = window.setTimeout(() => {
      tickId = window.setInterval(() => {
        index += 1;
        setTyped(SPEECH_TEXT.slice(0, index));
        if (index >= SPEECH_TEXT.length) {
          window.clearInterval(tickId);
          setDone(true);
        }
      }, 28);
    }, 420);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(tickId);
    };
  }, [active]);

  const isDesktop = placement === "desktop";

  return (
    <div
      className={
        isDesktop
          ? "absolute right-[6%] top-[14%] z-20 w-[min(100%,22rem)] xl:right-[8%] xl:top-[12%] xl:w-[24rem]"
          : "absolute bottom-3 left-3 right-3 z-20 sm:left-auto sm:right-4 sm:w-[min(100%,22rem)]"
      }
    >
      <blockquote
        className="relative rounded-[1.5rem] border-2 border-brand/25 bg-white px-4 py-3.5 shadow-[0_16px_36px_-12px_rgba(76,29,149,0.45)] sm:px-5 sm:py-4"
        aria-live="polite"
      >
        <p className="font-manrope text-[0.95rem] font-bold leading-snug tracking-tight text-[#3b0764] sm:text-lg">
          {renderTypedSpeech(typed)}
          {!done ? (
            <span
              className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-brand align-baseline coverage-speech-caret"
              aria-hidden="true"
            />
          ) : null}
        </p>
        {/* Tail pointing toward the man */}
        <span
          className={
            isDesktop
              ? "absolute -bottom-2.5 right-10 h-5 w-5 rotate-45 border-b-2 border-r-2 border-brand/25 bg-white"
              : "absolute -bottom-2.5 right-8 h-4 w-4 rotate-45 border-b-2 border-r-2 border-brand/25 bg-white sm:right-12"
          }
          aria-hidden="true"
        />
      </blockquote>
    </div>
  );
}

function ShowcaseCopy({ visible }: { visible: boolean }) {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
        Les garanties importantes
      </p>
      <h2 className="mt-2 font-manrope text-2xl font-bold tracking-tight text-[#3b0764] sm:text-3xl lg:text-[2rem] lg:leading-tight">
        Une bonne mutuelle doit protéger l’essentiel
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
        Hospitalisation, optique, dentaire, audition… choisissez une couverture
        adaptée pour limiter au maximum vos restes à charge.
      </p>

      {/* Desktop / tablet vertical stack */}
      <div className="mt-5 hidden space-y-2.5 sm:block">
        {GUARANTEES.map((item, index) => (
          <GuaranteeCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={CARE_NEED_ICONS[item.id]}
            index={index}
            visible={visible}
          />
        ))}
      </div>

      {/* Mobile horizontal carousel */}
      <div className="-mx-1 mt-5 overflow-x-auto overscroll-x-contain pb-1 sm:hidden">
        <div className="flex w-max snap-x snap-mandatory gap-2.5 px-1">
          {GUARANTEES.map((item, index) => (
            <div key={item.id} className="w-[17.5rem] snap-start">
              <GuaranteeCard
                title={item.title}
                description={item.description}
                icon={CARE_NEED_ICONS[item.id]}
                index={index}
                visible={visible}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center sm:mt-7">
        <a
          href="#devis"
          className="inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-brand px-8 font-sora text-base font-semibold text-white shadow-[0_14px_32px_-10px_rgba(109,40,217,0.6)] transition hover:brightness-105 sm:min-h-[3.75rem] sm:px-10 sm:text-lg"
        >
          Comparer mes garanties
        </a>
      </div>
    </>
  );
}

export function CoverageShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="garanties"
      className="scroll-mt-24 overflow-x-hidden px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* Mobile: photo on top + white card below */}
        <div className="lg:hidden">
          <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-[0_18px_40px_-24px_rgba(76,29,149,0.35)]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src={COVER_IMAGE}
                alt="Senior souriant au bureau, en tenue professionnelle"
                fill
                sizes="(max-width: 1024px) 100vw, 0px"
                className="object-cover object-[72%_center]"
                priority={false}
              />
              <SpeechBubble active={visible} placement="mobile" />
            </div>
            <div className="bg-white p-5 sm:p-7">
              <ShowcaseCopy visible={visible} />
            </div>
          </div>
        </div>

        {/* Desktop: immersive background with left content */}
        <div className="relative hidden min-h-[700px] overflow-hidden rounded-[2rem] border border-border shadow-[0_22px_50px_-28px_rgba(76,29,149,0.4)] lg:block lg:min-h-[720px]">
          <Image
            src={COVER_IMAGE}
            alt="Senior souriant au bureau, en tenue professionnelle"
            fill
            sizes="(min-width: 1024px) 1152px, 0px"
            className="object-cover object-[78%_center]"
            priority={false}
          />

          {/* Soft light veil on the left only — face stays clear */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 38%, rgba(255,255,255,0.45) 52%, rgba(255,255,255,0) 68%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(245,242,255,0.55) 0%, rgba(245,242,255,0.2) 30%, rgba(245,242,255,0) 50%)",
            }}
            aria-hidden="true"
          />

          <SpeechBubble active={visible} placement="desktop" />

          <div className="relative flex h-full min-h-[720px] items-center">
            <div className="w-full max-w-[28rem] px-8 py-10 xl:max-w-[30rem] xl:px-12">
              <ShowcaseCopy visible={visible} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
