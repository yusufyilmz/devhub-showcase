import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent, type PortfolioTheme } from "@shared/config";

import { eyebrowClass } from "../../display/typography/eyebrow-class";
import type { Accent } from "./types";

export function themePreviewStyle(theme: PortfolioTheme, accent: Accent): CSSProperties {
  return {
    ...getPortfolioThemeVariables(theme),
    ...getPreviewAccent(accent),
  } as CSSProperties;
}

export const themePickerStyles = {
  element1: "mb-7 min-w-0 border-0 p-0 [&_legend]:mb-3 [&_legend]:text-xl [&_legend]:font-semibold",
  element2: "grid grid-cols-2 gap-4 max-[600px]:grid-cols-1",
  element3:
    "grid min-w-0 cursor-pointer grid-cols-[1.125rem_minmax(0,1fr)] items-center gap-sm rounded-xl border border-border/75 bg-card p-md hover:bg-muted/40 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring data-[selected=true]:border-primary/55 data-[selected=true]:bg-primary/5 [&_input]:size-[18px] [&_input]:accent-primary [&_strong]:text-sm [&>span:not(.theme-preview)]:col-span-full [&>span:not(.theme-preview)]:text-sm [&>span:not(.theme-preview)]:leading-relaxed [&>span:not(.theme-preview)]:text-muted-foreground",
  element4:
    "theme-preview min-w-0 wrap-anywhere rounded-lg border border-border/75 bg-background p-md text-foreground col-span-full block min-h-32 [&_b]:mb-2.5 [&_b]:block [&_b]:font-[family-name:var(--portfolio-display)] [&_b]:text-[25px] [&_b]:leading-tight [&_b]:font-[var(--portfolio-heading-weight)] [&>i]:block [&>i]:h-1 [&>i]:w-[70%] [&>i]:bg-[color-mix(in_srgb,var(--muted-foreground)_35%,transparent)]",
  element5:
    "mt-[18px] flex gap-2 [&_i]:h-[35px] [&_i]:w-1/2 [&_i]:rounded-[var(--portfolio-radius)] [&_i]:border [&_i]:border-border [&_i]:bg-card [&_i:first-child]:border-primary",
} as const;

export const themePreviewStyles = {
  element1:
    "theme-preview min-w-0 wrap-anywhere rounded-xl border border-border/75 bg-background p-md text-foreground md:p-lg",
  element2: "folio-eyebrow mb-5 mt-0 text-[11px] tracking-[0.12em] text-muted-foreground uppercase",
  element3:
    "theme-preview-title my-3 font-[family-name:var(--portfolio-display)] text-[clamp(28px,4vw,46px)] leading-[1.2] font-[var(--portfolio-heading-weight)] tracking-[-0.03em]",
  element4: "theme-preview-role mb-4 text-primary",
  element5: "theme-preview-summary max-w-[660px] text-sm leading-[1.8] text-muted-foreground",
  element6:
    "theme-preview-card mt-6 rounded-[var(--portfolio-radius)] border border-border bg-card p-5 [&_p]:mt-2 [&_p]:text-[13px] [&_p]:leading-[1.7] [&_p]:text-muted-foreground",
} as const;

export const appearanceEditorStyles = {
  element1:
    "editor-section-heading mb-5 flex flex-wrap items-center justify-between gap-4 max-[767px]:items-start [&_h2]:my-1 [&_h2]:mb-2 [&_h2]:text-[clamp(1.375rem,2.6vw,1.875rem)] [&_h2]:leading-[1.17] [&_h2]:font-[670] [&_h2]:tracking-[-0.035em] [&_p:not(.eyebrow)]:max-w-[62ch] [&_p:not(.eyebrow)]:text-[0.9375rem] [&_p:not(.eyebrow)]:leading-normal [&_p:not(.eyebrow)]:text-muted-foreground",
  element2: eyebrowClass,
  element3: "editor-card mb-[18px] rounded-xl border border-border/75 bg-card p-md md:p-lg",
  element4: "editor-fields grid grid-cols-1 gap-md md:grid-cols-2",
  element5:
    "theme-preview-tools my-4 mt-[26px] mb-4 flex flex-wrap items-center justify-between gap-3.5 [&_h3]:text-lg",
  element6:
    "theme-preview-modes flex gap-2 [&_button]:rounded-md [&_button]:border [&_button]:border-border [&_button]:px-3.5 [&_button]:py-2 [&_button]:text-xs [&_button[aria-pressed=true]]:border-primary [&_button[aria-pressed=true]]:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
  element7: "sr-only",
  element8: "theme-preview-note mt-3.5 text-xs leading-[1.7] text-muted-foreground",
} as const;
