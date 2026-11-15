export const paginationStyles = {
  element1: "hidden sm:block",
  element2: "hidden sm:block",
  element3: "size-4",
  element4: "sr-only",
  pagination: "mx-auto flex w-full justify-center",
  paginationContent: "flex min-w-0 flex-wrap items-center justify-center gap-1",
  paginationEllipsis: "grid size-9 place-items-center text-muted-foreground",
  paginationLink:
    "min-h-9 tabular-nums data-[active=true]:border-primary/35 data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-foreground",
  paginationNext: "min-w-9 gap-1 px-xs rtl:[&_svg]:rotate-180",
  paginationPrevious: "min-w-9 gap-1 px-xs rtl:[&_svg]:rotate-180",
} as const;
