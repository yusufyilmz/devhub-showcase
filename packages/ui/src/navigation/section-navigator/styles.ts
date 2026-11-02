export const sectionNavigatorStyles = {
  link: "section-navigator-link",
  marker: "section-navigator-marker",
  preview: "section-navigator-preview",
  root: "section-navigator",
} as const;

import type { CSSProperties } from "react";

export const sectionNavigatorStyle = (count: number) =>
  ({ "--section-count": count }) as CSSProperties;
