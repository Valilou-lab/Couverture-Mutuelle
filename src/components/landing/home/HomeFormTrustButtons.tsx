import { Check } from "lucide-react";

const HEADER_POINTS = [
  {
    key: "devis",
    label: (
      <>
        Devis <strong className="font-extrabold">1 minute</strong>
      </>
    ),
  },
  {
    key: "refs",
    label: (
      <>
        <strong className="font-extrabold">3000</strong> références mutuelles
      </>
    ),
  },
] as const;

/** Light violet strip under the header — chips hug their text. */
export function HomeHeaderTrustBar() {
  return (
    <div className="hidden bg-[#ede9fe] lg:block">
      <ul
        className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-2 px-4 py-2.5 lg:gap-3 lg:py-3"
        aria-label="Pourquoi comparer"
      >
        {HEADER_POINTS.map((point) => (
          <li
            key={point.key}
            className="pointer-events-none w-fit rounded-[18px] bg-white px-3.5 py-1.5 text-center text-[0.88rem] font-semibold leading-snug text-[#9b4ff0] sm:px-4 sm:text-[0.95rem]"
          >
            <span>{point.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stars({ className }: { className: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M12 2.5l2.7 6.6 7.2.6-5.4 4.6 1.6 7-6.1-3.7-6.1 3.7 1.6-7-5.4-4.6 7.2-.6z" />
        </svg>
      ))}
    </span>
  );
}

/** Google rating under the homepage form. */
export function HomeFormTrustButtons({
  onPhoto = false,
}: {
  onPhoto?: boolean;
} = {}) {
  return (
    <p
      className={
        onPhoto
          ? "mx-auto flex items-center justify-center gap-2 text-[0.98rem] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)] sm:text-[1.05rem]"
          : "mx-auto flex items-center justify-center gap-2 text-[0.98rem] font-semibold text-[#3b0764] sm:text-[1.05rem]"
      }
    >
      <Stars className={onPhoto ? "text-white" : "text-[#f4b400]"} />
      <span>
        <strong className="font-extrabold">4,8/5</strong> avis Google
      </span>
    </p>
  );
}

const GET_BENEFITS = [
  {
    lead: "Le bon tarif",
    rest: ", sans perdre les garanties qui comptent pour vous",
  },
  {
    lead: "Aucune démarche pour changer",
    rest: " : la résiliation est faite pour vous*",
  },
  {
    lead: "Plusieurs propositions",
    rest: " : vous choisissez, ou vous arrêtez quand vous voulez",
  },
] as const;

/** Below the homepage form, on the white band — not inside the form card. */
export function HomeFormGetBenefits() {
  return (
    <div className="mx-auto max-w-[34rem] px-1 pb-1">
      <p className="text-[1.05rem] font-extrabold leading-snug text-[#3b0764] sm:text-[1.12rem]">
        Gratuitement, vous obtenez :
      </p>
      <ul className="mt-3 grid gap-2.5">
        {GET_BENEFITS.map((item) => (
          <li
            key={item.lead}
            className="flex items-start gap-2.5 text-[0.98rem] leading-snug text-[#3b0764] sm:text-[1.02rem]"
          >
            <Check
              className="mt-0.5 h-5 w-5 shrink-0 text-[#22c55e]"
              strokeWidth={3}
              aria-hidden
            />
            <span>
              <strong className="font-extrabold">{item.lead}</strong>
              {item.rest}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.82rem] leading-snug text-[#5b4a72]">
        * Dès que votre contrat actuel a plus d’un an.
      </p>
    </div>
  );
}
