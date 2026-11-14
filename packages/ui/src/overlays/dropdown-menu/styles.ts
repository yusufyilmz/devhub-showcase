export const dropdownMenuStyles = {
  dropdownMenuCheckboxItem:
    "focus:bg-foreground/5 focus:text-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  dropdownMenuContent:
    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl border border-border p-1 shadow-none",
  dropdownMenuItem:
    "focus:bg-foreground/5 focus:text-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  dropdownMenuLabel: "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
  dropdownMenuRadioItem:
    "focus:bg-foreground/5 focus:text-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  dropdownMenuSeparator: "bg-border -mx-1 my-1 h-px",
  dropdownMenuShortcut: "text-muted-foreground ml-auto text-xs tracking-widest",
  dropdownMenuSubContent:
    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-xl border border-border p-1 shadow-none",
  dropdownMenuSubTrigger:
    "focus:bg-foreground/5 focus:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
  element1: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  element2: "size-4",
  element3: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  element4: "size-2 fill-current",
  element5: "ml-auto size-4",
} as const;
