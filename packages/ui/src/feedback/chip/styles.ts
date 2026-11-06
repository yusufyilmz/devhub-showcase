export const chipStyles = {
  chip: "ui-chip relative isolate inline-flex items-center gap-[0.25rem] overflow-hidden rounded-full border px-[0.75rem] py-[0.25rem] text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
  label: "relative z-10 bg-transparent",
  remove:
    "relative z-10 inline-grid size-[1.5rem] place-items-center rounded-full hover:bg-primary/15",
  selected: "border-primary/35 bg-primary/12 text-foreground",
  unselected: "border-border bg-card text-muted-foreground",
} as const;
