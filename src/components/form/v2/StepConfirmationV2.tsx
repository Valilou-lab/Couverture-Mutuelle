"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  getV2PartnerById,
  getV2PartnerConfirmationPhone,
  isV2PartnerDistributable,
} from "@/lib/v2/partners-registry";
import type { EligiblePartner } from "./v2Types";
import { PartnerGoogleRating } from "./PartnerGoogleRating";
import { getV2PartnerLogoSrc } from "./v2Partners";

const CONFETTI_COLORS = [
  "#6d28d9",
  "#a855f7",
  "#c4b5fd",
  "#f472b6",
  "#fbbf24",
  "#34d399",
  "#ffffff",
];

const PREP_ITEMS = [
  { icon: "💶", label: "Ce que vous payez aujourd’hui par mois" },
  { icon: "📅", label: "La date de début de votre contrat actuel" },
  {
    icon: "🦷",
    label: "Vos soins prévus : dentaire, lunettes, audition…",
  },
] as const;

const ADVISOR_QUESTIONS = [
  "Combien serai-je remboursé, en euros, pour mes soins prévus ?",
  "Y a-t-il un délai d’attente avant d’être remboursé ?",
  "Qui s’occupe de résilier ma mutuelle actuelle ?",
] as const;

/** Never show more than 3 broker cards on mobile confirmation. */
const MAX_CONFIRMATION_BROKERS = 3;

type ConfirmationBroker = {
  id: string;
  name: string;
  logoSrc: string | null;
  phoneDisplay: string | null;
  phoneTel: string | null;
};

type Props = {
  firstName: string;
  partners: EligiblePartner[];
};

function fireConfirmationConfetti() {
  const defaults = {
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
    zIndex: 80,
  };

  confetti({
    ...defaults,
    particleCount: 90,
    spread: 72,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.28 },
  });

  window.setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 55,
      angle: 60,
      spread: 58,
      startVelocity: 42,
      origin: { x: 0.08, y: 0.55 },
    });
    confetti({
      ...defaults,
      particleCount: 55,
      angle: 120,
      spread: 58,
      startVelocity: 42,
      origin: { x: 0.92, y: 0.55 },
    });
  }, 180);
}

function formatFirstName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function buildVcard(name: string, tel: string): string {
  const safeName = name.replace(/[\n\r;,]/g, " ");
  const safeTel = tel.replace(/[^\d+]/g, "");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:Conseiller ${safeName}`,
    `ORG:${safeName}`,
    `TEL;TYPE=VOICE,WORK:${safeTel}`,
    "END:VCARD",
  ].join("\r\n");
}

function downloadVcard(name: string, tel: string) {
  const blob = new Blob([buildVcard(name, tel)], {
    type: "text/vcard;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `conseiller-${name.toLowerCase().replace(/\s+/g, "-")}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function PulsingPhoneIcon({ className }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-white/25 motion-reduce:animate-none" />
      <svg
        viewBox="0 0 24 24"
        className="relative h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.35a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.75.32 1.54.55 2.35.68A2 2 0 0 1 22 16.92z" />
      </svg>
    </span>
  );
}

function BrokerLogo({
  name,
  logoSrc,
  compact = false,
}: {
  name: string;
  logoSrc: string | null;
  compact?: boolean;
}) {
  if (logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- partner logos
      <img
        src={logoSrc}
        alt={name}
        className={
          compact
            ? "mx-auto h-7 w-auto max-w-full object-contain"
            : "h-8 w-auto max-w-[7.5rem] object-contain"
        }
        draggable={false}
      />
    );
  }
  return (
    <span
      className={`font-poppins font-bold text-[#3b0764] ${
        compact ? "text-[0.7rem] leading-tight" : "text-sm"
      }`}
    >
      {name}
    </span>
  );
}

/**
 * V2 confirmation — personalized success screen with broker callback cards.
 */
export function StepConfirmationV2({ firstName, partners }: Props) {
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const displayName = formatFirstName(firstName);

  const brokers = useMemo(() => {
    const mapped: ConfirmationBroker[] = partners
      .slice(0, MAX_CONFIRMATION_BROKERS)
      .map((partner) => {
        const registered = getV2PartnerById(partner.id);
        const distributable =
          registered && isV2PartnerDistributable(registered)
            ? registered
            : null;
        const phone = getV2PartnerConfirmationPhone(partner.id);
        return {
          id: partner.id,
          name: distributable?.name ?? partner.name,
          logoSrc: getV2PartnerLogoSrc(partner.id, partner.name),
          phoneDisplay: phone?.display ?? null,
          phoneTel: phone?.tel ?? null,
        };
      });
    return mapped;
  }, [partners]);

  const brokerCount = brokers.length;
  const plural = brokerCount > 1;

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setTimeout(() => {
      fireConfirmationConfetti();
    }, 120);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative py-2 text-center sm:py-3">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.75)]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5 10 17.5 19 7.5" />
        </svg>
      </div>

      <h2 className="mt-3 text-balance font-poppins text-[1.45rem] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[1.7rem]">
        C’est validé{displayName ? `, ${displayName}` : ""}&nbsp;!
      </h2>
      <p className="mt-1 text-[0.98rem] font-medium text-zinc-600">
        Votre demande a bien été transmise.
      </p>

      <div className="mt-5 overflow-hidden rounded-[22px] bg-[#7c3aed] text-left text-white shadow-[0_16px_36px_-18px_rgba(109,40,217,0.65)]">
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
          <div className="flex items-start gap-3">
            <PulsingPhoneIcon />
            <p className="min-w-0 pt-1.5 font-poppins text-[1.05rem] font-extrabold leading-snug tracking-[-0.02em] sm:text-[1.15rem]">
              {plural
                ? "Vos conseillers vous appellent dans quelques minutes"
                : "Un conseiller vous appelle dans quelques minutes."}
            </p>
          </div>

          {brokerCount === 1 ? (
            <div className="mt-4">
              <div className="rounded-2xl bg-white px-3.5 py-3 text-[#3b0764]">
                <div className="flex items-center gap-3">
                  <BrokerLogo
                    name={brokers[0]!.name}
                    logoSrc={brokers[0]!.logoSrc}
                  />
                  <p className="min-w-0 font-poppins text-[0.92rem] font-bold leading-snug">
                    Conseiller {brokers[0]!.name}
                  </p>
                </div>
                <PartnerGoogleRating
                  partnerId={brokers[0]!.id}
                  className="mt-2 flex items-center gap-1.5 text-[0.78rem] font-semibold leading-snug text-amber-700"
                />
              </div>
              <p className="mt-3 text-[0.9rem] font-medium leading-snug text-white/95">
                Gardez votre téléphone à portée de main et{" "}
                <strong className="font-extrabold">
                  décrochez, même si le numéro est inconnu : c’est lui.
                </strong>
              </p>
            </div>
          ) : null}

          {brokerCount > 1 ? (
            <>
              <p className="mt-3 text-[0.9rem] font-medium leading-snug text-white/95">
                Gardez votre téléphone à portée de main et{" "}
                <strong className="font-extrabold">
                  décrochez, même si le numéro est inconnu.
                </strong>
              </p>
              <ul
                className={`mt-4 grid gap-2 ${
                  brokerCount === 2 ? "grid-cols-2" : "grid-cols-3"
                }`}
              >
                {brokers.map((broker) => (
                  <li
                    key={broker.id}
                    className="flex h-full min-h-[9.5rem] flex-col items-center rounded-2xl bg-white px-2 py-2.5 text-center text-[#3b0764] sm:min-h-[10rem] sm:px-2.5"
                  >
                    <div className="flex h-8 w-full items-center justify-center">
                      <BrokerLogo
                        name={broker.name}
                        logoSrc={broker.logoSrc}
                        compact
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-2 min-h-[2rem] font-poppins text-[0.72rem] font-bold leading-tight sm:text-[0.78rem]">
                      {broker.name}
                    </p>
                    <PartnerGoogleRating partnerId={broker.id} compact />
                    {broker.phoneDisplay && broker.phoneTel ? (
                      <>
                        <p className="mt-auto pt-1 font-poppins text-[0.68rem] font-semibold tabular-nums leading-none text-[#5b21b6] sm:text-[0.72rem]">
                          {broker.phoneDisplay}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            downloadVcard(broker.name, broker.phoneTel!)
                          }
                          className="mt-1.5 inline-flex min-h-8 w-full items-center justify-center rounded-full bg-[#7c3aed] px-2 text-[0.68rem] font-extrabold text-white sm:text-[0.72rem]"
                        >
                          Enregistrer
                        </button>
                      </>
                    ) : (
                      <div className="mt-auto" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        {brokerCount === 1 &&
        brokers[0]?.phoneDisplay &&
        brokers[0]?.phoneTel ? (
          <div className="flex items-center justify-between gap-3 bg-[#6d28d9] px-4 py-3 sm:px-5">
            <p className="min-w-0 text-[0.88rem] font-medium leading-snug">
              L’appel viendra du{" "}
              <strong className="font-extrabold tabular-nums">
                {brokers[0].phoneDisplay}
              </strong>
            </p>
            <button
              type="button"
              onClick={() =>
                downloadVcard(brokers[0]!.name, brokers[0]!.phoneTel!)
              }
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-3.5 py-2 text-[0.82rem] font-extrabold text-[#6d28d9]"
            >
              Enregistrer
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-left sm:px-5">
        <p className="font-poppins text-[0.98rem] font-extrabold leading-snug text-emerald-950">
          Pour un devis précis en 5 minutes, gardez sous la main&nbsp;:
        </p>
        <ul className="mt-3 space-y-2.5">
          {PREP_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-start gap-2.5 text-[0.92rem] font-medium leading-snug text-emerald-950/85"
            >
              <span className="mt-0.5 text-[1.05rem]" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 overflow-hidden rounded-[18px] border border-[#ddd6fe] bg-white text-left">
        <button
          type="button"
          aria-expanded={questionsOpen}
          onClick={() => setQuestionsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        >
          <span className="font-poppins text-[0.95rem] font-bold leading-snug text-[#3b0764] sm:text-[1rem]">
            Les 3 questions à poser à votre conseiller
          </span>
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-lg font-bold text-[#7c3aed]"
          >
            {questionsOpen ? "−" : "+"}
          </span>
        </button>
        {questionsOpen ? (
          <ol className="space-y-2.5 border-t border-[#ede9fe] px-4 pb-4 pt-3">
            {ADVISOR_QUESTIONS.map((question, index) => (
              <li
                key={question}
                className="flex items-start gap-2.5 text-[0.9rem] font-medium leading-snug text-zinc-700"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-[0.7rem] font-extrabold text-white">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
