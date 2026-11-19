import Image from "next/image";
import Link from "next/link";
import { WhatsAppHeaderButton } from "@/components/landing/WhatsAppHeaderButton";

type SeniorHeaderProps = {
  /** When false, omit the bottom border (parent white band continues below). Default true. */
  bordered?: boolean;
  /** WhatsApp label — false on main LP (/) redesign. Default true for other LPs. */
  whatsappShowLabel?: boolean;
  /** Center the logo (main LP redesign). WhatsApp stays right. */
  logoCentered?: boolean;
  /** `/tranches-age` hides the WhatsApp CTA. Default true. */
  showWhatsApp?: boolean;
  /** Age positioning pill under the logo. Default true. */
  showAudienceBadge?: boolean;
  /**
   * Compact funnel chrome (from question 2): logo left + « Gratuit · sans engagement ».
   * Hides the audience badge even if `showAudienceBadge` is true.
   */
  funnelChrome?: boolean;
  /**
   * Brand mark in the default header. Funnel chrome always keeps the logo.
   * Homepage + `/devis` hide it above « Spécial + 55 ans » (logo lives in the purple aside).
   */
  showLogo?: boolean;
  /** Header surface — parent may paint pastel; default solid white. */
  backgroundClassName?: string;
};

function AudienceBadge() {
  return (
    <p
      className="inline-flex w-fit max-w-full flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5 rounded-2xl bg-[#5b21b6] px-5 py-2.5 text-center shadow-[0_2px_0_0_rgba(46,16,101,0.35)] sm:gap-x-3 sm:px-6 sm:py-3"
      aria-label="Offre spécialement conçue pour les plus de 55 ans"
    >
      <span className="font-poppins text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white/90 sm:text-[0.84rem]">
        Spécial
      </span>
      <span className="font-poppins text-[1.2rem] font-extrabold leading-none tracking-[-0.02em] text-white sm:text-[1.35rem]">
        +&nbsp;55&nbsp;ans
      </span>
    </p>
  );
}

export function SeniorHeader({
  bordered = true,
  whatsappShowLabel = true,
  logoCentered = false,
  showWhatsApp = true,
  showAudienceBadge = true,
  funnelChrome = false,
  showLogo = true,
  backgroundClassName = "bg-white",
}: SeniorHeaderProps = {}) {
  const withWhatsApp = showWhatsApp && !funnelChrome;
  const showBadge = showAudienceBadge && !funnelChrome;
  const centeredWithWhatsApp = logoCentered && withWhatsApp && !funnelChrome;
  const showBrandMark = showLogo || funnelChrome;
  const stackLogoBadge =
    showBadge && logoCentered && !withWhatsApp && !funnelChrome && showBrandMark;
  const badgeOnlyCentered =
    showBadge && logoCentered && !withWhatsApp && !funnelChrome && !showBrandMark;

  if (funnelChrome) {
    return (
      <header
        className={`${backgroundClassName}${bordered ? " border-b border-[#ddd6fe]" : ""}`}
      >
        <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3 px-4 py-2 lg:max-w-[84rem] lg:px-10 lg:py-2">
          <Link
            href="/"
            className="shrink-0"
            aria-label="Couverture Mutuelle"
          >
            <Image
              src="/logo-couverture-mutuelle.png"
              alt="Couverture Mutuelle"
              width={782}
              height={357}
              loading="eager"
              fetchPriority="high"
              className="block h-8 w-auto sm:h-9 lg:h-10"
            />
          </Link>
          <p className="shrink-0 text-right text-[0.8125rem] font-medium leading-snug text-zinc-600 sm:text-[0.875rem]">
            Gratuit · sans engagement
          </p>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`${backgroundClassName}${bordered ? " border-b border-[#ddd6fe]" : ""}`}
    >
      {showBrandMark || withWhatsApp || badgeOnlyCentered ? (
        <div
          className={
            centeredWithWhatsApp
              ? "mx-auto grid max-w-[640px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2 lg:max-w-[84rem] lg:px-10 lg:py-1.5"
              : badgeOnlyCentered
                ? "mx-auto flex max-w-[640px] justify-center px-4 py-3.5 lg:max-w-[84rem] lg:px-10 lg:py-4"
                : logoCentered
                  ? "mx-auto flex max-w-[640px] flex-col items-center gap-2 px-4 py-2 lg:max-w-[84rem] lg:px-10 lg:py-2"
                  : withWhatsApp
                    ? "mx-auto flex max-w-[640px] items-center justify-between gap-2 px-4 py-2"
                    : stackLogoBadge
                      ? "mx-auto flex max-w-[640px] flex-col items-start gap-2 px-4 py-2"
                      : "mx-auto flex max-w-[640px] items-center px-4 py-2"
          }
        >
          {centeredWithWhatsApp ? <span aria-hidden="true" /> : null}
          {showBrandMark ? (
            <Link
              href="/"
              className={`shrink-0${centeredWithWhatsApp ? " justify-self-center" : ""}`}
              aria-label="Couverture Mutuelle"
            >
              <Image
                src="/logo-couverture-mutuelle.png"
                alt="Couverture Mutuelle"
                width={782}
                height={357}
                loading="eager"
                fetchPriority="high"
                className="block h-9 w-auto lg:h-12"
              />
            </Link>
          ) : null}
          {withWhatsApp ? (
            <div
              className={
                centeredWithWhatsApp
                  ? "justify-self-end lg:self-start lg:pt-0.5"
                  : undefined
              }
            >
              <WhatsAppHeaderButton showLabel={whatsappShowLabel} />
            </div>
          ) : null}
          {showBadge && logoCentered && !withWhatsApp ? (
            <AudienceBadge />
          ) : null}
        </div>
      ) : null}
      {showBadge && !(logoCentered && !withWhatsApp) ? (
        <div
          className={
            logoCentered
              ? "mx-auto flex max-w-[640px] justify-center px-4 pb-2 lg:max-w-[84rem] lg:px-10"
              : "mx-auto flex max-w-[640px] justify-start px-4 pb-2"
          }
        >
          <AudienceBadge />
        </div>
      ) : null}
    </header>
  );
}
