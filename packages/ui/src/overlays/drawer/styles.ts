export const drawerStyles = {
  drawerContent:
    "group/drawer-content fixed z-50 flex h-auto min-w-0 flex-col border-border bg-background text-foreground shadow-lg",
  drawerContent2:
    "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80dvh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
  drawerContent3:
    "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80dvh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
  drawerContent4:
    "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
  drawerContent5:
    "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
  drawerDescription: "text-sm leading-relaxed wrap-anywhere text-muted-foreground",
  drawerFooter: "mt-auto flex flex-col gap-s p-md",
  drawerHeader:
    "flex flex-col gap-xs p-md group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:text-left",
  drawerOverlay:
    "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
  drawerTitle: "text-lg font-semibold leading-snug wrap-anywhere text-foreground",
  element1:
    "bg-muted mx-auto mt-sm hidden h-1 w-10 shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block",
} as const;
