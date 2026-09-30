"use client";

import { useState } from "react";
import { PartnersModal } from "@/components/form/PartnersModal";

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="m12 4 2.1 5.1 5.5.5-4.2 3.7 1.3 5.3L12 16.2 7.3 18.6l1.3-5.3-4.2-3.7 5.5-.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <rect
        x="6"
        y="11"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 11V8.2a3 3 0 0 1 6 0V11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 19c.4-3 2.4-5 4.5-5s4.1 2 4.5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M16.2 14.1c1.9.3 3.5 1.8 3.8 4.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M7 4.5h7l4 4V19.5a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19.5v-13A2 2 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 4.5V9h4.5M9 13h6M9 16.5h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 4.5v1.6M12 17.9v1.6M4.5 12h1.6M17.9 12h1.6M6.7 6.7l1.1 1.1M16.2 16.2l1.1 1.1M17.3 6.7l-1.1 1.1M7.8 16.2l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TRUST_CARDS = [
  {
    title: "Service gratuit et sans engagement",
    text: "Comparez les offres en toute tranquillité, sans frais et sans obligation de souscrire.",
    icon: StarIcon,
  },
  {
    title: "Vos données sont protégées",
    text: "Vos informations sont traitées de manière sécurisée et confidentielle.",
    icon: LockIcon,
  },
  {
    title: "Demande transmise uniquement à des partenaires identifiés",
    text: "Votre demande est envoyée uniquement à des courtiers sélectionnés et adaptés à votre profil.",
    icon: PeopleIcon,
  },
  {
    title: "Courtiers partenaires immatriculés à l’ORIAS",
    text: "Nos partenaires sont des professionnels de l’assurance dûment immatriculés.",
    icon: DocumentIcon,
  },
] as const;

function PartnersListButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ??
        "inline-flex items-center text-sm font-semibold text-brand transition hover:underline"
      }
    >
      Voir la liste de nos partenaires
      <span aria-hidden="true" className="ml-1">
        →
      </span>
    </button>
  );
}

export function PrimaryTrustSection() {
  const [partnersOpen, setPartnersOpen] = useState(false);

  return (
    <section className="relative z-0 hidden bg-[#fbfaff] lg:block">
      <div className="mx-auto max-w-[84rem] px-10 pb-6 pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-manrope text-[2rem] font-extrabold tracking-tight text-[#3b0764]">
            Pourquoi nous faire{" "}
            <span className="text-[#c026d3]">confiance</span>&nbsp;?
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-600">
            Un service simple, transparent et sécurisé pour vous aider à trouver
            une mutuelle adaptée.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {TRUST_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-[1.35rem] border border-[#ece7f8] bg-white px-6 py-6 shadow-[0_10px_28px_-22px_rgba(91,33,182,0.35)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon />
                </span>
                <h3 className="mt-3 font-manrope text-[1.05rem] font-bold leading-snug tracking-tight text-[#3b0764]">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {card.text}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[1.25rem] border border-[#ece7f8] bg-white px-6 py-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <GearIcon />
            </span>
            <div>
              <p className="font-manrope text-base font-bold text-[#3b0764]">
                Vous gardez le contrôle.
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">
                Vous pouvez consulter à tout moment la liste des professionnels
                susceptibles de vous contacter.
              </p>
            </div>
          </div>
          <PartnersListButton
            onClick={() => setPartnersOpen(true)}
            className="shrink-0 inline-flex items-center text-sm font-semibold text-brand transition hover:underline"
          />
        </div>
      </div>

      <PartnersModal
        open={partnersOpen}
        onClose={() => setPartnersOpen(false)}
      />
    </section>
  );
}
