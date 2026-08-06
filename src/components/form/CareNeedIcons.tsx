import type { ReactNode } from "react";
import type { CareNeedId } from "./types";

const purple = "#6d28d9";
const purpleDeep = "#4c1d95";
const purpleSoft = "#a78bfa";

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center sm:h-8 sm:w-8">
      {children}
    </span>
  );
}

function SvgIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-7 w-7 sm:h-8 sm:w-8"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const CARE_NEED_ICONS: Record<CareNeedId, ReactNode> = {
  hospitalisation: (
    <IconFrame>
      <SvgIcon>
        <rect x="8" y="12" width="24" height="22" rx="3" fill={purple} />
        <rect x="14" y="6" width="12" height="8" rx="2" fill={purpleDeep} />
        <rect x="17" y="16" width="6" height="6" rx="1" fill="white" />
        <rect x="18.5" y="14.5" width="3" height="9" rx="0.8" fill="white" />
        <rect x="11" y="26" width="5" height="8" rx="1" fill="white" opacity="0.9" />
        <rect x="17.5" y="26" width="5" height="8" rx="1" fill="white" opacity="0.9" />
        <rect x="24" y="26" width="5" height="8" rx="1" fill="white" opacity="0.9" />
        <circle cx="20" cy="9" r="1.4" fill="white" />
      </SvgIcon>
    </IconFrame>
  ),
  optique: (
    <IconFrame>
      <SvgIcon>
        <circle cx="13" cy="20" r="7" fill={purple} />
        <circle cx="27" cy="20" r="7" fill={purple} />
        <circle cx="13" cy="20" r="4.2" fill="white" />
        <circle cx="27" cy="20" r="4.2" fill="white" />
        <circle cx="13" cy="20" r="2.2" fill={purpleSoft} />
        <circle cx="27" cy="20" r="2.2" fill={purpleSoft} />
        <path d="M19.2 20h1.6" stroke={purpleDeep} strokeWidth="2.4" />
        <path
          d="M6 18.5c-1.2-.8-2.2-1-3.2-.6"
          stroke={purpleDeep}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34 18.5c1.2-.8 2.2-1 3.2-.6"
          stroke={purpleDeep}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </SvgIcon>
    </IconFrame>
  ),
  dentaire: (
    <span
      className="inline-flex h-6 w-6 shrink-0 bg-brand sm:h-7 sm:w-7"
      style={{
        WebkitMaskImage: "url(/icons/dentaire-violet.png)",
        maskImage: "url(/icons/dentaire-violet.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      aria-hidden="true"
    />
  ),
  audition: (
    <IconFrame>
      <SvgIcon>
        <path
          d="M14 12.5c0-4.2 3.2-7.5 7.2-7.5S28.4 8.3 28.4 12.5c0 3.2-1.4 4.8-3.2 6.6-1.4 1.4-2.4 2.6-2.4 4.8V28"
          fill="none"
          stroke={purple}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M22.8 28h4.2"
          stroke={purpleDeep}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="14.5" cy="20" r="5.2" fill={purple} />
        <circle cx="14.5" cy="20" r="2.4" fill="white" />
        <path
          d="M18.2 16.5c1.4.6 2.3 1.8 2.3 3.5s-.9 2.9-2.3 3.5"
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </SvgIcon>
    </IconFrame>
  ),
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
  "soins-courants": (
    <IconFrame>
      <SvgIcon>
        <circle cx="20" cy="20" r="14" fill={purple} opacity="0.12" />
        <path
          d="M12 22c0-5.2 3.4-8.5 8-8.5s8 3.3 8 8.5"
          fill="none"
          stroke={purple}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="14.5" cy="22.5" r="3.2" fill={purpleDeep} />
        <circle cx="14.5" cy="22.5" r="1.3" fill="white" />
        <path
          d="M17.5 22.5h7.5c2 0 3.5 1.4 3.5 3.2S27 29 25 29h-3"
          fill="none"
          stroke={purple}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <rect x="17" y="8" width="6" height="10" rx="3" fill={purple} />
        <rect x="18.2" y="9.2" width="3.6" height="3" rx="1" fill="white" />
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
