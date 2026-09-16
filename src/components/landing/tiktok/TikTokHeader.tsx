import Image from "next/image";
import Link from "next/link";

/**
 * TikTok landing header — isolated copy of the main Header.
 * Logo stays on /tiktok so visitors are not sent to the main landing.
 */

export function TikTokHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-3 py-3 sm:px-6 sm:py-4">
        <Link
          href="/tiktok"
          className="min-w-0 shrink-0"
          aria-label="Couverture Mutuelle"
        >
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={280}
            height={72}
            priority
            className="h-9 w-auto max-w-[7.5rem] object-contain object-center sm:h-14 sm:max-w-none md:h-16"
          />
        </Link>
      </div>
    </header>
  );
}
