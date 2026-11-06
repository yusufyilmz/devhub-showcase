export const selectFieldStyles = {
  control: "relative block min-w-0",
  element1: "editor-field grid min-w-0 gap-[0.375rem] text-sm",
  element2: "editor-empty",
  icon: "pointer-events-none absolute end-[0.625rem] top-1/2 size-[1rem] -translate-y-1/2 text-muted-foreground",
  select: "min-h-[2.25rem] appearance-none ps-[0.75rem] pe-[2.125rem] focus-visible:border-ring",
} as const;

export const emptyStateStyles = {
  element1: "editor-empty",
} as const;
