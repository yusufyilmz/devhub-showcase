export const siteHeaderStyles = {
  actions: "col-span-full flex min-w-0 flex-wrap items-center gap-xs sm:col-span-1 sm:justify-end",
  content:
    "grid w-full min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-x-xs gap-y-[var(--spacing-sm)] px-sm sm:grid-cols-[auto_auto_minmax(0,1fr)_auto] lg:px-lg",
  header:
    "sticky top-0 z-20 flex min-h-(--header-height) shrink-0 items-center border-b border-border/70 bg-background/95 py-xs backdrop-blur-sm",
  title: "min-w-0 text-base leading-snug font-semibold tracking-tight text-balance wrap-anywhere",
} as const;
