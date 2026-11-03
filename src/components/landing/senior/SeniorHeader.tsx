import Image from "next/image";
import Link from "next/link";
import { WhatsAppHeaderButton } from "@/components/landing/WhatsAppHeaderButton";

export function SeniorHeader() {
  return (
    <header className="border-b border-[#ddd6fe] bg-white">
      <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Couverture Mutuelle">
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={782}
            height={357}
            loading="eager"
            fetchPriority="high"
            className="block h-11 w-auto"
          />
        </Link>
        <WhatsAppHeaderButton />
      </div>
    </header>
  );
}
