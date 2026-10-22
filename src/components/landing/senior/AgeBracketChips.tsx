const AGE_BRACKETS = [
  "55-60 ans",
  "60-65 ans",
  "65-70 ans",
  "70-75 ans",
  "75-80 ans",
  "+ de 80 ans",
] as const;

/**
 * The 6 age brackets of the Meta ad « A01 | Tranches d’âge », styled like the
 * ad's answer rows. Each chip is a plain link to the form anchor (#devis), the
 * same smooth scroll as the other CTAs: no pre-fill, no tracking.
 */
export function AgeBracketChips() {
  return (
    <ul
      aria-label="Tranches d’âge"
      className="mx-auto mt-1 grid w-full max-w-[560px] list-none grid-cols-2 gap-2.5 p-0 min-[900px]:mx-0 min-[900px]:grid-cols-3 min-[900px]:gap-3"
    >
      {AGE_BRACKETS.map((label) => (
        <li key={label}>
          <a
            href="#devis"
            className="group flex min-h-[60px] items-center gap-2 rounded-2xl border-2 border-brand-muted bg-white px-3 py-3 text-left font-poppins text-[1.08rem] font-extrabold leading-tight text-[#3b0764] no-underline shadow-[0_6px_16px_-12px_rgba(59,7,100,0.5)] transition hover:border-brand hover:bg-brand-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand min-[900px]:min-h-[64px] min-[900px]:text-[1.2rem]"
          >
            <span
              aria-hidden="true"
              className="size-5 shrink-0 rounded-full border-2 border-[#3b0764] bg-white transition group-hover:border-brand"
            />
            <span className="flex-1 whitespace-nowrap">{label}</span>
            <span aria-hidden="true" className="shrink-0 text-xl text-brand">
              ›
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
