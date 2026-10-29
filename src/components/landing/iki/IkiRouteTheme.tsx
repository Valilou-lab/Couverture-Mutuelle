"use client";

import { useEffect } from "react";

/**
 * Tags <html> with `iki-route` (+ the Titillium font variable class) while
 * /iki is mounted, so UI rendered outside the page wrapper by the root layout
 * (cookie banner, cookie preferences dialog, partners modal portal, chatbot
 * slot) picks up the IKI theme from iki-theme.css without any change to
 * those shared components. Removed on unmount: other pages are untouched.
 */
export function IkiRouteTheme({ fontClassName }: { fontClassName: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const classes = ["iki-route", ...fontClassName.split(/\s+/).filter(Boolean)];
    root.classList.add(...classes);
    return () => root.classList.remove(...classes);
  }, [fontClassName]);

  return null;
}
