import type { Metadata } from "next";
import { HomeLanding } from "@/components/landing/home/HomeLanding";

export const metadata: Metadata = {
  title: "Couverture Mutuelle — Comparez les mutuelles santé",
  description:
    "Comparez gratuitement les mutuelles santé et obtenez un accompagnement personnalisé. Service sans engagement.",
  robots: { index: false, follow: true },
};

/**
 * TikTok LP — same visual as the redesigned homepage (`HomeLanding`).
 * Keeps TikTok-specific infrastructure: noindex metadata, pathname-based
 * acquisition / Vertikl campaign routing, and TikTokFunnelTracker (inside HomeLanding).
 */
export default function TikTokLandingPage() {
  return <HomeLanding />;
}
