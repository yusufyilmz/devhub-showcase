export const breadcrumbStyles = {
  breadcrumbEllipsis: "flex size-9 items-center justify-center",
  breadcrumbItem: "inline-flex min-w-0 max-w-full items-center gap-xs",
  breadcrumbLink:
    "rounded-sm hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors",
  breadcrumbList:
    "flex min-w-0 flex-wrap items-center gap-x-xs gap-y-1 text-sm wrap-anywhere text-muted-foreground sm:gap-x-sm",
  breadcrumbPage: "font-medium text-foreground",
  breadcrumbSeparator: "shrink-0 text-muted-foreground/70 [&>svg]:size-3.5 rtl:[&>svg]:rotate-180",
  element1: "size-4",
  element2: "sr-only",
} as const;
