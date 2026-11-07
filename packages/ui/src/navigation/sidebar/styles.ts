import { cva } from "class-variance-authority";

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-8 text-sm",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
        sm: "h-7 text-xs",
      },
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
    },
  },
);

export const sidebarStyles = {
  element1:
    "bg-sidebar text-sidebar-foreground w-(--sidebar-width) max-w-[calc(100vw-2rem)] p-0 [&>button]:top-[12px] [&>button]:right-[12px] [&>button]:grid [&>button]:size-[32px] [&>button]:place-items-center [&>button>svg]:size-[18px]",
  element2: "sr-only",
  element3: "flex h-full w-full flex-col pt-[48px]",
  element4: "group peer text-sidebar-foreground hidden md:block",
  element5:
    "bg-sidebar flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
  element6: "sr-only",
  element7: "size-4 rounded-md",
  element8: "h-4 max-w-(--skeleton-width) flex-1",
  sidebar: "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
  sidebar2:
    "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear motion-reduce:transition-none",
  sidebar3: "group-data-[collapsible=offcanvas]:w-0",
  sidebar4: "group-data-[side=right]:rotate-180",
  sidebar5: "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
  sidebar6: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
  sidebar7:
    "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear motion-reduce:transition-none md:flex",
  sidebar8: "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
  sidebar9: "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
  sidebar10:
    "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]",
  sidebar11:
    "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
  sidebarContent:
    "flex min-h-0 flex-1 flex-col overflow-auto [scrollbar-width:none] group-data-[collapsible=icon]:overflow-hidden",
  sidebarFooter: "flex flex-col gap-2 p-2",
  sidebarGroup: "relative flex w-full min-w-0 flex-col p-2",
  sidebarGroupAction:
    "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarGroupAction2: "after:absolute after:-inset-2 md:after:hidden",
  sidebarGroupAction3: "group-data-[collapsible=icon]:hidden",
  sidebarGroupContent: "w-full text-sm",
  sidebarGroupLabel:
    "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarGroupLabel2: "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
  sidebarHeader: "flex flex-col gap-2 p-2",
  sidebarInput: "bg-background h-8 w-full shadow-none",
  sidebarInset: "bg-background relative flex w-full min-w-0 flex-1 flex-col",
  sidebarInset2:
    "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
  sidebarMenu: "flex w-full min-w-0 flex-col gap-0",
  sidebarMenuAction:
    "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarMenuAction2: "after:absolute after:-inset-2 md:after:hidden",
  sidebarMenuAction3: "peer-data-[size=sm]/menu-button:top-1",
  sidebarMenuAction4: "peer-data-[size=default]/menu-button:top-1.5",
  sidebarMenuAction5: "peer-data-[size=lg]/menu-button:top-2.5",
  sidebarMenuAction6: "group-data-[collapsible=icon]:hidden",
  sidebarMenuAction7:
    "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
  sidebarMenuBadge:
    "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
  sidebarMenuBadge2:
    "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
  sidebarMenuBadge3: "peer-data-[size=sm]/menu-button:top-1",
  sidebarMenuBadge4: "peer-data-[size=default]/menu-button:top-1.5",
  sidebarMenuBadge5: "peer-data-[size=lg]/menu-button:top-2.5",
  sidebarMenuBadge6: "group-data-[collapsible=icon]:hidden",
  sidebarMenuItem: "group/menu-item relative",
  sidebarMenuSkeleton: "flex h-8 items-center gap-2 rounded-md px-2",
  sidebarMenuSub:
    "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
  sidebarMenuSub2: "group-data-[collapsible=icon]:hidden",
  sidebarMenuSubButton:
    "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarMenuSubButton2:
    "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
  sidebarMenuSubButton3: "text-xs",
  sidebarMenuSubButton4: "text-sm",
  sidebarMenuSubButton5: "group-data-[collapsible=icon]:hidden",
  sidebarMenuSubItem: "group/menu-sub-item relative",
  sidebarProvider:
    "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
  sidebarRail:
    "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
  sidebarRail2: "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
  sidebarRail3:
    "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
  sidebarRail4:
    "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
  sidebarRail5: "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
  sidebarRail6: "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
  sidebarSeparator: "bg-sidebar-border mx-2 w-auto",
  sidebarTrigger: "size-7",
} as const;
