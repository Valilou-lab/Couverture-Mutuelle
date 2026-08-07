import Image from "next/image";
import Link from "next/link";
import { LiveComparisonsBadge } from "@/components/form/LiveComparisonsBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" className="shrink-0" aria-label="Couverture Mutuelle">
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={280}
            height={72}
            priority
            className="h-11 w-auto sm:h-14 md:h-16"
          />
        </Link>

        <div className="flex min-w-0 justify-center">
          <LiveComparisonsBadge compact />
        </div>

        <a
          href="#devis"
          className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-brand px-3.5 font-sora text-sm font-semibold text-white transition hover:bg-[#5b21b6] sm:px-5"
        >
          Comparer
        </a>
      </div>
    </header>
  );
}
