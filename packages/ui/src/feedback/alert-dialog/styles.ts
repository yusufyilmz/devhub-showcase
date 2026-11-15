export const alertDialogStyles = {
  alertDialogContent:
    "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-1.5rem)] max-h-[calc(100dvh-1.5rem)] -translate-x-1/2 -translate-y-1/2 gap-md overflow-y-auto rounded-xl border border-border bg-card p-md sm:px-lg text-card-foreground shadow-xl duration-200 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  alertDialogDescription: "text-muted-foreground text-sm leading-relaxed wrap-anywhere",
  alertDialogFooter: "flex flex-wrap justify-end gap-s",
  alertDialogHeader: "flex flex-col gap-xs",
  alertDialogOverlay:
    "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  alertDialogTitle: "text-lg font-semibold tracking-tight wrap-anywhere",
  sizes: {
    default: "max-w-[30rem]",
    narrow: "max-w-[21rem]",
    wide: "max-w-[42rem]",
  },
} as const;
