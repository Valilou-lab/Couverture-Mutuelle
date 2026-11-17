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
};

function AudienceBadge() {
  return (
    <p className="w-fit rounded-full bg-[#ede9fe] px-4 py-1.5 text-center text-[0.88rem] font-bold leading-none text-[#3b0764] sm:text-[0.95rem]">
      Spécial + 55&nbsp;ans
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
}: SeniorHeaderProps = {}) {
  const withWhatsApp = showWhatsApp && !funnelChrome;
  const showBadge = showAudienceBadge && !funnelChrome;
  const centeredWithWhatsApp = logoCentered && withWhatsApp && !funnelChrome;
  const stackLogoBadge =
    showBadge && logoCentered && !withWhatsApp && !funnelChrome;

  if (funnelChrome) {
    return (
      <header
        className={`bg-white${bordered ? " border-b border-[#ddd6fe]" : ""}`}
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
      className={`bg-white${bordered ? " border-b border-[#ddd6fe]" : ""}`}
    >
      <div
        className={
          centeredWithWhatsApp
            ? "mx-auto grid max-w-[640px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2 lg:max-w-[84rem] lg:px-10 lg:py-1.5"
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
        {showBadge && logoCentered && !withWhatsApp ? <AudienceBadge /> : null}
      </div>
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
