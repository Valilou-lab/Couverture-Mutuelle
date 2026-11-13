"use client";

import { useEffect, useState } from "react";

/**
 * Tailwind `lg` = 1024px.
 * Do not use this for form / LP visual chrome: it defaults to `true` on SSR and
 * swaps after hydration (CLS). Prefer CSS `lg:` / `.lp-v2-type` / `.tranches-age-type`.
 */
export function useLgUp(): boolean {
  const [lgUp, setLgUp] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setLgUp(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return lgUp;
}
