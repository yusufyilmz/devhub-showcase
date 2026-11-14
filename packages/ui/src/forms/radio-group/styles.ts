export const radioGroupStyles = {
  element1: "relative flex items-center justify-center",
  element2: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
  radioGroup: "grid gap-sm",
  radioGroupItem:
    "aspect-square size-4 shrink-0 rounded-full border border-input bg-background text-primary shadow-none outline-none motion-safe:transition-colors enabled:hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 dark:bg-foreground/5 dark:disabled:bg-muted",
} as const;
