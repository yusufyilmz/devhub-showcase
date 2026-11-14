export const progressStyles = {
  indicator: "h-full rounded-full bg-primary motion-safe:transition-[width]",
  progress:
    "relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/10 data-[state=indeterminate]:bg-[repeating-linear-gradient(135deg,var(--primary)_0_2px,transparent_2px_6px)]",
} as const;
