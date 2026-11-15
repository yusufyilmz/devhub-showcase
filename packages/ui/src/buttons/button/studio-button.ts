const studioButtonBase =
  "inline-flex min-h-[46px] items-center justify-center gap-sm rounded-lg border px-lg py-sm text-sm font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60 aria-disabled:opacity-60 motion-safe:transition-colors";

export const studioButtonClass = {
  primary: `${studioButtonBase} border-primary bg-primary text-primary-foreground hover:bg-primary/90`,
  secondary: `${studioButtonBase} border-border/75 bg-card text-foreground hover:border-border hover:bg-muted`,
} as const;
