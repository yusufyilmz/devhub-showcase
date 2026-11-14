export const selectStyles = {
  element1: "size-4 text-muted-foreground",
  element2: "absolute end-2.5 flex size-4 items-center justify-center text-primary",
  element3: "size-4",
  element4: "size-4",
  element5: "size-4",
  selectContent:
    "bg-popover text-popover-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-border shadow-lg [--notification-tone:var(--primary)]",
  selectContent2:
    "min-w-[min(max(8rem,var(--radix-select-trigger-width)),var(--radix-select-content-available-width))] max-w-(--radix-select-content-available-width) data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
  selectContent3: "p-1",
  selectContent4: "h-(--radix-select-trigger-height) w-full scroll-my-1",
  selectItem:
    "data-highlighted:bg-foreground/8 data-highlighted:text-foreground data-[state=checked]:font-medium [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-md min-h-8 py-1.5 ps-2.5 pe-8 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:min-w-0 *:[span]:last:items-center *:[span]:last:gap-2",
  selectLabel: "text-muted-foreground px-2 py-1.5 text-xs",
  selectScrollDownButton: "flex cursor-default items-center justify-center py-1",
  selectScrollUpButton: "flex cursor-default items-center justify-center py-1",
  selectSeparator: "bg-border pointer-events-none -mx-1 my-1 h-px",
  selectTrigger:
    "ui-input [background-color:var(--background)] [border-color:var(--border)] [box-shadow:none] data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-destructive/30 flex w-fit max-w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm whitespace-nowrap shadow-none motion-safe:transition-colors outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground data-[state=open]:border-primary/40 data-[size=default]:h-10 data-[size=sm]:h-8 dark:bg-foreground/5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
} as const;
