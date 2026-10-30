"use client";

import Image from "next/image";
import Link from "next/link";
import { useCookieConsent } from "@/context/CookieConsentContext";

const LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  {
    href: "/politique-de-confidentialite",
    label: "Politique de confidentialité",
  },
  { href: "/cookies", label: "Politique de cookies" },
  { href: "/retirer-mon-consentement", label: "Gérer mon consentement" },
] as const;

const LINK_CLASS =
  "text-[1rem] font-medium text-[var(--encre-200)] underline-offset-4 hover:text-white hover:underline";

/** « SiteFooter » of the IKI design system: encre background, logo-gradient
 *  rule on top, white IKI logo, small Couverture Mutuelle co-brand.
 *  Same legal links as the Couverture Mutuelle footer. */
export function IkiFooter() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="iki-footer">
      <div className="mx-auto grid max-w-[1248px] gap-6 px-4 pb-[120px] pt-10 min-[760px]:pb-10 min-[900px]:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/images/iki/logo-iki-blanc.svg"
              alt="IKI Assurances"
              width={145}
              height={97}
              unoptimized
              className="block h-10 w-auto"
            />
            <span
              aria-hidden="true"
              className="h-9 w-px bg-[var(--encre-700)]"
            />
            <span className="flex items-center gap-2 text-[0.9rem] text-[var(--encre-300)]">
              en partenariat avec
              <Image
                src="/logo-couverture-mutuelle-footer.png"
                alt="Couverture Mutuelle"
                width={1024}
                height={1024}
                sizes="48px"
                className="block h-12 w-12"
              />
            </span>
          </div>
          <nav
            aria-label="Informations légales"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK_CLASS}>
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openPreferences}
              className={LINK_CLASS}
            >
              Gérer mes cookies
            </button>
          </nav>
        </div>
        <p className="max-w-[90ch] text-[1rem] leading-[1.6] text-[var(--encre-300)]">
          IKI Assurances, courtier spécialisé en assurance santé, activité
          historique depuis 2008. Service gratuit et sans engagement.
          Conformément à l’article L113-15-2 du code des assurances, votre
          contrat de complémentaire santé est résiliable à tout moment après un
          an d’engagement.
        </p>
        <p className="text-[0.95rem] text-[var(--encre-400)]">
          © {new Date().getFullYear()} Couverture Mutuelle, en partenariat avec
          IKI Assurances.
        </p>
      </div>
    </footer>
  );
}
