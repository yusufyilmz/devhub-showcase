export const chipStyles = {
  chip: "ui-chip [@media(hover:_hover)_and_(pointer:_fine)_and_(prefers-reduced-motion:_no-preference)]:after:[position:absolute] [inset:0] [pointer-events:none] [content:''] [background:linear-gradient(_105deg,_transparent_25%,_color-mix(in_srgb,_var(--primary)_16%,_transparent)_50%,_transparent_75%_)] [transform:translateX(-105%)] [@media(hover:_hover)_and_(pointer:_fine)_and_(prefers-reduced-motion:_no-preference)]:hover:after:[animation:ui-chip-shine_650ms_ease-out] relative isolate inline-flex items-center gap-1 overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-full border border-transparent px-3 py-1 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
  label: "relative z-10 bg-transparent",
  remove: "relative z-10 inline-grid size-6 place-items-center rounded-full hover:bg-foreground/10",
  selected: "bg-primary/15 text-foreground",
  unselected: "bg-foreground/5 text-muted-foreground hover:bg-foreground/10",
} as const;
