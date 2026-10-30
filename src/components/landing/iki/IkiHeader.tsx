import Image from "next/image";

/**
 * Header « SiteHeader » of the IKI design system: frosted craie bar, IKI logo,
 * one mandarine call-to-action. Couverture Mutuelle appears only as a small
 * co-brand mark next to the IKI logo.
 */
export function IkiHeader({ ctaLabel }: { ctaLabel: string }) {
  return (
    <header className="iki-header sticky top-0 z-40">
      <div className="mx-auto flex min-h-[68px] max-w-[1248px] items-center justify-between gap-3 px-4 min-[900px]:min-h-[78px] min-[900px]:px-6">
        <div
          className="flex min-w-0 items-center gap-3 min-[480px]:gap-4"
          aria-label="IKI Assurances en partenariat avec Couverture Mutuelle"
        >
          <Image
            src="/images/iki/logo-iki.svg"
            alt="IKI Assurances"
            width={145}
            height={97}
            unoptimized
            priority
            className="block h-9 w-auto min-[900px]:h-11"
          />
          <span aria-hidden="true" className="h-9 w-px bg-[var(--encre-300)]" />
          <span className="flex items-center gap-2">
            <span className="hidden text-[0.85rem] leading-tight text-[var(--encre-600)] min-[560px]:block">
              en partenariat
              <br />
              avec
            </span>
            <span className="rounded-[var(--radius-button)] border border-[var(--encre-200)] bg-white px-1.5 py-1">
              <Image
                src="/logo-couverture-mutuelle.png"
                alt="Couverture Mutuelle"
                width={782}
                height={357}
                sizes="100px"
                priority
                className="block h-7 w-auto min-[900px]:h-9"
              />
            </span>
          </span>
        </div>
        <a href="#devis" className="iki-btn iki-btn-accent iki-btn-header">
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
