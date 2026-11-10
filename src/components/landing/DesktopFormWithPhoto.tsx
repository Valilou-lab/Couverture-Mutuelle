import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Form / devis anchor id. */
  id?: string;
  /** Extra classes on the outer wrapper (e.g. padding overrides). */
  className?: string;
};

/**
 * Desktop-only (/ and /tiktok): faded couple photo left of the form.
 * Mobile unchanged — form only, same max width as before.
 * Photo + form are centered as one composition.
 */
export function DesktopFormWithPhoto({
  children,
  id = "devis",
  className = "",
}: Props) {
  return (
    <div
      id={id}
      className={
        className
          ? `mx-auto w-full max-w-[560px] scroll-mt-4 lg:max-w-[1180px] ${className}`
          : "mx-auto w-full max-w-[560px] scroll-mt-4 pt-2 lg:max-w-[1180px] lg:pt-3"
      }
    >
      <div className="lg:mx-auto lg:flex lg:max-w-[1120px] lg:items-center lg:justify-center">
        <div className="relative hidden h-[min(40rem,78vh)] w-[min(100%,32rem)] shrink-0 lg:block">
          <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] lg:rounded-r-none">
            <Image
              src="/images/hero-couple-hiver.jpg"
              alt="Couple senior"
              fill
              priority
              sizes="512px"
              className="object-cover object-[center_18%]"
            />
            {/* Soft fade into the pastel LP background toward the form */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-[58%] bg-gradient-to-r from-transparent via-[#e8f2fb]/55 to-[#e8f2fb]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#e8f2fb]/80 to-transparent"
            />
          </div>

          <p className="absolute -left-5 -top-5 z-20 flex h-[12rem] w-[12rem] -rotate-[8deg] flex-col items-center justify-center rounded-full bg-[#5b21b6] px-3 text-center shadow-[0_14px_32px_-8px_rgba(91,33,182,0.6)] ring-[5px] ring-white">
            <span className="font-poppins text-[0.95rem] font-semibold leading-tight text-white/95">
              Une moyenne de
            </span>
            <span className="mt-1 font-poppins text-[1.55rem] font-extrabold leading-none tracking-tight text-[#e0a8f0]">
              150&nbsp;€&nbsp;/&nbsp;an
            </span>
            <span className="mt-1.5 font-poppins text-[0.95rem] font-semibold leading-tight text-white/95">
              d&apos;économies&nbsp;!
            </span>
          </p>
        </div>

        <div className="relative z-10 w-full min-w-0 lg:-ml-14 lg:max-w-[34rem] lg:shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
