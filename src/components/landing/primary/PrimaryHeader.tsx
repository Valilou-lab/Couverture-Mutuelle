import Image from "next/image";
import Link from "next/link";

type PrimaryHeaderProps = {
  homeHref: "/" | "/tiktok";
};

export function PrimaryHeader({ homeHref }: PrimaryHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white">
      <div className="border-b border-brand/10 bg-brand-soft">
        <div className="mx-auto flex h-8 max-w-[84rem] items-center px-4 sm:px-6 lg:px-10">
          <p className="text-[0.75rem] font-medium tracking-wide text-[#5b21b6] sm:text-[0.8125rem]">
            Mutuelle de particulier française
          </p>
        </div>
      </div>

      <header className="border-b border-border/60 bg-white">
        <div className="mx-auto flex max-w-[84rem] items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 lg:px-10">
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
              className="h-10 w-auto max-w-[9.5rem] object-contain object-left sm:h-12 sm:max-w-[11rem] md:h-[3.25rem] md:max-w-none"
            />
          </Link>
          <p className="text-right text-[0.75rem] font-medium leading-snug text-[#5b21b6] sm:text-sm">
            Service gratuit • Sans engagement
          </p>
        </div>
      </header>
    </div>
  );
}
