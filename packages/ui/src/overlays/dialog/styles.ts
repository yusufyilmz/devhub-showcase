export const dialogStyles = {
  dialogContent:
    "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] gap-md overflow-y-auto rounded-xl border border-border bg-background p-md shadow-xl has-[>[data-slot=dialog-close]]:pt-[calc(var(--spacing-sm)+2rem)] duration-200 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-lg",
  dialogDescription: "text-sm leading-relaxed wrap-anywhere text-muted-foreground",
  dialogFooter: "flex flex-col-reverse gap-s sm:flex-row sm:justify-end",
  dialogHeader: "flex flex-col gap-s text-center sm:text-left",
  dialogOverlay:
    "fixed inset-0 z-50 bg-black/40 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  dialogTitle: "text-lg leading-snug font-semibold wrap-anywhere",
  element1:
    "absolute end-sm top-sm grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4",
  element2: "sr-only",
} as const;
