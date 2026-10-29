"use client";

import Image from "next/image";
import Link from "next/link";
import { useCookieConsent } from "@/context/CookieConsentContext";

const LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Politique de cookies" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/retirer-mon-consentement", label: "Gérer mon consentement" },
] as const;

const LINK_CLASS = "font-semibold text-white underline underline-offset-2 hover:text-[var(--iki-orange)]";

/** Co-branded footer: same legal links as the Couverture Mutuelle footer. */
export function IkiFooter() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="bg-[var(--iki-ink)] text-[var(--iki-lavender)]">
      <div aria-hidden="true" className="h-1.5 w-full" style={{ backgroundImage: "var(--iki-gradient)" }} />
      <div className="mx-auto grid max-w-[1200px] gap-4 px-4 pb-[110px] pt-8 text-[1rem] min-[760px]:pb-8 min-[900px]:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src="/images/iki/logo-iki-blanc.png"
            alt="IKI Assurance"
            width={865}
            height={580}
            sizes="72px"
            className="block h-12 w-auto"
          />
          <span aria-hidden="true" className="text-[1.5rem] font-light text-white">
            ×
          </span>
          <Image
            src="/logo-couverture-mutuelle-footer.png"
            alt="Couverture Mutuelle"
            width={1024}
            height={1024}
            sizes="80px"
            className="block h-20 w-20"
          />
        </div>
        <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5 gap-y-2">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={openPreferences} className={LINK_CLASS}>
            Gérer mes cookies
          </button>
        </nav>
        <p>
          © {new Date().getFullYear()} Couverture Mutuelle, en partenariat avec IKI
          Assurance · Service gratuit · Sans engagement
        </p>
      </div>
    </footer>
  );
}
