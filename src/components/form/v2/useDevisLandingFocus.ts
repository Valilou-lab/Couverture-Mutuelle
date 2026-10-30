"use client";

import { useEffect, type RefObject } from "react";

const HIDDEN_FLAG = "devisFocusHidden";

/**
 * From question 2 onward on `/devis`:
 * hide landing sections below the form (partners, SEO, footer, sticky CTA).
 * Keeps native document scroll — no body lock / overflow trap.
 */
export function useDevisLandingFocus(
  focused: boolean,
  formRootRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!focused || typeof window === "undefined") return;

    const form = formRootRef.current;
    if (!form) return;

    const hidden: HTMLElement[] = [];

    const hide = (el: HTMLElement) => {
      if (hidden.includes(el)) return;
      el.dataset[HIDDEN_FLAG] = el.style.display;
      el.style.display = "none";
      hidden.push(el);
    };

    const main = form.closest("main");
    if (main) {
      let seenFormBranch = false;
      for (const child of Array.from(main.children)) {
        if (!(child instanceof HTMLElement)) continue;
        if (!seenFormBranch) {
          if (child.contains(form)) seenFormBranch = true;
          continue;
        }
        hide(child);
      }

      const shell = main.parentElement;
      if (shell) {
        let pastMain = false;
        for (const child of Array.from(shell.children)) {
          if (!(child instanceof HTMLElement)) continue;
          if (child === main) {
            pastMain = true;
            continue;
          }
          if (pastMain) hide(child);
        }
      }
    }

    form.scrollIntoView({ behavior: "auto", block: "start" });

    return () => {
      for (const el of hidden) {
        const previous = el.dataset[HIDDEN_FLAG];
        if (previous !== undefined) {
          el.style.display = previous;
          delete el.dataset[HIDDEN_FLAG];
        }
      }
    };
  }, [focused, formRootRef]);
}
