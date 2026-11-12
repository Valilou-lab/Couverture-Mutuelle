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
};

export function SeniorHeader({
  bordered = true,
  whatsappShowLabel = true,
  logoCentered = false,
  showWhatsApp = true,
}: SeniorHeaderProps = {}) {
  const withWhatsApp = showWhatsApp;
  const centeredWithWhatsApp = logoCentered && withWhatsApp;

  return (
    <header
      className={`bg-white${bordered ? " border-b border-[#ddd6fe]" : ""}`}
    >
      <div
        className={
          centeredWithWhatsApp
            ? "mx-auto grid max-w-[640px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2 lg:max-w-[84rem] lg:px-10 lg:py-1.5"
            : logoCentered
              ? "mx-auto flex max-w-[640px] items-center justify-center px-4 py-2 lg:max-w-[84rem] lg:px-10 lg:py-1.5"
              : withWhatsApp
                ? "mx-auto flex max-w-[640px] items-center justify-between gap-2 px-4 py-2"
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
      </div>
    </header>
  );
}
