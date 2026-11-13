"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  isPaidLandingPath,
  parseLandingVariant,
} from "@/lib/landing-variant";

/**
 * One internal dataLayer event per paid LP view: lp_id + lp_version.
 * Separate from lead_completed / SubmitForm so conversions stay single-fire.
 */
export function LandingVariantTracker() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isPaidLandingPath(pathname)) return;
    const root = window as Window & { __cmLpContext?: string };
    if (root.__cmLpContext === pathname) return;
    root.__cmLpContext = pathname;
    const variant = parseLandingVariant(pathname);
    if (!Array.isArray(window.dataLayer)) {
      window.dataLayer = [];
    }
    window.dataLayer.push({
      event: "lp_context",
      lp_id: variant.lp_id,
      lp_version: variant.lp_version,
      page: pathname,
    });
  }, [pathname]);

  return null;
}
