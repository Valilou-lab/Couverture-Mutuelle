import Image from "next/image";

/**
 * Header « SiteHeader » of the IKI design system: craie bar with the official
 * IKI logo only (no call-to-action, not sticky: the form sits right below).
 */
export function IkiHeader() {
  return (
    <header className="iki-header">
      <div className="mx-auto flex min-h-[60px] max-w-[1120px] items-center gap-3 px-4 min-[900px]:min-h-[76px] min-[900px]:px-6">
        <Image
          src="/images/iki/logo-iki-couleur.png"
          alt="IKI Assurances"
          width={60}
          height={40}
          priority
          className="block h-10 w-auto shrink-0 min-[900px]:h-12"
        />
        <span className="iki-header-tagline text-[0.95rem] font-semibold leading-tight text-[color:var(--encre-800)] min-[900px]:text-[1.05rem]">
          Courtier mutuelle senior
        </span>
      </div>
    </header>
  );
}
