export const notificationStyles = {
  close: "ms-auto text-muted-foreground",
  icon: "grid size-8 shrink-0 place-items-center rounded-lg bg-(--notification-tone)/12 text-(--notification-tone) [&_svg]:size-4",
  root: "fixed end-3 bottom-3 z-50 flex w-max max-w-[min(24rem,calc(100%-1.5rem))] items-center gap-sm rounded-xl border border-(--notification-tone)/30 bg-popover p-sm text-sm leading-snug text-popover-foreground shadow-lg [--notification-tone:var(--info)] data-[severity=error]:[--notification-tone:var(--destructive)] data-[severity=success]:[--notification-tone:var(--success)] data-[severity=warning]:[--notification-tone:var(--warning)]",
} as const;
