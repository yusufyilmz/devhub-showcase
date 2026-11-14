export const notificationStyles = {
  close: "ml-auto size-[1.75rem] text-muted-foreground",
  icon: "size-[1rem] shrink-0 text-(--notification-tone)",
  root: "fixed end-[0.75rem] bottom-[0.75rem] z-50 flex w-max max-w-[min(24rem,calc(100%-1.5rem))] items-center gap-[0.625rem] rounded-lg border border-l-[3px] border-l-(--notification-tone) bg-popover px-[0.75rem] py-[0.375rem] text-sm leading-snug text-popover-foreground shadow-lg [--notification-tone:var(--primary)] data-[severity=error [padding:15px] [margin:14px_0] [font-size:12px] [line-height:1.6] [color:var(--ink)] [background:var(--surface-soft)] [border-radius:8px] [&_.text-btn]:[margin-left:12px] [color:var(--danger)] [background:var(--danger-soft)]]:[--notification-tone:var(--destructive)] data-[severity=success]:[--notification-tone:var(--success)] data-[severity=warning]:[--notification-tone:var(--warning)]",
} as const;
