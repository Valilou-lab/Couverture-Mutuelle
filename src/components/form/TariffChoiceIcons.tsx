"use client";

import type { ReactNode } from "react";
import type { CurrentMutualTariffId } from "./types";

const DISC_FILL = "#ffffff";
const DISC_STROKE = "#a78bfa";
const MARK = "#8b5cf6";

function TokenStack({ count }: { count: 1 | 2 | 3 | 4 }) {
  const size = 26;
  const step = 11;
  const width = size + (count - 1) * step;

  return (
    <svg
      viewBox={`0 0 ${width} ${size}`}
      className="h-[1.375rem] w-auto sm:h-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => {
        const cx = 13 + index * step;
        const cy = 13;
        return (
          <g key={index}>
            <circle
              cx={cx}
              cy={cy}
              r="11.25"
              fill={DISC_FILL}
              stroke={DISC_STROKE}
              strokeWidth="1.1"
            />
            <text
              x={cx}
              y={cy + 3.6}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="500"
              fill={MARK}
              fontFamily="var(--font-poppins-family), ui-sans-serif, system-ui, sans-serif"
            >
              €
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SoftMarkIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.375rem] w-[1.375rem] sm:h-6 sm:w-6"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10.25"
        fill={DISC_FILL}
        stroke={DISC_STROKE}
        strokeWidth="1.1"
      />
      {children}
    </svg>
  );
}

function CircleHelpIcon() {
  return (
    <SoftMarkIcon>
      <path
        d="M9.55 9.7a2.45 2.45 0 1 1 3.55 2.2c-.68.44-1.15.92-1.15 1.85"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.55" r="0.85" fill={MARK} />
    </SoftMarkIcon>
  );
}

function ShieldOffIcon() {
  return (
    <SoftMarkIcon>
      <path
        d="M12 6.2 17.1 8v4.15c0 3.05-2.05 5.2-5.1 6.15-3.05-.95-5.1-3.1-5.1-6.15V8L12 6.2Z"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M8.15 8.2 15.85 15.8"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </SoftMarkIcon>
  );
}

const RANGE_COUNTS: Partial<Record<CurrentMutualTariffId, 1 | 2 | 3 | 4>> = {
  under_60: 1,
  "60_90": 2,
  "90_120": 3,
  over_120: 4,
};

export function tariffChoiceIcon(id: CurrentMutualTariffId) {
  const count = RANGE_COUNTS[id];
  if (count) return <TokenStack count={count} />;
  if (id === "unknown") return <CircleHelpIcon />;
  return <ShieldOffIcon />;
}
