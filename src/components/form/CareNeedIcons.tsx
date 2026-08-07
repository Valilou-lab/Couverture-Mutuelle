import type { ReactNode } from "react";
import type { CareNeedId } from "./types";

const purple = "#6d28d9";
const purpleDeep = "#4c1d95";
const purpleSoft = "#a78bfa";

const PICTO_SRC: Partial<Record<CareNeedId, string>> = {
  hospitalisation: "/images/Pictos/picto-hopital.png?v=2",
  optique: "/images/Pictos/picto-optique.png?v=2",
  dentaire: "/images/Pictos/picto-dent.png?v=2",
  audition: "/images/Pictos/picto-audition.png?v=2",
  "soins-courants": "/images/Pictos/picto-soins-courant.png?v=2",
};

function PictoIcon({ src }: { src: string; alt: string }) {
  return (
    <span
      className="block h-full w-full bg-[#6d28d9]"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      aria-hidden="true"
    />
  );
}

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-full w-full items-center justify-center">
      {children}
    </span>
  );
}

function SvgIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      {children}
    </svg>
  );
}

const FALLBACK_ICONS: Partial<Record<CareNeedId, ReactNode>> = {
  "medecines-douces": (
    <IconFrame>
      <SvgIcon>
        <ellipse cx="20" cy="30" rx="8" ry="3" fill={purpleSoft} opacity="0.45" />
        <path
          d="M20 30V12"
          stroke={purpleDeep}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M20 22c-5.5-1.5-8.5-5.5-9-10 5.2.8 9 4.2 9 10Z"
          fill={purple}
        />
        <path
          d="M20 18c5.5-1.5 8.5-5 9-9.2-5 .6-8.2 3.6-9 9.2Z"
          fill={purpleDeep}
        />
        <path
          d="M20 14c-2.8-.8-4.5-2.6-5-4.8 3 .5 4.8 2.2 5 4.8Z"
          fill="white"
          opacity="0.55"
        />
      </SvgIcon>
    </IconFrame>
  ),
  "je-ne-sais-pas": (
    <IconFrame>
      <SvgIcon>
        <circle cx="20" cy="20" r="13" fill={purple} />
        <path
          d="M15.8 16.2a4.2 4.2 0 1 1 6.4 3.6c-1.2.8-1.9 1.5-1.9 3.2"
          fill="none"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="20" cy="27.2" r="1.6" fill="white" />
      </SvgIcon>
    </IconFrame>
  ),
};

function buildCareNeedIcons(): Record<CareNeedId, ReactNode> {
  const icons = { ...FALLBACK_ICONS } as Record<CareNeedId, ReactNode>;

  (Object.entries(PICTO_SRC) as [CareNeedId, string][]).forEach(
    ([id, src]) => {
      icons[id] = <PictoIcon src={src} alt={id} />;
    },
  );

  return icons;
}

export const CARE_NEED_ICONS = buildCareNeedIcons();
