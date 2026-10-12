"use client";

import Image from "next/image";
import { ConversionQuoteForm } from "@/components/form/ConversionQuoteForm";
import { PartnerLogoCarousel } from "@/components/landing/primary/PartnerLogoCarousel";
import { PrimaryTrustSection } from "@/components/landing/primary/PrimaryTrustSection";
import { TikTokFunnelTracker } from "@/components/landing/tiktok/TikTokFunnelTracker";

export function PrimaryHero() {
  return (
    <>
      <TikTokFunnelTracker />
      <div className="relative">
        <section className="bg-[#faf8ff]">
          <div className="mx-auto max-w-[84rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(31.25rem,33.75rem)] lg:gap-x-12 xl:gap-x-16">
              <div className="relative min-w-0">
                <div className="relative z-10 max-w-xl lg:max-w-[34rem]">
                  <p className="text-sm font-medium text-[#7c3aed]">
                    Comparer sa mutuelle simplement
                  </p>

                  <h1 className="hero-display mt-3 font-manrope text-[1.75rem] font-semibold leading-[1.18] tracking-tight text-[#3b0764] sm:text-[2.125rem] lg:text-[2.375rem] xl:text-[2.5rem]">
                    Anticipez la hausse de votre mutuelle et{" "}
                    <span className="text-[#a78bfa]">
                      économisez dès maintenant
                    </span>
                  </h1>

                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-zinc-600 sm:text-lg">
                    Répondez à 5 questions et découvrez si vous pouvez payer
                    moins cher votre mutuelle.
                  </p>

                  {/* Desktop only — under the subtitle, left-aligned */}
                  <div className="mt-8 hidden lg:block">
                    <Image
                      src="/images/hero-couple-economisez-v2.png"
                      alt="Couple senior — Économisez jusqu’à 25 %"
                      width={1024}
                      height={535}
                      className="h-auto w-full max-w-[28rem] object-contain object-left xl:max-w-[30rem]"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              <div
                id="devis"
                className="relative z-20 mx-auto w-full min-w-0 max-w-[33.75rem] lg:mx-0 lg:justify-self-end"
              >
                <ConversionQuoteForm />
              </div>
            </div>
          </div>
        </section>
        <PrimaryTrustSection />
        <PartnerLogoCarousel />
      </div>
    </>
  );
}
