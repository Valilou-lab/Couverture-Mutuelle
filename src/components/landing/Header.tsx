import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4">
        <Link href="/" className="shrink-0" aria-label="Couverture Mutuelle">
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={280}
            height={72}
            priority
            className="h-12 w-auto sm:h-14 md:h-16"
          />
        </Link>
        <p className="hidden text-right text-xs font-medium text-zinc-500 sm:block sm:text-sm">
          Service gratuit · Sans engagement
        </p>
        <a
          href="#devis"
          className="inline-flex min-h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition hover:bg-[#5b21b6] sm:px-5"
        >
          Comparer
        </a>
      </div>
      <p className="border-t border-border/60 bg-brand-soft/60 px-4 py-1.5 text-center text-[11px] font-medium text-brand sm:hidden">
        Service gratuit · Sans engagement
      </p>
    </header>
  );
}
