export const siteHeaderStyles = {
  content: "flex min-w-0 flex-1 items-center gap-xs px-s lg:px-lg",
  header:
    "sticky top-0 z-20 flex min-h-(--header-height) shrink-0 items-center border-b bg-background/95 py-xs backdrop-blur-sm",
  title: "truncate text-base font-semibold tracking-tight",
} as const;
