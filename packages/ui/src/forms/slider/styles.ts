export const sliderStyles = {
  element1:
    "block size-3.5 shrink-0 rounded-full border-2 border-primary bg-background shadow-none transition-[box-shadow] hover:ring-4 hover:ring-primary/15 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  slider:
    "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
  slider2:
    "relative grow overflow-hidden rounded-full bg-foreground/10 data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1",
  slider3:
    "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
} as const;
