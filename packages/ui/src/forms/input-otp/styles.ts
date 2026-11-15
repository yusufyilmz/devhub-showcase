export const inputOTPStyles = {
  element1: "pointer-events-none absolute inset-0 flex items-center justify-center",
  element2: "h-4 w-px bg-current motion-safe:animate-caret-blink",
  inputOTP: "disabled:cursor-not-allowed",
  inputOTP2: "group/otp flex min-w-0 max-w-full items-center gap-xs has-disabled:opacity-50",
  inputOTPGroup: "flex min-w-0 items-center gap-1",
  inputOTPSlot:
    "relative grid h-10 w-9 min-w-0 place-items-center rounded-md border border-border bg-background text-sm font-medium tabular-nums motion-safe:transition-colors dark:bg-foreground/5 data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/50 group-has-[[aria-invalid=true]]/otp:border-destructive group-has-[[aria-invalid=true]]/otp:data-[active=true]:ring-destructive/30",
} as const;
