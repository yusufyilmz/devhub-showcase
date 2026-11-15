export const sliderStyles = {
  element1:
    "block size-4 shrink-0 rounded-full border-2 border-primary bg-card shadow-xs motion-safe:transition-shadow hover:ring-4 hover:ring-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  slider:
    "relative flex min-h-6 w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
  slider2:
    "relative grow overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-full bg-foreground/10 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
  slider3:
    "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
} as const;
