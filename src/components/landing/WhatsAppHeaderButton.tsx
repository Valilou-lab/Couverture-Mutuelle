"use client";

import { pushWhatsappHeaderClickToDataLayer } from "@/lib/gtm-consent";

const WHATSAPP_URL =
  "https://wa.me/33783817657?text=Bonjour%2C%20je%20viens%20de%20Couverture%20Mutuelle%20et%20j%27aimerais%20avoir%20des%20informations%20sur%20ma%20mutuelle.";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 2.08.62 3.99 1.7 5.6L2 22l4.73-1.55a9.86 9.86 0 0 0 5.31 1.52h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.76 13.99c-.24.68-1.4 1.25-1.93 1.33-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.45.27-.29.59-.36.79-.36h.57c.18 0 .42-.07.66.5.24.59.82 2.01.89 2.16.07.14.12.32.02.51-.1.2-.14.32-.29.5-.14.17-.31.39-.44.52-.14.14-.29.29-.12.56.16.27.73 1.2 1.56 1.94 1.08.96 1.98 1.26 2.26 1.4.27.14.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.61-.14.24.09 1.54.73 1.8.86.27.14.44.2.51.31.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

/**
 * Header WhatsApp CTA for Couverture Mutuelle LPs (SeniorHeader / PrimaryHeader).
 * Not used on `/iki` — IkiHeader stays untouched.
 */
export function WhatsAppHeaderButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Couverture Mutuelle sur WhatsApp"
      onClick={() => pushWhatsappHeaderClickToDataLayer()}
      className="group inline-flex shrink-0 cursor-pointer items-center gap-2 no-underline sm:gap-2.5"
    >
      <WhatsAppGlyph className="h-6 w-6 shrink-0 text-[#25D366] sm:h-7 sm:w-7" />
      <span className="inline-flex items-center rounded-full bg-[#25D366] px-2.5 py-1 text-[0.72rem] font-semibold leading-none text-white shadow-[0_1px_2px_rgba(37,211,102,0.25)] transition-colors group-hover:bg-[#1ebe57] sm:px-3 sm:py-1.5 sm:text-[0.8125rem]">
        Nous contacter
      </span>
    </a>
  );
}
