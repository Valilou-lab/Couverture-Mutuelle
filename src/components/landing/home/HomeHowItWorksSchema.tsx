import type { ReactNode } from "react";

function DashedArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 28"
      className={
        className ??
        "h-7 w-7 text-[#7c3aed] sm:h-8 sm:w-8"
      }
      aria-hidden
    >
      <path
        d="M2 20C10 6 22 6 30 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="2.4 3.2"
      />
      <path
        d="M25 10.5 31 14.5 25.5 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepNeeds() {
  return (
    <svg viewBox="0 0 72 72" className="h-[78%] w-[78%]" aria-hidden>
      <circle cx="24" cy="23" r="10" fill="#d6c7f5" />
      <path d="M10 58c1-12 7.5-20 14-20s13 8 14 20" fill="#6d28d9" />
      <rect x="38" y="20" width="22" height="36" rx="4" fill="#f4d6f8" />
      <rect x="41.5" y="24" width="15" height="25" rx="1.4" fill="white" />
      <rect x="44" y="28" width="10" height="1.7" rx="0.8" fill="#e9d5ff" />
      <rect x="44" y="32.5" width="10" height="1.7" rx="0.8" fill="#e9d5ff" />
      <rect x="44" y="37" width="7" height="1.7" rx="0.8" fill="#e9d5ff" />
      <circle cx="49" cy="52.2" r="1.5" fill="#e9d5ff" />
    </svg>
  );
}

function StepQuotes() {
  return (
    <svg viewBox="0 0 72 72" className="h-[78%] w-[78%]" aria-hidden>
      <circle cx="26" cy="22" r="10" fill="#6d28d9" />
      <path d="M11 58c1-12 8-20 15-20s14 8 15 20" fill="#5b21b6" />
      <rect x="40" y="18" width="22" height="30" rx="3" fill="white" />
      <circle cx="51" cy="35" r="8" fill="white" />
      <path
        d="M55.2 31.2c-1.8-1.6-5.2-.6-5.2 3.8 0 4.4 3.4 5.4 5.2 3.8"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M43.8 34h8.6M43.8 37.4h8.6"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepSign() {
  return (
    <svg viewBox="0 0 72 72" className="h-[80%] w-[80%]" aria-hidden>
      <rect x="14" y="12" width="34" height="44" rx="4" fill="white" />
      <path
        d="M20 30c5-5 9 5 14 0s9 5 14 0"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M20 39c5-5 9 5 14 0s9 5 14 0"
        fill="none"
        stroke="#ddd6fe"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M42 44 52 18l4 1.6-10 26-5.2.6z" fill="#6d28d9" />
      <rect x="41.5" y="42.5" width="5.2" height="3.2" rx="0.6" fill="#5b21b6" />
      <circle cx="50" cy="52" r="11" fill="#22c55e" />
      <path
        d="M44.8 52.4 48.4 56l7.4-8"
        fill="none"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Vos besoins",
    text: "en 2 minutes",
    circle: "bg-[#ead9ff]",
    badge: "bg-[#6d28d9]",
    Icon: StepNeeds,
  },
  {
    n: "2",
    title: "Vos devis",
    text: "par un courtier partenaire",
    circle: "bg-[#ead9ff]",
    badge: "bg-[#6d28d9]",
    Icon: StepQuotes,
  },
  {
    n: "3",
    title: "Vous signez",
    text: (
      <>
        la résiliation est
        <br />
        faite pour vous*
      </>
    ),
    circle: "bg-[#dcfce7]",
    badge: "bg-[#22c55e]",
    Icon: StepSign,
  },
] as const;

type HomeHowItWorksSchemaProps = {
  /** Defaults keep homepage / tiktok / RAC copy. */
  needsText?: string;
  quotesTitle?: string;
  quotesText?: string;
  signText?: ReactNode;
};

/** Compact 3-step schema — just under the homepage form, on the pastel band. */
export function HomeHowItWorksSchema({
  needsText = "en 2 minutes",
  quotesTitle = "Vos devis",
  quotesText = "par un courtier partenaire",
  signText,
}: HomeHowItWorksSchemaProps = {}) {
  return (
    <section
      aria-labelledby="comment-ca-se-passe-schema"
      className="mx-auto max-w-[34rem] px-1 pb-1 pt-5"
    >
      <h2
        id="comment-ca-se-passe-schema"
        className="text-center font-poppins text-[1.2rem] font-extrabold leading-snug tracking-[-0.02em] text-[#3b0764] sm:text-[1.35rem]"
      >
        Comment ça se passe&nbsp;?
      </h2>
      <ol className="mt-5 grid list-none grid-cols-3 items-start p-0">
        {STEPS.map((step, index) => {
          const Icon = step.Icon;
          return (
            <li key={step.n} className="relative min-w-0 px-1 text-center">
              {index > 0 ? (
                <DashedArrow className="pointer-events-none absolute left-0 top-[1.7rem] z-10 h-7 w-7 -translate-x-1/2 text-[#7c3aed] sm:top-[2.1rem] sm:h-8 sm:w-8" />
              ) : null}
              <div
                className={`relative mx-auto flex h-[4.65rem] w-[4.65rem] items-center justify-center rounded-full sm:h-[5.35rem] sm:w-[5.35rem] ${step.circle}`}
              >
                <span
                  className={`absolute -left-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[0.78rem] font-extrabold text-white sm:h-7 sm:w-7 sm:text-[0.85rem] ${step.badge}`}
                >
                  {step.n}
                </span>
                <Icon />
              </div>
              <p className="mt-2.5 font-poppins text-[0.92rem] font-extrabold leading-tight text-[#3b0764] sm:text-[1.02rem]">
                {step.n === "2" ? quotesTitle : step.title}
              </p>
              <p className="mt-0.5 text-[0.72rem] font-normal leading-snug text-zinc-500 sm:text-[0.8rem]">
                {step.n === "1"
                  ? needsText
                  : step.n === "2"
                    ? quotesText
                    : step.n === "3" && signText !== undefined
                      ? signText
                      : step.text}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
