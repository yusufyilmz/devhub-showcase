import { menuSurface } from "../menu-styles";

const contextSurface = `${menuSurface} min-w-[min(8rem,var(--radix-context-menu-content-available-width,8rem))] max-w-[min(calc(100vw-1rem),var(--radix-context-menu-content-available-width,100vw))] max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin)`;

export const contextMenuStyles = {
  contextMenuCheckboxItem:
    "focus:bg-foreground/5 focus:text-foreground relative flex cursor-default items-center gap-s rounded-sm py-1.5 pr-2 pl-8 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  contextMenuContent: contextSurface,
  contextMenuItem:
    "focus:bg-foreground/5 focus:text-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-s rounded-sm px-2 py-1.5 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  contextMenuLabel: "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
  contextMenuRadioItem:
    "focus:bg-foreground/5 focus:text-foreground relative flex cursor-default items-center gap-s rounded-sm py-1.5 pr-2 pl-8 text-sm wrap-anywhere outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  contextMenuSeparator: "bg-border -mx-xs my-xs h-px",
  contextMenuShortcut: "text-muted-foreground ml-auto text-xs tracking-widest",
  contextMenuSubContent: contextSurface,
  contextMenuSubTrigger:
    "focus:bg-foreground/5 focus:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground flex cursor-default items-center gap-s rounded-sm px-2 py-1.5 text-sm wrap-anywhere outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  element1: "ml-auto",
  element2: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  element3: "size-4",
  element4: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  element5: "size-2 fill-current",
} as const;
