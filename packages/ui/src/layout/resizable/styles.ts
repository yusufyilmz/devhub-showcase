export const resizableStyles = {
  element1:
    "pointer-events-none z-10 flex h-5 w-3.5 items-center justify-center rounded-full border border-border/75 bg-background text-muted-foreground",
  element2: "size-3",
  resizableHandle:
    "relative flex w-px items-center justify-center bg-border/70 after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 focus-visible:bg-ring focus-visible:outline-2 focus-visible:outline-ring hover:bg-primary/60 data-[resize-handle-state=drag]:bg-primary data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:inset-x-0 data-[panel-group-direction=vertical]:after:inset-y-auto data-[panel-group-direction=vertical]:after:top-1/2 data-[panel-group-direction=vertical]:after:h-3 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
  resizablePanelGroup: "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
} as const;
