import type { ReactNode } from "react";
import type {
  CoveredPersonId,
  HealthInsuranceGoalId,
  ProfessionalStatusId,
} from "./types";

/** Line icons of the senior homepage form (46×34, currentColor). */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 46 34"
      className="h-[34px] w-[46px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const GOAL_ICONS: Record<HealthInsuranceGoalId, ReactNode> = {
  pay_less: (
    <Icon>
      <path d="M30 9a10 10 0 1 0 0 16" />
      <path d="M13 15h12M13 20h12" />
    </Icon>
  ),
  better_reimbursement: (
    <Icon>
      <path d="M10 26l9-9 6 6 11-12" />
      <path d="M29 11h7v7" />
    </Icon>
  ),
  adapt_coverage: (
    <Icon>
      <path d="M10 10h26M10 17h26M10 24h26" />
      <circle cx="17" cy="10" r="3" fill="#fff" />
      <circle cx="29" cy="17" r="3" fill="#fff" />
      <circle cx="20" cy="24" r="3" fill="#fff" />
    </Icon>
  ),
  compare_before_increase: (
    <Icon>
      <rect x="8" y="7" width="12" height="20" rx="2" />
      <rect x="26" y="7" width="12" height="20" rx="2" />
      <path d="M23 4v26" />
    </Icon>
  ),
  unknown: (
    <Icon>
      <circle cx="23" cy="17" r="13" />
      <path d="M19 13a4 4 0 1 1 5 4c-1 .4-1 1.2-1 2.5" />
      <circle cx="23" cy="24" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  ),
};

const HOUSEHOLD_ICONS: Record<CoveredPersonId, ReactNode> = {
  moi: (
    <Icon>
      <circle cx="23" cy="9" r="6" />
      <ellipse cx="23" cy="25" rx="9" ry="7" />
    </Icon>
  ),
  "moi-conjoint": (
    <Icon>
      <circle cx="15" cy="9" r="6" />
      <ellipse cx="15" cy="25" rx="9" ry="7" />
      <circle cx="31" cy="9" r="6" />
      <ellipse cx="31" cy="25" rx="9" ry="7" />
    </Icon>
  ),
  "moi-enfants": (
    <Icon>
      <circle cx="16" cy="9" r="6" />
      <ellipse cx="16" cy="25" rx="9" ry="7" />
      <circle cx="33" cy="16" r="4" />
      <ellipse cx="33" cy="27" rx="6" ry="5" />
    </Icon>
  ),
  "moi-conjoint-enfants": (
    <Icon>
      <g strokeWidth="1.8">
        <circle cx="9" cy="10" r="5" />
        <ellipse cx="9" cy="25" rx="7.5" ry="6.5" />
        <circle cx="23" cy="10" r="5" />
        <ellipse cx="23" cy="25" rx="7.5" ry="6.5" />
        <circle cx="37" cy="16" r="3.5" />
        <ellipse cx="37" cy="27" rx="5" ry="4.5" />
      </g>
    </Icon>
  ),
};

const STATUS_ICONS: Record<ProfessionalStatusId, ReactNode> = {
  retired: (
    <Icon>
      <path d="M12 14V9a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v5" />
      <path d="M8 14h4v6h22v-6h4v10H8z" />
      <path d="M12 24v3M34 24v3" />
    </Icon>
  ),
  employee: (
    <Icon>
      <rect x="9" y="9" width="28" height="20" rx="3" />
      <path d="M18 9V6h10v3M9 17h28" />
      <circle cx="23" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </Icon>
  ),
  not_working: (
    <Icon>
      <circle cx="23" cy="17" r="13" />
      <path d="M20 12v10M26 12v10" />
    </Icon>
  ),
  other: (
    <Icon>
      <path d="M23 3l5 8H18z" />
      <rect x="13" y="19" width="9" height="9" rx="1.5" />
      <circle cx="31" cy="23.5" r="4.5" />
    </Icon>
  ),
};

export function seniorGoalIcon(id: HealthInsuranceGoalId) {
  return GOAL_ICONS[id];
}

export function seniorHouseholdIcon(id: CoveredPersonId) {
  return HOUSEHOLD_ICONS[id];
}

export function seniorStatusIcon(id: ProfessionalStatusId) {
  return STATUS_ICONS[id];
}
