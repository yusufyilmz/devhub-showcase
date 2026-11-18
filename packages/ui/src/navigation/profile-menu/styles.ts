export const profileMenuStyles = {
  avatar:
    "profile-menu-avatar grid size-8 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--foreground)_10%,var(--card))] text-xs leading-none font-bold text-foreground",
  avatarLarge:
    "profile-menu-avatar grid size-[72px] shrink-0 place-items-center rounded-full border border-[color-mix(in_srgb,var(--primary-foreground)_30%,transparent)] bg-primary text-[26px] leading-none font-bold text-primary-foreground shadow-[0_6px_24px_color-mix(in_srgb,var(--primary)_22%,transparent)]",
  heading:
    "px-2.5 pt-1.5 pb-0.5 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase",
  identity: "grid justify-items-center gap-2.5 px-3 pt-5 pb-4 text-center",
  name: "grid min-w-0 gap-0.5 [&_>_span]:truncate [&_>_span]:text-xs [&_>_span]:whitespace-nowrap [&_>_span]:text-muted-foreground",
  panel: "w-[min(18rem,calc(100vw-24px))] min-w-0",
  trigger:
    "profile-menu-trigger size-10 shrink-0 rounded-full border border-border bg-card p-[3px] text-primary shadow-none hover:border-primary data-[state=open]:border-primary",
} as const;
