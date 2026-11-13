export const chipStyles = {
  chip: "ui-chip relative isolate inline-flex items-center gap-1 overflow-hidden rounded-full border border-transparent px-3 py-1 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
  label: "relative z-10 bg-transparent",
  remove: "relative z-10 inline-grid size-6 place-items-center rounded-full hover:bg-foreground/10",
  selected: "bg-primary/15 text-foreground",
  unselected: "bg-foreground/5 text-muted-foreground hover:bg-foreground/10",
} as const;
