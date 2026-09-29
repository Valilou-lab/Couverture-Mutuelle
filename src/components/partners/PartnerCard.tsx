import type { Partner } from "@/lib/partners";

function VerifiedBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[0.6875rem] font-semibold text-brand sm:text-xs">
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="8" fill="currentColor" />
        <path
          d="M4.7 8.15 7 10.4l4.4-5.1"
          fill="none"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Partenaire vérifié
    </span>
  );
}

export function PartnerCard({ name, orias }: Partner) {
  return (
    <li className="rounded-xl border border-brand/15 bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(109,40,217,0.04)]">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="font-manrope text-base font-semibold tracking-tight text-[#3b0764]">
            {name}
          </p>
          <p className="mt-1 text-[0.8125rem] leading-snug text-zinc-500">
            Courtier en assurance
            <span className="text-zinc-400">
              {" "}
              • ORIAS&nbsp;: {orias}
            </span>
          </p>
        </div>
        <VerifiedBadge />
      </div>
    </li>
  );
}
