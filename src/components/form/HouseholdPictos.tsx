import type { CoveredPersonId } from "./types";

const BG = "#ede9fe";
const FG = "#7c3aed";

function Person({
  cx,
  baseline,
  scale,
}: {
  cx: number;
  baseline: number;
  scale: number;
}) {
  const headR = 7.1 * scale;
  const gap = 1.35 * scale;
  const bodyW = 18.4 * scale;
  const bodyH = 16.2 * scale;
  const headCy = baseline - bodyH - gap - headR;
  const bodyX = cx - bodyW / 2;
  const bodyY = baseline - bodyH;

  return (
    <g>
      <circle cx={cx} cy={headCy} r={headR} fill={FG} />
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={bodyW / 2}
        fill={FG}
      />
    </g>
  );
}

function Picto({
  adults,
  child,
  adultScale,
  childScale = 0.5,
}: {
  adults: number[];
  child?: number;
  adultScale: number;
  childScale?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 shrink-0"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="32" fill={BG} />
      {adults.map((cx) => (
        <Person key={cx} cx={cx} baseline={51} scale={adultScale} />
      ))}
      {child != null ? (
        <Person cx={child} baseline={51} scale={childScale} />
      ) : null}
    </svg>
  );
}

export function householdPicto(id: CoveredPersonId) {
  if (id === "moi") {
    return <Picto adults={[32]} adultScale={1.08} />;
  }
  if (id === "moi-conjoint") {
    return <Picto adults={[21.5, 42.5]} adultScale={0.82} />;
  }
  if (id === "moi-enfants") {
    return <Picto adults={[22]} child={43} adultScale={0.92} childScale={0.55} />;
  }
  return <Picto adults={[16, 34.5]} child={50.5} adultScale={0.74} />;
}
