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
    <div className="bg-[#ede9fe]">
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

function Stars() {
  return (
    <span className="flex gap-0.5 text-[#f4b400]" aria-hidden="true">
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

/** Google rating under the main LP form — not interactive. */
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
      <Stars />
      <span>
        <strong className="font-extrabold">4,8/5</strong> avis Google
      </span>
    </p>
  );
}
