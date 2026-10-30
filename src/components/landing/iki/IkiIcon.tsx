import { createElement } from "react";

/**
 * Tabler Outline icons (MIT, tabler.io), stroke 2 px on a 24 grid — the icon
 * family mandated by the IKI design system. Paths copied from IKI's own
 * design-system / reference landing page files.
 */
const ICONS = {
  "arrow-right": [
    ["path", { d: "M5 12l14 0" }],
    ["path", { d: "M13 18l6 -6" }],
    ["path", { d: "M13 6l6 6" }],
  ],
  "building-hospital": [
    ["path", { d: "M3 21l18 0" }],
    ["path", { d: "M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" }],
    ["path", { d: "M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" }],
    ["path", { d: "M10 9l4 0" }],
    ["path", { d: "M12 7l0 4" }],
  ],
  "chevron-down": [["path", { d: "M6 9l6 6l6 -6" }]],
  "circle-check": [
    ["path", { d: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" }],
    ["path", { d: "M9 12l2 2l4 -4" }],
  ],
  clock: [
    ["path", { d: "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" }],
    ["path", { d: "M12 7v5l3 3" }],
  ],
  ear: [
    [
      "path",
      {
        d: "M6 10a7 7 0 1 1 13 3.6a10 10 0 0 1 -2 2a8 8 0 0 0 -2 3a4.5 4.5 0 0 1 -6.8 1.4",
      },
    ],
    ["path", { d: "M10 10a3 3 0 1 1 5 2.2" }],
  ],
  eyeglass: [
    ["path", { d: "M8 4h-2l-3 10" }],
    ["path", { d: "M16 4h2l3 10" }],
    ["path", { d: "M10 16l4 0" }],
    ["path", { d: "M21 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5" }],
    ["path", { d: "M10 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5" }],
  ],
  "info-circle": [
    ["path", { d: "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" }],
    ["path", { d: "M12 9h.01" }],
    ["path", { d: "M11 12h1v4h1" }],
  ],
  lock: [
    [
      "path",
      {
        d: "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z",
      },
    ],
    ["path", { d: "M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" }],
    ["path", { d: "M8 11v-4a4 4 0 1 1 8 0v4" }],
  ],
  "message-circle": [
    [
      "path",
      {
        d: "M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1",
      },
    ],
  ],
  "mood-smile": [
    ["path", { d: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" }],
    ["path", { d: "M9 10l.01 0" }],
    ["path", { d: "M15 10l.01 0" }],
    ["path", { d: "M9.5 15a3.5 3.5 0 0 0 5 0" }],
  ],
  "phone-call": [
    [
      "path",
      {
        d: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2",
      },
    ],
    ["path", { d: "M15 7a2 2 0 0 1 2 2" }],
    ["path", { d: "M15 3a6 6 0 0 1 6 6" }],
  ],
  "shield-check": [
    [
      "path",
      {
        d: "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06",
      },
    ],
    ["path", { d: "M15 19l2 2l4 -4" }],
  ],
  star: [
    [
      "path",
      {
        d: "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z",
      },
    ],
  ],
  "user-check": [
    ["path", { d: "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" }],
    ["path", { d: "M6 21v-2a4 4 0 0 1 4 -4h4" }],
    ["path", { d: "M15 19l2 2l4 -4" }],
  ],
  users: [
    ["path", { d: "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" }],
    ["path", { d: "M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" }],
    ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }],
    ["path", { d: "M21 21v-2a4 4 0 0 0 -3 -3.85" }],
  ],
  heartbeat: [
    [
      "path",
      {
        d: "M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572",
      },
    ],
    ["path", { d: "M3 13h2l2 3l2 -6l1 3h3" }],
  ],
  rotate: [["path", { d: "M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" }]],
  "file-text": [
    ["path", { d: "M14 3v4a1 1 0 0 0 1 1h4" }],
    [
      "path",
      {
        d: "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z",
      },
    ],
    ["path", { d: "M9 9l1 0" }],
    ["path", { d: "M9 13l6 0" }],
    ["path", { d: "M9 17l6 0" }],
  ],
  check: [["path", { d: "M5 12l5 5l10 -10" }]],
} satisfies Record<string, [string, Record<string, string>][]>;

export type IkiIconName = keyof typeof ICONS;

export function IkiIcon({
  name,
  size = 24,
  className = "",
  strokeWidth = 2,
}: {
  name: IkiIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-none ${className}`}
    >
      {ICONS[name].map(([tag, attrs], index) =>
        createElement(tag, { key: index, ...attrs }),
      )}
    </svg>
  );
}
