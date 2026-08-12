import * as React from "react";

/**
 * Eduvia brand mark — a geometric "E" monogram drawn in the same stroke
 * style (24x24 viewBox, rounded caps/joins, currentColor) as the lucide
 * icons used elsewhere in the app, so it sits naturally alongside them.
 *
 * Renders monochrome via `currentColor` — intended to be placed inside an
 * existing colored badge (e.g. `bg-primary text-primary-foreground`), the
 * same way the app currently wraps its logo icon.
 */
export function EduviaMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 4v16" />
      <path d="M6 4h11.5" />
      <path d="M6 12h9" />
      <path d="M6 20h11.5" />
    </svg>
  );
}