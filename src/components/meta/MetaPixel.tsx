"use client";

import { Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useCookieConsent } from "@/context/CookieConsentContext";
import {
  hasMetaPixelStub,
  META_PIXEL_BOOTSTRAP,
  META_PIXEL_ID,
  resetMetaPixelState,
  trackMetaEvent,
} from "@/lib/meta/pixel";

function buildPathKey(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}

/**
 * Loads Meta Pixel only after marketing cookie consent.
 * Tracks PageView on consent + client navigations. No noscript fallback.
 * No health / form data. autoConfig disabled in initMetaPixel().
 */
function MetaPixelTracker() {
  const { marketingAllowed } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathKey = buildPathKey(pathname, searchParams.toString());

  useEffect(() => {
    if (!marketingAllowed) {
      resetMetaPixelState();
      return;
    }

    let cancelled = false;
    let attempts = 0;

    function tryTrack() {
      if (cancelled) return;
      if (hasMetaPixelStub()) {
        trackMetaEvent("PageView", pathKey);
        return;
      }
      attempts += 1;
      if (attempts < 80) {
        window.setTimeout(tryTrack, 50);
      }
    }

    tryTrack();

    return () => {
      cancelled = true;
    };
  }, [marketingAllowed, pathKey]);

  if (!marketingAllowed) {
    return null;
  }

  return (
    <Script
      id={`meta-pixel-${META_PIXEL_ID}`}
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: META_PIXEL_BOOTSTRAP }}
    />
  );
}

export function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelTracker />
    </Suspense>
  );
}
