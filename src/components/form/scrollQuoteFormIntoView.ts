/** Sticky header height + small breathing room above the title. */
function stickyOffsetPx(): number {
  if (typeof document === "undefined") return 8;
  const sticky = document.querySelector<HTMLElement>(
    "header.sticky, [data-sticky-header], .sticky.top-0",
  );
  if (!sticky) return 8;
  return Math.round(sticky.getBoundingClientRect().height) + 4;
}

/**
 * After every step change, pin the viewport to the page title / top of screen
 * — not merely the form card — so the user never has to scroll back up.
 */
export function scrollQuoteFormIntoView(element: HTMLElement | null) {
  if (typeof window === "undefined") return;

  const align = () => {
    const main = element?.closest("main") ?? document.querySelector("main");
    const title =
      main?.querySelector<HTMLElement>("h1") ??
      document.querySelector<HTMLElement>("main h1, h1");

    const target = title
      ? Math.max(
          0,
          title.getBoundingClientRect().top + window.scrollY - stickyOffsetPx(),
        )
      : 0;

    if (Math.abs(window.scrollY - target) < 2) return;
    // Instant jump: keeps the user at the top without a mid-scroll feeling.
    window.scrollTo({ top: target, behavior: "auto" });
  };

  // Double rAF: wait for React paint + layout of the new step.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      align();
      // Late layout (bubble / step content) — nudge again.
      window.setTimeout(align, 80);
    });
  });
}
