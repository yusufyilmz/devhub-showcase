const surface = "sticky top-0 z-[100] border-b border-border/60 bg-background/90 backdrop-blur-lg";

export const headerStyles = {
  actions:
    "site-navigation-actions flex min-w-0 max-w-full flex-wrap items-center gap-xs sm:gap-sm",
  dropdown: "site-navigation-dropdown z-[120] w-[min(18rem,calc(100vw-24px))]",
  dropdownHeading:
    "site-navigation-dropdown-heading px-sm pt-sm pb-xs text-xs text-muted-foreground",
  element1: `site-header ${surface}`,
  inner:
    "site-navigation-inner mx-auto flex min-h-[72px] w-[min(var(--home-width,1200px),calc(100%-5rem))] items-center justify-between gap-md @max-[1000px]:w-[calc(100%-3.25rem)] @max-[760px]:min-h-16 @max-[760px]:w-full @max-[760px]:flex-wrap @max-[760px]:gap-xs @max-[760px]:px-sm @max-[760px]:py-xs",
  links:
    "site-navigation-links flex min-w-0 flex-wrap items-center justify-center gap-1 @max-[760px]:hidden",
  menu: "site-navigation-menu hidden @max-[760px]:block",
  shell: `site-navigation @container ${surface}`,
} as const;
