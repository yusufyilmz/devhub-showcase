export const sectionStyles = {
  element1: "section-heading",
  element2: "eyebrow",
  element3: "section-content",
} as const;

export const sectionElementsStyles = {
  element1:
    "section-view-accordion grid min-w-0 gap-s [&_summary]:flex [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-s [&_summary]:rounded-lg [&_summary]:px-md [&_summary]:py-sm [&_summary]:text-start [&_summary]:text-sm [&_summary]:font-semibold [&_summary]:wrap-anywhere [&_summary:hover]:bg-primary/8 [&_summary:focus-visible]:-outline-offset-2 [&_summary:focus-visible]:outline-2 [&_summary:focus-visible]:outline-ring [&_summary_svg]:shrink-0 [&_summary_svg]:text-muted-foreground [&_details[open]_summary_svg]:rotate-180 [&_details>div]:border-t [&_details>div]:border-border/70 [&_details>div]:px-md [&_details>div]:py-sm",
  element2: "section-view-tabs",
  element3: "section-view-carousel",
  element4: "section-view-controls",
} as const;

export const sectionHeaderStyles = {
  baseClasses: "flex min-w-0 items-center gap-sm motion-safe:transition-colors",
  baseClasses2: "cursor-pointer",
  element1: "min-w-0 flex-1 wrap-anywhere",
  element2: "text-muted-foreground",
  getContainerClasses: "rounded-xl border p-md",
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
  sectionHeader6: "shrink-0 motion-safe:transition-transform",
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
