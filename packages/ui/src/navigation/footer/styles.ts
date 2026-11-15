const linkFocus =
  "[&_a]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ring";

export const footerStyles = {
  brand:
    "platform-footer-brand mb-[clamp(1.75rem,4vw,3rem)] flex flex-wrap items-center gap-x-lg gap-y-xs [&>p]:text-sm [&>p]:text-muted-foreground",
  compact: `folio-footer flex flex-wrap items-center justify-between gap-md border-t border-border/70 py-lg text-xs text-muted-foreground ${linkFocus}`,
  credit:
    "platform-footer-credit mt-lg border-t border-border/60 pt-md text-xs text-muted-foreground",
  element1: `site-footer mx-auto flex max-w-[1200px] flex-col justify-between gap-md border-t border-border/70 px-md pt-lg pb-[5.625rem] text-xs text-muted-foreground md:flex-row md:px-xl md:py-lg [&>div]:flex [&>div]:flex-wrap [&>div]:items-center [&>div]:gap-sm [&_a:hover]:text-foreground ${linkFocus}`,
  element2:
    "brand-mark text-[32px] leading-none font-[750] tracking-[-0.12em] text-foreground no-underline [&_span]:text-primary",
  inner:
    "platform-footer-inner mx-auto w-[min(1200px,calc(100%-clamp(2rem,8vw,5rem)))] pt-[clamp(2.5rem,5vw,4.75rem)] pb-lg",
  navigation: `platform-footer-nav grid grid-cols-[repeat(auto-fit,minmax(min(100%,9.25rem),1fr))] gap-x-md gap-y-lg [&_h2]:mb-sm [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:grid [&_ul]:gap-xs [&_a]:inline-flex [&_a]:text-sm [&_a]:wrap-anywhere [&_a]:text-muted-foreground [&_a:hover]:text-foreground [&_a:hover]:underline [&_a:hover]:underline-offset-4 ${linkFocus}`,
  platform: `platform-footer border-t border-border/70 bg-card bg-[radial-gradient(ellipse_65%_50%_at_48%_110%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_85%)] ${linkFocus}`,
} as const;
