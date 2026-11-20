export const chatLauncherStyles = {
  composer: "w-full [&_.studio-chat-composer]:w-full",
  eyebrow: "text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase",
  identity: "grid justify-items-center gap-1",
  mark: "grid size-[72px] place-items-center rounded-full border border-[color-mix(in_srgb,var(--primary-foreground)_30%,transparent)] bg-primary text-primary-foreground shadow-[0_6px_24px_color-mix(in_srgb,var(--primary)_22%,transparent)] [&_svg]:size-7",
  note: "max-w-prose text-xs leading-relaxed text-muted-foreground",
  panel:
    "grid w-[min(40rem,100%)] justify-items-center gap-4 px-3 py-6 text-center text-foreground sm:px-5",
  section: "home-container home-chat-launcher grid justify-items-center py-16",
  suggestion:
    "inline-flex h-auto min-h-9 max-w-full cursor-pointer items-center justify-center rounded-full border border-border bg-transparent px-3 py-1.5 text-center text-xs font-medium whitespace-normal text-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-sm",
  suggestions: "m-0 flex w-full min-w-0 flex-wrap justify-center gap-2 border-0 p-0",
  title:
    "text-balance text-[clamp(1.5rem,3vw,2rem)] leading-tight font-semibold tracking-[-0.03em] text-foreground",
} as const;
