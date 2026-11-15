export const navMainStyles = {
  element1: "group/collapsible",
  element2:
    "ms-auto size-4 shrink-0 text-muted-foreground motion-safe:transition-transform group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-[state=open]/collapsible:rotate-90",
  trigger: "data-[state=open]:bg-sidebar-accent/60",
} as const;

export const navProjectsStyles = {
  element1: "group-data-[collapsible=icon]:hidden",
  element3: "w-44 rounded-lg",
  element4: "text-muted-foreground",
  element5: "text-muted-foreground",
  element6: "text-muted-foreground",
  element7: "text-sidebar-foreground/70",
  element8: "text-sidebar-foreground/70",
} as const;

export const navUserStyles = {
  element1: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
  element2: "h-8 w-8 rounded-lg",
  element3: "rounded-lg",
  element4: "grid min-w-0 flex-1 text-left text-sm leading-tight",
  element5: "truncate font-medium",
  element6: "truncate text-xs text-muted-foreground",
  element7: "ms-auto size-4 shrink-0 text-muted-foreground",
  element8: "w-[max(14rem,var(--radix-dropdown-menu-trigger-width,14rem))] rounded-lg",
  element9: "p-0 font-normal",
  element10: "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
  element11: "h-8 w-8 rounded-lg",
  element12: "rounded-lg",
  element13: "grid min-w-0 flex-1 text-left text-sm leading-tight",
  element14: "truncate font-medium",
  element15: "truncate text-xs text-muted-foreground",
} as const;

export const navDocumentsStyles = {
  element1: "group-data-[collapsible=icon]:hidden",
  element2: "data-[state=open]:bg-sidebar-accent rounded-md",
  element4: "w-40 rounded-lg",
  element5: "text-sidebar-foreground/70",
  element6: "text-sidebar-foreground/70",
} as const;
