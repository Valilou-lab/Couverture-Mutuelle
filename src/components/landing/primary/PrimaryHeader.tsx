import Image from "next/image";
import Link from "next/link";

type PrimaryHeaderProps = {
  homeHref: "/" | "/tiktok";
};

export function PrimaryHeader({ homeHref }: PrimaryHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
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
        <p className="inline-flex max-w-[10.75rem] rounded-full bg-white px-3 py-1.5 text-center text-[0.75rem] leading-snug text-brand shadow-sm ring-1 ring-brand/20 sm:max-w-none sm:px-5 sm:py-2 sm:text-base">
          Le comparateur n°1 de vos économies
        </p>
      </div>
    </header>
  );
}
