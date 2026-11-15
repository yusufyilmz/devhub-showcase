import { cva } from "class-variance-authority";

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-md py-s text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 outline-none motion-safe:transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
);

export const navigationMenuStyles = {
  element1:
    "relative top-[1px] ml-1 size-3 motion-safe:transition-transform motion-safe:duration-300 group-data-[state=open]:rotate-180",
  element2: "bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md",
  navigationMenu:
    "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
  navigationMenuContent:
    "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-s md:absolute md:w-auto",
  navigationMenuContent2:
    "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200",
  navigationMenuIndicator:
    "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)]",
  navigationMenuItem: "relative",
  navigationMenuLink:
    "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-xs rounded-md p-s text-sm motion-safe:transition-colors outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&_svg:not([class*='size-'])]:size-4",
  navigationMenuList: "group flex flex-1 list-none items-center justify-center gap-1",
  navigationMenuTrigger: "group",
  navigationMenuViewport: "absolute top-full left-0 isolate z-[120] flex justify-center",
  navigationMenuViewport2:
    "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
} as const;
