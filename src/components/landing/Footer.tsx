import Image from "next/image";
import Link from "next/link";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  {
    href: "/politique-de-confidentialite",
    label: "Politique de confidentialité",
  },
  { href: "/cookies", label: "Politique de cookies" },
  { href: "/retirer-mon-consentement", label: "Retirer mon consentement" },
  { href: "/partenaires", label: "Partenaires" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0f0f14] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Image
            src="/logo-couverture-mutuelle-footer.png"
            alt="Couverture Mutuelle"
            width={320}
            height={320}
            className="h-28 w-auto object-contain sm:h-32"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-300">
            Couverture Mutuelle vous aide à comparer des offres de mutuelle
            santé et à être accompagné(e) par un conseiller. Service gratuit,
            sans engagement.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Informations</p>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>
              <a
                href="mailto:conseiller.couverturemutuelle@gmail.com"
                className="hover:text-white"
              >
                conseiller.couverturemutuelle@gmail.com
              </a>
            </li>
            <li>
              <a href="#devis" className="hover:text-white">
                Demander un devis
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-zinc-400 sm:px-6">
        © {new Date().getFullYear()} Couverture Mutuelle — Service gratuit ·
        Sans engagement
      </div>
    </footer>
  );
}
