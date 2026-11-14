export const tabsStyles = {
  tabs: "flex min-w-0 flex-col gap-sm",
  tabsContent:
    "min-w-0 flex-1 rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  tabsList:
    "inline-flex min-h-9 w-fit max-w-full items-center gap-0.5 rounded-lg border border-border/60 bg-muted/50 p-0.5 text-muted-foreground data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  tabsTrigger:
    "inline-flex min-w-0 flex-1 items-center justify-center gap-xs rounded-md border border-transparent px-sm py-1.5 text-center text-sm font-medium leading-snug wrap-anywhere outline-none hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-border/75 data-[state=active]:bg-background data-[state=active]:text-foreground motion-safe:transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
} as const;
