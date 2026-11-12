"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { hasOtpLeadConfirmed } from "@/lib/otp-lead-confirmed";

const TRUSTPILOT_BOOTSTRAP =
  "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
const TRUSTPILOT_TEMPLATE_ID = "56278e9abfbbba0bdcd568bc";
const TRUSTPILOT_BUSINESS_UNIT_ID = "6af5d902a7dbf30ad4d1c318";
const TRUSTPILOT_REVIEW_URL =
  "https://fr.trustpilot.com/review/couverturemutuelle.fr";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement, force?: boolean) => void;
    };
  }
}

function loadWidget(element: HTMLElement | null) {
  if (!element || typeof window === "undefined") return;
  window.Trustpilot?.loadFromElement(element, true);
}

/**
 * Discreet Trustpilot Review Collector — only after SMS OTP + lead success.
 */
export function TrustpilotReviewCollector() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    setEligible(hasOtpLeadConfirmed());
  }, []);

  useEffect(() => {
    if (!eligible) return;
    loadWidget(widgetRef.current);
  }, [eligible]);

  if (!eligible) return null;

  return (
    <div className="mx-auto mt-5 max-w-md rounded-2xl border border-[#ddd6fe] bg-white px-4 py-3.5 text-left sm:px-5">
      <p className="text-[0.95rem] font-bold leading-snug text-[#3b0764]">
        Votre avis compte
      </p>
      <p className="mt-1 text-[0.82rem] font-medium leading-snug text-zinc-600">
        Vous pouvez partager votre expérience Couverture Mutuelle sur Trustpilot.
      </p>
      <div className="mt-3 min-h-[52px] w-full overflow-hidden">
        <div
          ref={widgetRef}
          className="trustpilot-widget"
          data-locale="fr-FR"
          data-template-id={TRUSTPILOT_TEMPLATE_ID}
          data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
          data-style-height="52px"
          data-style-width="100%"
        >
          <a
            href={TRUSTPILOT_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.8rem] font-medium text-brand underline-offset-2 hover:underline"
          >
            Trustpilot
          </a>
        </div>
      </div>
      <Script
        id="trustpilot-bootstrap"
        src={TRUSTPILOT_BOOTSTRAP}
        strategy="lazyOnload"
        onLoad={() => loadWidget(widgetRef.current)}
      />
    </div>
  );
}
