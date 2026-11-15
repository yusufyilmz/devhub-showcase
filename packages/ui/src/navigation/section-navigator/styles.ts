import type { CSSProperties } from "react";

export const sectionNavigatorStyles = {
  link: "section-navigator-link group/section relative flex h-[min(24px,calc(60dvh/var(--section-count)))] min-h-1 w-8 items-center justify-end rounded-sm px-1 no-underline focus-visible:outline-2 focus-visible:outline-ring aria-[current=location]:[&_.section-navigator-marker]:w-6 aria-[current=location]:[&_.section-navigator-marker]:bg-primary",
  marker:
    "section-navigator-marker h-[3px] w-2.5 rounded-full bg-muted-foreground/45 group-hover/section:bg-foreground/70 motion-safe:transition-[width,background-color]",
  preview:
    "section-navigator-preview pointer-events-none invisible absolute top-1/2 right-full grid w-[min(16.25rem,calc(100vw-72px))] -translate-y-1/2 gap-1 rounded-lg border border-border/70 bg-popover p-sm text-start text-popover-foreground opacity-0 shadow-md wrap-anywhere group-focus-visible/section:visible group-focus-visible/section:opacity-100 [@media(hover:hover)]:group-hover/section:visible [@media(hover:hover)]:group-hover/section:opacity-100 [&>strong]:text-sm [&>strong]:font-semibold [&>span]:text-xs [&>span]:leading-relaxed [&>span]:text-muted-foreground",
  root: "section-navigator fixed top-1/2 right-0.5 z-40 flex max-h-[65dvh] -translate-y-1/2 flex-col gap-0.5 min-[901px]:right-2",
} as const;

export const sectionNavigatorStyle = (count: number) =>
  ({ "--section-count": count }) as CSSProperties;
