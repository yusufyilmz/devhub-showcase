import { menuSurface } from "../menu-styles";

const menubarSurface = `${menuSurface} min-w-[min(8rem,var(--radix-menubar-content-available-width,8rem))] max-w-[min(calc(100vw-1rem),var(--radix-menubar-content-available-width,100vw))] max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin)`;

export const menubarStyles = {
  element1: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  element2: "size-4",
  element3: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  element4: "size-2 fill-current",
  element5: "ml-auto h-4 w-4",
  menubar:
    "flex min-h-10 flex-wrap items-center gap-xs rounded-lg border border-border bg-background p-xs shadow-none",
  menubarCheckboxItem:
    "focus:bg-foreground/5 focus:text-foreground relative flex cursor-default items-center gap-s rounded-xs py-1.5 pr-2 pl-8 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  menubarContent: menubarSurface,
  menubarItem:
    "focus:bg-foreground/5 focus:text-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-s rounded-sm px-2 py-1.5 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  menubarLabel: "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
  menubarRadioItem:
    "focus:bg-foreground/5 focus:text-foreground relative flex cursor-default items-center gap-s rounded-xs py-1.5 pr-2 pl-8 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  menubarSeparator: "bg-border -mx-xs my-xs h-px",
  menubarShortcut: "text-muted-foreground ml-auto text-xs tracking-widest",
  menubarSubContent: menubarSurface,
  menubarSubTrigger:
    "focus:bg-foreground/5 focus:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
  menubarTrigger:
    "focus:bg-foreground/5 focus:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring select-none",
} as const;
