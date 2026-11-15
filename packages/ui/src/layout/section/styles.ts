export const sectionStyles = {
  element1: "section-heading",
  element2: "eyebrow",
  element3: "section-content",
} as const;

export const sectionElementsStyles = {
  element1: "section-view-accordion",
  element2: "section-view-tabs",
  element3: "section-view-carousel",
  element4: "section-view-controls",
} as const;

export const sectionHeaderStyles = {
  baseClasses: "flex items-center gap-3 transition-all",
  baseClasses2: "cursor-pointer",
  element1: "flex-1",
  element2: "text-muted-foreground",
  getContainerClasses: "p-4 rounded-lg border",
  getContainerClasses2: "hover:bg-opacity-80",
  getContainerClasses3: "py-2 px-0",
  getContainerClasses4: "hover:opacity-80",
  getContainerClasses5: "p-4 pb-2 border-b border-border/40",
  getContainerClasses6: "hover:bg-accent/50",
  sectionHeader: "flex items-center justify-center",
  sectionHeader2: "font-semibold text-sm tracking-wide",
  sectionHeader3: "uppercase",
  sectionHeader4: "transition-colors",
  sectionHeader5: "text-xs",
  sectionHeader6: "shrink-0 transition-transform",
  sectionHeader7: "rotate-180",
} as const;

export const colorSchemeClasses = {
  error: "text-destructive bg-destructive/5 border-destructive/20",
  info: "text-info bg-info/5 border-info/20",
  primary: "text-primary bg-primary/5 border-primary/20",
  secondary: "text-secondary bg-secondary/5 border-secondary/20",
  success: "text-success bg-success/5 border-success/20",
  warning: "text-warning bg-warning/5 border-warning/20",
};

export function sectionClassName(...values: unknown[]): string {
  return `portfolio-section ${values[0]}`;
}

export function sectionGridClassName(...values: unknown[]): string {
  return `section-view-grid section-view-${values[0]}`;
}
