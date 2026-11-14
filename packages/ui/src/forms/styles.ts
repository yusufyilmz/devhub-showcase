export const selectFieldStyles = {
  control: "relative block min-w-0",
  element1:
    "editor-field flex min-w-0 flex-col gap-[9px] text-xs text-muted-foreground [&_small]:text-[10px] [&_small]:leading-normal [&_small]:opacity-80 min-w-0 gap-[0.375rem] text-sm",
  element2:
    "editor-empty rounded-[14px] border border-dashed border-border px-5 py-[60px] text-center text-[13px] text-muted-foreground",
  icon: "pointer-events-none absolute end-[0.625rem] top-1/2 size-[1rem] -translate-y-1/2 text-muted-foreground",
  select: "min-h-[2.25rem] appearance-none ps-[0.75rem] pe-[2.125rem] focus-visible:border-ring",
} as const;

export const emptyStateStyles = {
  element1:
    "editor-empty rounded-[14px] border border-dashed border-border px-5 py-[60px] text-center text-[13px] text-muted-foreground",
} as const;
