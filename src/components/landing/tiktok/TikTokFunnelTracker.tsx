"use client";

import { useEffect } from "react";
import {
  hasTikTokCtaClicked,
  onTikTokCtaClick,
  trackTikTokFormView,
  trackTikTokLandingPageView,
} from "@/lib/tiktok-funnel";

const FORM_ID = "formulaire-devis";

function isFormMostlyVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height <= 0 || vh <= 0) return false;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, vh);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  return visibleHeight / Math.min(rect.height, vh) >= 0.25;
}

function tryTrackFormView(): void {
  if (!hasTikTokCtaClicked()) return;
  const el = document.getElementById(FORM_ID);
  if (!el) return;
  if (isFormMostlyVisible(el)) {
    trackTikTokFormView();
  }
}

/**
 * /tiktok-only funnel: landing view + form visibility after CTA click.
 */
export function TikTokFunnelTracker() {
  useEffect(() => {
    trackTikTokLandingPageView();
  }, []);

  useEffect(() => {
    const el = document.getElementById(FORM_ID);
    if (!el) return;

    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.2 &&
              hasTikTokCtaClicked()
            ) {
              trackTikTokFormView();
            }
          }
        },
        { threshold: [0.2, 0.35, 0.5, 0.75] },
      );
      observer.observe(el);
    }

    const unsubscribe = onTikTokCtaClick(() => {
      window.requestAnimationFrame(() => {
        tryTrackFormView();
        window.setTimeout(tryTrackFormView, 450);
      });
    });

    return () => {
      observer?.disconnect();
      unsubscribe();
    };
  }, []);

  return null;
}
