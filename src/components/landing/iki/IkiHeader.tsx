import Image from "next/image";

/**
 * Header « SiteHeader » of the IKI design system: frosted craie bar, IKI logo,
 * one mandarine call-to-action. IKI-branded only (no co-brand).
 */
export function IkiHeader({ ctaLabel }: { ctaLabel: string }) {
  return (
    <header className="iki-header sticky top-0 z-40">
      <div className="mx-auto flex min-h-[68px] max-w-[1248px] items-center justify-between gap-3 px-4 min-[900px]:min-h-[78px] min-[900px]:px-6">
        <Image
          src="/images/iki/logo-iki.svg"
          alt="IKI Assurances"
          width={145}
          height={97}
          unoptimized
          priority
          className="block h-9 w-auto min-[900px]:h-11"
        />
        <a href="#devis" className="iki-btn iki-btn-accent iki-btn-header">
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
