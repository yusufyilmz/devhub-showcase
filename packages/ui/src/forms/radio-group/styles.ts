export const radioGroupStyles = {
  element1: "relative flex items-center justify-center",
  element2: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
  radioGroup: "grid gap-3",
  radioGroupItem:
    "aspect-square size-4 shrink-0 rounded-full border border-border bg-background text-primary shadow-none outline-none transition-[border-color,background-color] focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
} as const;
