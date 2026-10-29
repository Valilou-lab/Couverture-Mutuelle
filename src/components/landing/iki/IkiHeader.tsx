import Image from "next/image";

/** Co-branded header: IKI Assurance × Couverture Mutuelle. */
export function IkiHeader() {
  return (
    <header className="relative border-b border-[var(--iki-violet-20)] bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3 min-[900px]:px-8">
        <div
          className="flex min-w-0 items-center gap-2.5 min-[480px]:gap-4"
          aria-label="IKI Assurance en partenariat avec Couverture Mutuelle"
        >
          <Image
            src="/images/iki/logo-iki.png"
            alt="IKI Assurance"
            width={865}
            height={580}
            loading="eager"
            fetchPriority="high"
            className="block h-9 w-auto min-[480px]:h-11 min-[900px]:h-14"
          />
          <span
            aria-hidden="true"
            className="text-[1.5rem] font-light leading-none text-[var(--iki-text)]"
          >
            ×
          </span>
          <Image
            src="/logo-couverture-mutuelle.png"
            alt="Couverture Mutuelle"
            width={782}
            height={357}
            loading="eager"
            className="block h-9 w-auto min-[480px]:h-11 min-[900px]:h-14"
          />
        </div>
        <span className="hidden whitespace-nowrap rounded-full bg-[var(--iki-lavender)] px-3 py-1.5 text-[0.95rem] font-semibold text-[var(--iki-ink)] min-[420px]:inline-block">
          Gratuit • Sans engagement
        </span>
      </div>
      <div aria-hidden="true" className="h-1 w-full" style={{ backgroundImage: "var(--iki-gradient)" }} />
    </header>
  );
}
