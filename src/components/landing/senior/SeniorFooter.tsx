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

const LINK_CLASS = "font-medium text-white underline underline-offset-2";

export function SeniorFooter() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="bg-[#3b0764] text-[#ddd3f7]">
      <div className="mx-auto grid max-w-[640px] gap-2.5 px-4 pb-[104px] pt-[26px] text-[0.88rem] min-[760px]:pb-[26px]">
        <Image
          src="/logo-couverture-mutuelle-footer.png"
          alt="Couverture Mutuelle"
          width={1024}
          height={1024}
          sizes="96px"
          className="block h-24 w-24"
        />
        <nav aria-label="Informations légales" className="flex flex-wrap gap-x-4 gap-y-1.5">
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
          © {new Date().getFullYear()} Couverture Mutuelle · Service gratuit ·
          Sans engagement
        </p>
      </div>
    </footer>
  );
}
