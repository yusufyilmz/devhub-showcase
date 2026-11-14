export const popoverStyles = {
  popoverContent:
    "z-50 w-72 max-w-[min(calc(100vw-1rem),var(--radix-popover-content-available-width))] origin-(--radix-popover-content-transform-origin) rounded-xl border border-border bg-popover p-md wrap-anywhere text-popover-foreground shadow-md outline-hidden motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
} as const;
