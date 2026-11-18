const linkFocus =
  "[&_a]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ring";

export const footerStyles = {
  brand:
    "platform-footer-brand grid content-start justify-items-start gap-3 [&>p]:m-0 [&>p]:max-w-[28ch] [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-muted-foreground",
  compact: `folio-footer flex flex-wrap items-center justify-between gap-md border-t border-border/70 py-lg text-xs text-muted-foreground ${linkFocus}`,
  credit:
    "platform-footer-credit col-span-full m-0 border-t border-border/60 pt-4 text-xs text-muted-foreground",
  element1: `site-footer mx-auto flex max-w-[1200px] flex-col justify-between gap-md border-t border-border/70 px-md pt-lg pb-[5.625rem] text-xs text-muted-foreground md:flex-row md:px-xl md:py-lg [&>div]:flex [&>div]:flex-wrap [&>div]:items-center [&>div]:gap-sm [&_a:hover]:text-foreground ${linkFocus}`,
  element2:
    "brand-mark text-[32px] leading-none font-[750] tracking-[-0.12em] text-foreground no-underline [&_span]:text-primary",
  inner:
    "platform-footer-inner mx-auto w-[min(1200px,calc(100%-clamp(2rem,8vw,5rem)))] grid gap-7 py-8 md:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] md:gap-x-12 md:py-10",
  navigation: `platform-footer-nav grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 [&_ul]:list-none [&_ul]:p-0 [&_h2]:mb-sm [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:grid [&_ul]:gap-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:text-sm [&_a]:wrap-anywhere [&_a]:text-muted-foreground [&_a:hover]:text-foreground [&_a:hover]:underline [&_a:hover]:underline-offset-4 ${linkFocus}`,
  platform: `platform-footer border-t border-border/70 bg-card ${linkFocus}`,
} as const;
