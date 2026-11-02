import Image from "next/image";

/**
 * Header « SiteHeader » of the IKI design system: frosted craie bar, IKI logo,
 * one mandarine call-to-action. IKI-branded only (no co-brand).
 */
export function IkiHeader({ ctaLabel }: { ctaLabel: string }) {
  return (
    <header className="iki-header sticky top-0 z-40">
      <div className="mx-auto flex min-h-[68px] max-w-[1248px] items-center justify-between gap-3 px-4 min-[900px]:min-h-[78px] min-[900px]:px-6">
        <a
          href="#devis"
          className="iki-header-brand flex min-w-0 items-center gap-2.5 no-underline min-[900px]:gap-3"
          aria-label="IKI Assurances — courtier mutuelle senior"
        >
          <Image
            src="/images/iki/logo-iki.svg"
            alt=""
            width={145}
            height={97}
            unoptimized
            priority
            className="block h-9 w-auto shrink-0 min-[900px]:h-11"
          />
          <span className="iki-header-tagline truncate text-[0.72rem] font-semibold leading-tight tracking-[-0.01em] text-[color:var(--encre-800)] min-[900px]:text-[0.8125rem]">
            courtier mutuelle senior
          </span>
        </a>
        <a href="#devis" className="iki-btn iki-btn-accent iki-btn-header shrink-0">
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
