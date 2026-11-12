"use client";

import { useEffect, useState } from "react";

/** Tailwind `lg` = 1024px. SSR assumes desktop so existing desktop LPs do not flash. */
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
