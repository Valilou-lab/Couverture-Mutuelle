import Image from "next/image";
import Link from "next/link";
import { LiveComparisonsBadge } from "@/components/form/LiveComparisonsBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-3 py-3 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:contents">
          <Link
            href="/"
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

          <a
            href="#devis"
            className="inline-flex min-h-9 shrink-0 items-center rounded-full bg-brand px-2.5 font-sora text-xs font-semibold text-white transition hover:bg-[#5b21b6] sm:order-last sm:min-h-10 sm:px-5 sm:text-sm"
          >
            Comparer
          </a>
        </div>

        <div className="flex min-w-0 justify-center">
          <LiveComparisonsBadge compact />
        </div>
      </div>
    </header>
  );
}
