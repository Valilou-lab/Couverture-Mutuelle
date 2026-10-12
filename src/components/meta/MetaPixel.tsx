"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/context/CookieConsentContext";
import {
  ensureMetaPixel,
  isMetaPixelConfigured,
  revokeMetaPixel,
  trackMetaEvent,
} from "@/lib/meta/pixel";

/**
 * Meta Pixel + CAPI PageView, gated by the existing cookie banner.
 * Mount once inside CookieConsentProvider (root layout). Not managed by GTM.
 *
 * - No marketing consent → fbevents.js is never requested.
 * - Consent granted → pixel loads, PageView for the current page.
 * - Client-side navigation → one PageView per new pathname.
 * - Consent withdrawn → fbq('consent','revoke') + _fbp/_fbc cleared.
 */
export function MetaPixel() {
  const { marketingAllowed, hasChosen } = useCookieConsent();
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const wasAllowed = useRef(false);

  useEffect(() => {
    if (!isMetaPixelConfigured()) return;

    if (!marketingAllowed) {
      if (wasAllowed.current || hasChosen) {
        revokeMetaPixel();
      }
      wasAllowed.current = false;
      return;
    }

    wasAllowed.current = true;
    if (!ensureMetaPixel()) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    trackMetaEvent("PageView");
  }, [hasChosen, marketingAllowed, pathname]);

  return null;
}
