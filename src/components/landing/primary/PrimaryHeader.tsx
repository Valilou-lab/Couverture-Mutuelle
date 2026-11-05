import Image from "next/image";
import Link from "next/link";
import { WhatsAppHeaderButton } from "@/components/landing/WhatsAppHeaderButton";

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
        <div className="mx-auto grid max-w-[84rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-6 sm:py-3.5 lg:px-10 lg:pb-1 lg:pt-3">
          <span aria-hidden="true" />
          <Link
            href={homeHref}
            className="min-w-0 shrink-0 justify-self-center"
            aria-label="Couverture Mutuelle"
          >
            <Image
              src="/logo-couverture-mutuelle.png"
              alt="Couverture Mutuelle"
              width={280}
              height={72}
              priority
              className="h-10 w-auto max-w-[9.5rem] object-contain sm:h-12 sm:max-w-[11rem] md:h-[3.25rem] md:max-w-none lg:h-[4.25rem]"
            />
          </Link>
          <div className="justify-self-end lg:self-start lg:pt-0.5">
            <WhatsAppHeaderButton showLabel={false} />
          </div>
        </div>
      </header>
    </div>
  );
}
