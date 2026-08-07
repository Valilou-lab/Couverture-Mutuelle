/** Keeps the quote form in view after step changes (esp. after bottom selections). */
export function scrollQuoteFormIntoView(element: HTMLElement | null) {
  if (!element || typeof window === "undefined") return;

  // Double rAF: wait for React paint + layout of the new step.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
