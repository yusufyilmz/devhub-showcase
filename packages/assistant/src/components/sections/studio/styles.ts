import type { CSSProperties } from "react";

import { studioButtonClass } from "@shared/ui/button";

export const configuredSectionStyles = {
  element1:
    "folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px] configured-section min-w-0 wrap-anywhere",
  element2: "configured-timeline list-none border-l border-border pl-6 [&>li]:py-3 [&>li]:pb-6",
} as const;

export const customSectionsEditorStyles = {
  element1: studioButtonClass.primary,
  element2:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element3:
    "editor-actions flex shrink-0 items-center gap-2 [&_button]:min-h-8 [&_button]:min-w-8 [&_button]:rounded-md [&_button]:border [&_button]:border-border [&_button]:bg-card [&_button]:px-[9px] [&_button]:py-[5px] [&_button]:text-xs [&_button]:text-foreground",
  element4: studioButtonClass.secondary,
  element5: "danger-button bg-transparent text-xs text-destructive shadow-none",
} as const;

export const sectionOrderEditorStyles = {
  element1:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element2: studioButtonClass.secondary,
} as const;

export const sectionSettingsEditorStyles = {
  element1:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&>p]:mb-6 [&>p]:max-w-[70ch] [&>p]:text-sm [&>p]:leading-7 [&>p]:text-muted-foreground",
  element2:
    "grid min-w-0 gap-3 border-0 border-t border-border py-5 [&_button]:justify-self-start [&_label]:text-[13px] [&_legend]:pr-3 [&_legend]:text-base [&_legend]:font-semibold",
  element3: studioButtonClass.secondary,
} as const;

export const sectionTemplatesEditorStyles = {
  element1:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] template-library [display:grid] [gap:1rem] [&_button:not([class])]:[min-height:44px]",
  element2:
    "editor-actions flex shrink-0 items-center gap-2 [&_button]:min-h-8 [&_button]:min-w-8 [&_button]:rounded-md [&_button]:border [&_button]:border-border [&_button]:bg-card [&_button]:px-[9px] [&_button]:py-[5px] [&_button]:text-xs [&_button]:text-foreground",
  element3: studioButtonClass.secondary,
  element4: studioButtonClass.secondary,
  element5:
    "template-library-list [display:grid] [gap:1rem] [padding:0] [list-style:none] [&_>_li]:[display:flex] [flex-wrap:wrap] [gap:0.65rem] [align-items:center] [padding:1rem] [border:1px_solid_var(--border)] [border-radius:12px]",
  element6:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element7: studioButtonClass.primary,
} as const;

const compositionLayout = {
  cta: "text-center [&_a]:mt-4 [&_a]:inline-flex [&_a]:rounded-lg [&_a]:bg-primary [&_a]:px-5 [&_a]:py-3 [&_a]:font-semibold [&_a]:text-[#08111f]",
  statistics: "[&_h3]:text-[clamp(2rem,5vw,3.5rem)] [&_h3]:text-primary",
} as const;

export function customPortfolioSectionClassName(...values: unknown[]): string {
  const composition = String(values[0] ?? "custom");
  const layout = compositionLayout[composition as keyof typeof compositionLayout] ?? "";
  return `folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px] configured-section min-w-0 wrap-anywhere composition-${composition} ${layout}`;
}

export const configuredSectionInlineStyle1: CSSProperties = { height: "auto", maxWidth: "100%" };

export const customPortfolioSectionInlineStyle1: CSSProperties = { whiteSpace: "pre-line" };

export const sectionSettingsEditorInlineStyle1: CSSProperties = { display: "block" };
