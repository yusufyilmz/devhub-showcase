export const locationMapStyles = {
  container: "grid min-w-0 justify-items-start gap-s",
  frame: "absolute inset-0 size-full border-0 motion-safe:transition-opacity duration-300",
  placeholder: "absolute inset-0 grid content-center justify-items-center gap-s px-s text-center",
  viewport:
    "relative h-[clamp(11rem,42vw,25rem)] w-full overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-xl border border-border/75 bg-primary/5",
} as const;
