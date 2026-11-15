export const recoveryPageStyles = {
  actions: "mt-lg flex flex-wrap items-center justify-center gap-xs",
  button: "h-9 gap-xs border-border/75 bg-card px-sm text-foreground hover:bg-muted",
  card: "relative isolate grid w-full max-w-lg justify-items-center rounded-xl border border-border/75 bg-card bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--recovery-tone)_9%,transparent),transparent_65%)] px-md py-xl text-center text-card-foreground wrap-anywhere sm:px-xl",
  description: "mt-xs max-w-[35ch] text-sm leading-relaxed text-muted-foreground",
  icon: "mb-md grid size-12 place-items-center rounded-xl border border-border/60 bg-[color-mix(in_srgb,var(--recovery-tone)_10%,var(--card))] text-foreground",
  label: "mb-1 text-xs font-medium text-muted-foreground",
  shell: "grid min-h-[min(65dvh,28rem)] w-full place-items-center px-sm py-md",
  title: "text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
} as const;
