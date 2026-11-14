export const scrollAreaStyles = {
  element1:
    "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
  element2: "bg-border relative flex-1 rounded-full",
  scrollArea: "relative",
  scrollBar: "flex touch-none p-px transition-colors select-none",
  scrollBar2: "h-full w-2.5 border-l border-l-transparent",
  scrollBar3: "h-2.5 flex-col border-t border-t-transparent",
} as const;

export const scrollableContainerStyles = {
  button:
    "size-9 rounded-full border border-border/75 bg-background text-foreground shadow-sm hover:bg-muted",
  element1: "relative flex min-w-0",
  element2: "absolute left-1 top-1/2 z-10 -translate-y-1/2",
  element3:
    "flex w-full max-w-full min-w-0 gap-8 overflow-x-auto p-md whitespace-nowrap [--studio-heading-gap:0px] scrollbar-hide focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
  element4: "absolute right-1 top-1/2 z-10 -translate-y-1/2",
} as const;
