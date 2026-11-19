export const chatLauncherStyles = {
  composer: "w-full [&_.studio-chat-composer]:w-full",
  eyebrow: "text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase",
  identity: "grid justify-items-center gap-1",
  mark: "grid size-[72px] place-items-center rounded-full border border-[color-mix(in_srgb,var(--primary-foreground)_30%,transparent)] bg-primary text-primary-foreground shadow-[0_6px_24px_color-mix(in_srgb,var(--primary)_22%,transparent)] [&_svg]:size-7",
  note: "max-w-prose text-xs leading-relaxed text-muted-foreground",
  panel:
    "grid w-[min(40rem,100%)] justify-items-center gap-4 rounded-xl border border-border bg-popover px-5 pt-6 pb-5 text-center text-popover-foreground shadow-md",
  section: "home-container home-chat-launcher grid justify-items-center py-16",
  suggestion:
    "flex h-auto min-h-10 w-full cursor-pointer items-center justify-start rounded-sm px-2.5 py-2 text-left text-sm font-normal whitespace-normal text-foreground outline-none hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  suggestions: "m-0 grid w-full min-w-0 gap-0.5 border-0 border-t border-border p-0 pt-3",
  title:
    "text-balance text-[clamp(1.5rem,3vw,2rem)] leading-tight font-semibold tracking-[-0.03em] text-foreground",
} as const;
