export const selectFieldStyles = {
  control: "relative block min-w-0",
  element1: "editor-field flex min-w-0 flex-col gap-xs text-sm font-medium text-foreground",
  element2:
    "editor-empty rounded-[14px] border border-dashed border-border px-5 py-[60px] text-center text-[13px] text-muted-foreground",
  icon: "pointer-events-none absolute end-sm top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
  select: "appearance-none ps-sm pe-[calc(var(--spacing-sm)+1.5rem)]",
} as const;

export const emptyStateStyles = {
  element1:
    "editor-empty rounded-[14px] border border-dashed border-border px-5 py-[60px] text-center text-[13px] text-muted-foreground",
} as const;
