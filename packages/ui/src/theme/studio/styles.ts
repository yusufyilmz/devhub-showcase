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
    "grid cursor-pointer grid-cols-[20px_1fr] gap-2.5 rounded-xl border border-border bg-card p-[18px] focus-within:outline [display:inline-flex] [gap:9px] [align-items:center] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [border-radius:8px] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)] focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-primary data-[selected=true]:border-primary data-[selected=true]:shadow-[0_0_0_1px_var(--primary)] [&_input]:size-[18px] [&_input]:self-center [&_input]:accent-primary [&_strong]:text-base [&>span:not(.theme-preview)]:col-span-full [&>span:not(.theme-preview)]:text-[13px] [&>span:not(.theme-preview)]:leading-relaxed [&>span:not(.theme-preview)]:text-muted-foreground",
  element4:
    "theme-preview min-w-0 wrap-anywhere rounded-xl border border-border bg-background p-8 text-foreground max-[600px]:p-[22px] col-span-full block !h-[155px] !rounded-md !p-5 max-[600px]:!p-[18px] [&_b]:mb-2.5 [&_b]:block [&_b]:font-[family-name:var(--portfolio-display)] [&_b]:text-[25px] [&_b]:leading-tight [&_b]:font-[var(--portfolio-heading-weight)] [&>i]:block [&>i]:h-1 [&>i]:w-[70%] [&>i]:bg-[color-mix(in_srgb,var(--muted-foreground)_35%,transparent)]",
  element5:
    "mt-[18px] flex gap-2 [&_i]:h-[35px] [&_i]:w-1/2 [&_i]:rounded-[var(--portfolio-radius)] [&_i]:border [&_i]:border-border [&_i]:bg-card [&_i:first-child]:border-primary",
} as const;

export const themePreviewStyles = {
  element1:
    "theme-preview min-w-0 wrap-anywhere rounded-xl border border-border bg-background p-8 text-foreground max-[600px]:p-[22px]",
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
  element3:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element4: "editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]",
  element5:
    "theme-preview-tools my-4 mt-[26px] mb-4 flex flex-wrap items-center justify-between gap-3.5 [&_h3]:text-lg",
  element6:
    "theme-preview-modes flex gap-2 [&_button]:rounded-md [&_button]:border [&_button]:border-border [&_button]:px-3.5 [&_button]:py-2 [&_button]:text-xs [&_button[aria-pressed=true]]:border-primary [&_button[aria-pressed=true]]:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
  element7: "sr-only",
  element8: "theme-preview-note mt-3.5 text-xs leading-[1.7] text-muted-foreground",
} as const;
