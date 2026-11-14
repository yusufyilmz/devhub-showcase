export const commandStyles = {
  command:
    "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-lg",
  commandDialog: "overflow-hidden p-0",
  commandGroup:
    "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
  commandInput:
    "placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
  commandItem:
    "data-[selected=true]:bg-primary/12 data-[selected=true]:text-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-s rounded-md px-s py-xs text-sm wrap-anywhere outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  commandList: "max-h-[min(300px,50dvh)] scroll-py-xs overflow-x-hidden overflow-y-auto",
  commandSeparator: "bg-border -mx-1 h-px",
  commandShortcut: "text-muted-foreground ml-auto text-xs tracking-widest",
  element1: "sr-only",
  element2:
    "[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
  element3:
    "flex h-10 items-center gap-s border-b border-border px-sm focus-within:bg-foreground/5",
  element4: "size-4 shrink-0 opacity-50",
  element5: "px-sm py-md text-center text-sm text-muted-foreground",
} as const;
