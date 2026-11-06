export const locationMapStyles = {
  container: "grid min-w-0 justify-items-start gap-2",
  frame: "absolute inset-0 size-full border-0 motion-safe:transition-opacity duration-300",
  placeholder: "absolute inset-0 grid content-center justify-items-center gap-3 px-4 text-center",
  viewport:
    "relative h-[clamp(11rem,42vw,25rem)] w-full overflow-hidden rounded-xl border border-border bg-primary/5",
} as const;
