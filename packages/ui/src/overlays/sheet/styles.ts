export const sheetStyles = {
  element1:
    "absolute end-sm top-sm grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none",
  element2: "size-4",
  element3: "sr-only",
  sheetContent:
    "border-border bg-background text-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out fixed z-50 flex max-h-dvh flex-col gap-md overflow-y-auto shadow-lg data-[state=closed]:duration-300 data-[state=open]:duration-500",
  sheetContent2:
    "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  sheetContent3:
    "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  sheetContent4:
    "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
  sheetContent5:
    "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
  sheetDescription: "text-sm leading-relaxed wrap-anywhere text-muted-foreground",
  sheetFooter: "mt-auto flex flex-col gap-s p-md",
  sheetHeader: "flex flex-col gap-xs p-md pe-[calc(var(--spacing-sm)+2.5rem)]",
  sheetOverlay:
    "fixed inset-0 z-50 bg-black/40 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  sheetTitle: "text-lg font-semibold leading-snug wrap-anywhere text-foreground",
} as const;
