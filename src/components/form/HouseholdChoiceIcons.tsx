"use client";

import type { CoveredPersonId } from "./types";

const FILL = "#ffffff";
const STROKE = "#a78bfa";
const SW = 1.15;

function Person({
  cx,
  baseline,
  scale,
}: {
  cx: number;
  baseline: number;
  scale: number;
}) {
  const headR = 3.15 * scale;
  const gap = 0.9 * scale;
  const bodyW = 10.4 * scale;
  const bodyH = 8.6 * scale;
  const headCy = baseline - bodyH - gap - headR;
  const bodyX = cx - bodyW / 2;
  const bodyY = baseline - bodyH;

  return (
    <g>
      <circle
        cx={cx}
        cy={headCy}
        r={headR}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={bodyW / 2}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
    </g>
  );
}

function HouseholdGroup({
  adults,
  child,
  width,
}: {
  adults: number[];
  child?: number;
  width: number;
}) {
  const baseline = 21.2;

  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      className="h-full w-auto"
      fill="none"
      aria-hidden="true"
    >
      {adults.map((cx) => (
        <Person key={cx} cx={cx} baseline={baseline} scale={1} />
      ))}
      {child != null ? (
        <Person cx={child} baseline={baseline} scale={0.68} />
      ) : null}
    </svg>
  );
}

export function householdChoiceIcon(id: CoveredPersonId) {
  if (id === "moi") {
    return <HouseholdGroup adults={[12]} width={24} />;
  }
  if (id === "moi-enfants") {
    return <HouseholdGroup adults={[11]} child={22.5} width={32} />;
  }
  if (id === "moi-conjoint") {
    return <HouseholdGroup adults={[10.5, 21.5]} width={32} />;
  }
  return <HouseholdGroup adults={[9.5, 20.5]} child={31} width={40} />;
}
