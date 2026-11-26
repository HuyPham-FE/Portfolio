import type { IconName } from "@/types/content";

// One stroke style for every UI icon; text glyphs (↗ ✳ ◇) fell back to other
// fonts and rendered thin and inconsistent.
const PATHS: Record<IconName, string> = {
  "arrow-up-right": "M7 17 17 7M9 7h8v8",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  "arrow-down-right": "M7 7l10 10M17 9v8H9",
  "arrow-up": "M12 19V5M6 11l6-6 6 6",
  code: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  layout: "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 9h16M10 9v11",
  search: "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM16 16l5 5",
  pen: "M12 20h8M15.5 4.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  sparkle: "M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10z",
};

export function Icon({ name }: { name: IconName }) {
  const filled = name === "sparkle";
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
