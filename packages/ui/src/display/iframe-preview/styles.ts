export const iFramePreviewStyles = {
  container:
    "overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-xl border border-border bg-card shadow-sm",
  frame: "pointer-events-none block origin-top-left border-0",
  status:
    "pointer-events-none absolute inset-0 grid place-items-center bg-background/90 p-4 text-center text-muted-foreground text-sm",
  toolbar: "flex flex-wrap items-center justify-between gap-2 border-border border-b p-2",
  viewport:
    "relative h-[clamp(240px,52vh,500px)] overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] bg-muted",
} as const;
