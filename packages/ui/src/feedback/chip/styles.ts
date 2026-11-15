export const chipStyles = {
  chip: "ui-chip inline-flex max-w-full items-center gap-xs rounded-full border px-s py-0.5 text-sm motion-safe:transition-colors",
  label:
    "min-w-0 rounded-full text-start wrap-anywhere focus-visible:outline-2 focus-visible:outline-ring",
  remove:
    "inline-grid size-6 shrink-0 place-items-center rounded-full hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-ring",
  selected: "border-primary/25 bg-primary/12 text-foreground",
  unselected: "border-border bg-background text-muted-foreground",
} as const;
