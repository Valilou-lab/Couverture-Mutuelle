"use client";

import {
  Armchair,
  BriefcaseBusiness,
  CirclePause,
  Shapes,
} from "lucide-react";
import type { ProfessionalStatusId } from "./types";

const ICON_PROPS = {
  className: "h-7 w-7 sm:h-8 sm:w-8",
  strokeWidth: 1.65,
  color: "#8b5cf6",
  "aria-hidden": true,
} as const;

export function professionalStatusIcon(id: ProfessionalStatusId) {
  if (id === "retired") return <Armchair {...ICON_PROPS} />;
  if (id === "employee") return <BriefcaseBusiness {...ICON_PROPS} />;
  if (id === "not_working") return <CirclePause {...ICON_PROPS} />;
  return <Shapes {...ICON_PROPS} />;
}
