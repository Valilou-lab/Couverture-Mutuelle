"use client";

import type { ReactNode } from "react";
import type { HealthInsuranceGoalId } from "./types";

const DISC_FILL = "#ffffff";
const DISC_STROKE = "#a78bfa";
const MARK = "#8b5cf6";

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

function PayLessIcon() {
  return (
    <SoftMarkIcon>
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="600"
        fill={MARK}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        €
      </text>
    </SoftMarkIcon>
  );
}

function BetterReimbursementIcon() {
  return (
    <SoftMarkIcon>
      <path
        d="M12 6.4 16.8 8.1v3.7c0 2.85-1.95 4.85-4.8 5.75-2.85-.9-4.8-2.9-4.8-5.75V8.1L12 6.4Z"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M9.7 12.1 11.2 13.6l3.2-3.3"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SoftMarkIcon>
  );
}

function AdaptCoverageIcon() {
  return (
    <SoftMarkIcon>
      <path
        d="M8.2 12.8V9.4a3.8 3.8 0 0 1 7.6 0v3.4"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M7.1 12.8h9.8v2.7a1.6 1.6 0 0 1-1.6 1.6H8.7a1.6 1.6 0 0 1-1.6-1.6v-2.7Z"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </SoftMarkIcon>
  );
}

function CompareBeforeIncreaseIcon() {
  return (
    <SoftMarkIcon>
      <path
        d="M7.4 15.2 10.2 12l2.2 2.1 4.2-4.5"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1 9.6h2.5v2.5"
        stroke={MARK}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SoftMarkIcon>
  );
}

function UnknownIcon() {
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

export function goalChoiceIcon(id: HealthInsuranceGoalId) {
  switch (id) {
    case "pay_less":
      return <PayLessIcon />;
    case "better_reimbursement":
      return <BetterReimbursementIcon />;
    case "adapt_coverage":
      return <AdaptCoverageIcon />;
    case "compare_before_increase":
      return <CompareBeforeIncreaseIcon />;
    case "unknown":
      return <UnknownIcon />;
  }
}
