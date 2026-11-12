const TRUSTPILOT_EVALUATE_URL =
  "https://fr.trustpilot.com/evaluate/couverturemutuelle.fr";

function TrustpilotStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#00b67a"
        d="M12 1.5 14.9 8.4l7.4.7-5.6 4.8 1.7 7.2L12 17.3 5.6 21.1l1.7-7.2-5.6-4.8 7.4-.7z"
      />
    </svg>
  );
}

/**
 * Compact Trustpilot leave-a-review link above the homepage legal footer.
 * Native link on purpose: the TrustBox iframe often swallows clicks on localhost.
 */
export function TrustpilotMini() {
  return (
    <section
      aria-label="Avis Trustpilot"
      className="relative z-40 bg-white px-4 pb-6 pt-1"
    >
      <div className="mx-auto w-full max-w-[640px] min-[700px]:max-w-[1000px] lg:max-w-[1220px]">
        <a
          href={TRUSTPILOT_EVALUATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto flex max-w-[34rem] items-center justify-between gap-3 rounded-2xl border border-[#ddd6fe] bg-white px-3.5 py-2.5 no-underline transition hover:border-brand/40 hover:bg-[#faf8ff]"
        >
          <span className="text-[0.88rem] font-medium leading-snug text-[#3b0764]">
            Vous pouvez nous laisser un avis&nbsp;:
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.88rem] font-semibold text-[#191919]">
            <TrustpilotStar />
            Trustpilot
          </span>
        </a>
      </div>
    </section>
  );
}
