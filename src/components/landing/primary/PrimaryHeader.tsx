import Image from "next/image";
import Link from "next/link";

type PrimaryHeaderProps = {
  homeHref: "/" | "/tiktok";
};

export function PrimaryHeader({ homeHref }: PrimaryHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md lg:border-b-0 lg:bg-white lg:backdrop-blur-none">
      <div className="flex w-full items-center justify-between px-3 py-3 sm:px-6 sm:py-4 lg:mx-auto lg:max-w-[84rem] lg:px-10">
        <Link
          href={homeHref}
          className="min-w-0 shrink-0"
          aria-label="Couverture Mutuelle"
        >
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={280}
            height={72}
            priority
            className="h-9 w-auto max-w-[7.5rem] object-contain object-left sm:h-14 sm:max-w-none md:h-16"
          />
        </Link>
        <p className="inline-flex max-w-[10.75rem] rounded-full bg-white px-3 py-1.5 text-center text-[0.75rem] leading-snug text-brand shadow-sm ring-1 ring-brand/20 sm:max-w-none sm:px-5 sm:py-2 sm:text-base lg:hidden">
          Le comparateur n°1 de vos économies
        </p>
        <p className="hidden items-center gap-2 rounded-full bg-[#ecfdf5] px-3.5 py-1.5 text-sm font-medium text-[#166534] ring-1 ring-[#bbf7d0] lg:inline-flex">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]"
            aria-hidden="true"
          />
          Service gratuit • Sans engagement
        </p>
      </div>
    </header>
  );
}
