export const recoveryPageStyles = {
  actions: "mt-[1.25rem] flex flex-wrap items-center justify-center gap-[0.625rem]",
  button:
    "h-[2.25rem] gap-[0.375rem] border-border bg-card px-[0.75rem] text-foreground hover:border-primary/40 hover:bg-[color-mix(in_srgb,var(--primary)_12%,var(--card))] hover:text-foreground dark:bg-card dark:hover:bg-[color-mix(in_srgb,var(--primary)_16%,var(--card))]",
  card: "relative isolate grid w-full max-w-[32rem] justify-items-center overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-xl border bg-card bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--recovery-tone)_12%,transparent),transparent_68%)] px-[clamp(1rem,6vw,3rem)] py-[clamp(1.5rem,6vw,3rem)] text-center text-card-foreground shadow-lg [--notification-tone:var(--primary)]",
  description: "mt-[0.625rem] max-w-[35ch] text-sm leading-relaxed text-muted-foreground",
  icon: "mb-[1.125rem] grid size-[3rem] place-items-center rounded-xl border border-[color-mix(in_srgb,var(--recovery-tone)_25%,var(--border))] bg-[color-mix(in_srgb,var(--recovery-tone)_10%,var(--card))] text-foreground motion-safe:transition-transform motion-safe:duration-300",
  label:
    "mb-[0.375rem] font-mono text-[0.6875rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase",
  shell: "grid min-h-[min(65dvh,28rem)] w-full place-items-center px-[0.75rem] py-[1rem]",
  title: "text-[clamp(1.5rem,4vw,2.25rem)] leading-tight font-semibold tracking-tight",
} as const;
