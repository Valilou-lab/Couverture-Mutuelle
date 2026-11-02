"use client";

import { useRef } from "react";
import { IkiIcon } from "./IkiIcon";
import { Stars } from "./IkiStars";

/* Avis Google, placed inside the hero: right after the form on mobile
 * (swipe carousel), under the hero text on desktop (2 cards visible,
 * previous / next buttons). */

const REVIEWS = [
  {
    author: "Mimouna I.",
    date: "il y a 3 mois",
    text: "La conversation que j’ai eue avec la conseillère s’est très bien déroulée, elle a été d’une gentillesse exceptionnelle et très claire.",
  },
  {
    author: "Jean-Michel P.",
    date: "il y a un an",
    text: "Merci pour la qualité et l’écoute, la prise en compte des besoins et la détermination d’une mutuelle répondant à mes attentes avec beaucoup de professionnalisme. C’est très appréciable.",
  },
  {
    author: "Frédérique J.",
    date: "il y a 8 mois",
    text: "Interlocutrice très professionnelle, aimable, patiente et n’hésitant pas à redire les choses plusieurs fois s’il y a une incompréhension de la part de la cliente, c’est très appréciable. Merci à elle.",
  },
  {
    author: "Alain T.",
    date: "il y a 3 mois",
    text: "Très bons tarifs et excellent suivi.",
  },
] as const;

const AVATAR_TONES = [
  "bg-[var(--violet-50)] text-[var(--violet-600)]",
  "bg-[var(--mandarine-50)] text-[var(--mandarine-700)]",
  "bg-[var(--menthe-100)] text-[var(--menthe-700)]",
  "bg-[var(--encre-100)] text-[var(--encre-800)]",
] as const;

/** First-name initial + last-name initial (« Jean-Michel P. » → « JP »). */
function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

function GoogleLabel() {
  return (
    <span className="iki-google-label">
      <span aria-hidden="true" className="iki-google-g">
        G
      </span>
      Avis Google
    </span>
  );
}

export function IkiReviews() {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 14),
      behavior: "smooth",
    });
  }

  return (
    <section aria-labelledby="avis-titre" className="iki-reviews grid gap-3">
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <GoogleLabel />
            <span className="flex items-center gap-2 text-[1rem] font-medium text-[var(--encre-700)]">
              <Stars size={18} className="text-[var(--or-500)]" />
              Avis 5 étoiles
            </span>
          </p>
          <span className="hidden flex-none gap-2 min-[640px]:flex">
            <button
              type="button"
              className="iki-reviews-nav"
              aria-label="Avis précédents"
              onClick={() => scrollByCard(-1)}
            >
              <IkiIcon name="arrow-right" size={20} className="rotate-180" />
            </button>
            <button
              type="button"
              className="iki-reviews-nav"
              aria-label="Avis suivants"
              onClick={() => scrollByCard(1)}
            >
              <IkiIcon name="arrow-right" size={20} />
            </button>
          </span>
        </div>
        <h2 id="avis-titre" className="iki-h3 text-balance">
          Nos clients parlent de leur conseiller
        </h2>
      </div>
      <ul
        ref={trackRef}
        className="iki-reviews-track"
        aria-label="Avis Google de clients IKI"
      >
        {REVIEWS.map((review, index) => (
          <li key={review.author} className="iki-review">
            <div className="flex items-center justify-between gap-3">
              <Stars size={18} className="text-[var(--or-500)]" />
              <span className="sr-only">5 étoiles sur 5</span>
              <span aria-hidden="true" className="iki-google-g iki-google-g-sm">
                G
              </span>
            </div>
            <blockquote className="m-0 flex-1 text-[1.02rem] leading-[1.5] text-[var(--encre-800)]">
              « {review.text} »
            </blockquote>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`grid h-10 w-10 flex-none place-items-center rounded-full font-semibold ${AVATAR_TONES[index % AVATAR_TONES.length]}`}
              >
                {initials(review.author)}
              </span>
              <span className="grid leading-tight">
                <strong className="text-[1.02rem] text-[var(--encre-900)]">
                  {review.author}
                </strong>
                <span className="text-[0.92rem] text-[var(--encre-600)]">
                  {review.date} · Avis Google
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
