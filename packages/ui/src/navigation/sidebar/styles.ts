import { cva } from "class-variance-authority";

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button group-has-data-[sidebar [position:fixed] [inset:0_auto_0_0] [z-index:20] [display:flex] [flex-direction:column] [width:244px] [padding:38px_25px] [background:var(--surface)] [border-right:1px_solid_var(--line)] [&_nav]:[display:grid] [gap:7px] [&_nav_button]:[display:flex] [gap:13px] [align-items:center] [justify-content:flex-start] [min-height:44px] [padding:10px_14px] [font-weight:550] [color:var(--muted)] [text-align:left] [background:transparent] [border:0] [border-radius:9px] [&_nav_button.active]:[color:var(--ink)] [background:var(--surface-soft)] max-[1200px]:[width:205px] [padding:32px_18px] max-[950px]:[width:170px] max-[700px]:[inset:auto_0_0] [width:100%] [height:calc(68px_+_env(safe-area-inset-bottom))] [padding:0_5px_env(safe-area-inset-bottom)] [background:var(--surface)] [border-top:1px_solid_var(--line)] [border-right:0] [backdrop-filter:blur(20px)] max-[700px]:[&_>_.brand]:[display:none] max-[700px]:[&_nav]:[display:grid] [grid-template-columns:repeat(5,_1fr)] [gap:0] max-[700px]:[&_nav_button]:[display:flex] [flex-direction:column] [gap:5px] [padding:12px_3px_8px] [font-size:9px] [border-radius:0] max-[700px]:[&_nav_button.active]:[color:var(--ink)] [background:transparent] max-[700px]:[&_nav_svg]:[width:20px] [height:20px] [background:var(--surface)] [&_nav_button.active]:[color:var(--accent)] [background:var(--accent-soft)] [&_nav_button:hover]:[color:var(--accent)] [background:var(--surface-soft)] max-[700px]:[background:color-mix(in_srgb,_var(--surface)_94%,_transparent)] max-[700px]:[&_nav_button.active]:[color:var(--accent)] [background:transparent] max-[700px]:[&_nav_button]:[justify-content:center] [height:100%] [min-height:56px] [border-radius:10px]=menu-action]/menu-item:pr-8 flex w-full items-center gap-2 overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-lg border border-transparent ps-2 pe-4 text-left text-sm text-sidebar-foreground outline-hidden ring-sidebar-ring motion-safe:transition-colors hover:bg-sidebar-accent/20 focus-visible:bg-sidebar-accent/20 focus-visible:ring-2 focus-visible:ring-inset active:bg-sidebar-accent/30 disabled:pointer-events-none disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-muted aria-disabled:text-muted-foreground data-[active=true]:border-sidebar-border data-[active=true]:bg-sidebar-accent/35 data-[active=true]:font-medium data-[state=open]:bg-sidebar-accent/20 data-open:bg-sidebar-accent/20 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 text-sm",
        lg: "h-12 px-5 text-sm group-data-[collapsible=icon]:p-0!",
        sm: "h-8 px-2 text-xs",
      },
      variant: {
        default: "",
        outline: "border-sidebar-border",
      },
    },
  },
);

export const sidebarStyles = {
  element1:
    "bg-sidebar text-sidebar-foreground w-(--sidebar-width) max-w-[calc(100vw-2rem)] p-0 [&>button]:top-3 [&>button]:right-3 [&>button]:grid [&>button]:size-8 [&>button]:place-items-center [&>button>svg]:size-4.5",
  element2: "sr-only",
  element3: "flex h-full w-full flex-col pt-12",
  element4: "group peer text-sidebar-foreground hidden md:block",
  element5:
    "bg-sidebar flex size-full flex-col group-data-[variant=floating]:rounded-xl group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border",
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
    "group-data-[collapsible=icon]:w-(--sidebar-width-icon) border-sidebar-border group-data-[side=left]:border-r group-data-[side=right]:border-l",
  sidebarContent:
    "flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)]",
  sidebarFooter: "flex flex-col gap-xs border-sidebar-border border-t p-s",
  sidebarGroup: "relative flex w-full min-w-0 flex-col p-s",
  sidebarGroupAction:
    "text-sidebar-foreground ring-sidebar-ring absolute top-2.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-[background-color,color] hover:bg-foreground/5 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarGroupAction2: "after:absolute after:-inset-2 md:after:hidden",
  sidebarGroupAction3: "group-data-[collapsible=icon]:hidden",
  sidebarGroupContent: "w-full text-sm",
  sidebarGroupLabel:
    "text-sidebar-foreground/70 ring-sidebar-ring flex h-10 shrink-0 items-center rounded-md pr-4 pl-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarGroupLabel2:
    "group-data-[collapsible=icon]:-mt-10 group-data-[collapsible=icon]:opacity-0",
  sidebarHeader: "flex flex-col gap-xs p-s",
  sidebarInput: "bg-background h-8 w-full shadow-none",
  sidebarInset: "bg-background relative flex w-full min-w-0 flex-1 flex-col",
  sidebarInset2:
    "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:ring-1 md:peer-data-[variant=inset]:ring-sidebar-border md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
  sidebarMenu: "flex w-full min-w-0 flex-col gap-1",
  sidebarMenuAction:
    "text-sidebar-foreground ring-sidebar-ring peer-hover/menu-button:text-sidebar-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-[background-color,color] hover:bg-foreground/5 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
  sidebarMenuAction2: "after:absolute after:-inset-2 md:after:hidden",
  sidebarMenuAction3: "peer-data-[size=sm]/menu-button:top-1.5",
  sidebarMenuAction4: "peer-data-[size=default]/menu-button:top-2.5",
  sidebarMenuAction5: "peer-data-[size=lg]/menu-button:top-3.5",
  sidebarMenuAction6: "group-data-[collapsible=icon]:hidden",
  sidebarMenuAction7:
    "peer-data-[active=true]/menu-button:text-sidebar-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
  sidebarMenuBadge:
    "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
  sidebarMenuBadge2:
    "peer-hover/menu-button:text-sidebar-foreground peer-data-[active=true]/menu-button:text-sidebar-foreground",
  sidebarMenuBadge3: "peer-data-[size=sm]/menu-button:top-1.5",
  sidebarMenuBadge4: "peer-data-[size=default]/menu-button:top-2.5",
  sidebarMenuBadge5: "peer-data-[size=lg]/menu-button:top-3.5",
  sidebarMenuBadge6: "group-data-[collapsible=icon]:hidden",
  sidebarMenuItem: "group/menu-item relative",
  sidebarMenuSkeleton: "flex h-10 items-center gap-2 rounded-xl px-2",
  sidebarMenuSub: "ms-3 flex min-w-0 flex-col gap-1 border-sidebar-border border-s ps-2",
  sidebarMenuSub2: "group-data-[collapsible=icon]:hidden",
  sidebarMenuSubButton:
    "text-sidebar-foreground ring-sidebar-ring flex h-8 min-w-0 items-center gap-2 overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-lg border border-transparent px-2 text-xs outline-hidden motion-safe:transition-colors hover:bg-sidebar-accent/20 focus-visible:bg-sidebar-accent/20 focus-visible:ring-2 focus-visible:ring-inset active:bg-sidebar-accent/30 disabled:pointer-events-none disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-muted aria-disabled:text-muted-foreground [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  sidebarMenuSubButton2:
    "data-[active=true]:border-sidebar-border data-[active=true]:bg-sidebar-accent/35 data-[active=true]:font-medium",
  sidebarMenuSubButton3: "text-xs",
  sidebarMenuSubButton4: "text-xs",
  sidebarMenuSubButton5: "group-data-[collapsible=icon]:hidden",
  sidebarMenuSubItem: "group/menu-sub-item relative",
  sidebarProvider:
    "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
  sidebarRail:
    "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-px sm:flex",
  sidebarRail2: "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
  sidebarRail3:
    "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
  sidebarRail4:
    "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
  sidebarRail5: "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
  sidebarRail6: "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
  sidebarSeparator: "bg-sidebar-border mx-2 w-auto",
  sidebarTrigger: "size-8 aria-expanded:bg-sidebar-accent/25",
} as const;
