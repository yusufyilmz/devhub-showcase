import type { CSSProperties } from "react";

export const presenterStyles = {
  element1: "section-native-video [width:100%] [max-height:600px] [border-radius:12px]",
  element2: "section-item-value [font-size:2rem] [font-weight:650]",
  element3: "section-item-period [font-size:0.85rem]",
  element5:
    "section-prose [display:grid] [gap:var(--spacing-s)] [&_article[data-slot=card]]:[padding:var(--spacing-sm)]",
  element8: "section-description",
} as const;

export function collectionViewClassName(...values: unknown[]): string {
  return `section-${values[0]}`;
}

export function sectionPresentationClassName(...values: unknown[]): string {
  return `folio-section scroll-mt-6 border-t border-border py-14 max-[600px]:py-[38px] group-data-[portfolio-type=consultant]/folio:first:border-t-0 group-data-[portfolio-type=consultant]/folio:first:pt-0 group-data-[portfolio-type=minimal]/folio:py-9 group-data-[portfolio-type=minimal]/folio:[&_h2]:font-[Georgia,serif] group-data-[portfolio-type=minimal]/folio:[&_h2]:text-[28px] group-data-[portfolio-type=minimal]/folio:[&_h2]:tracking-[-0.02em] [&_h2]:mt-0 [&_h2]:mb-[30px] [&_h2]:text-[clamp(27px,3vw,42px)] [&_h2]:leading-[1.15] [&_h2]:font-[550] [&_h2]:tracking-[-0.045em] [&_h3]:mt-0 [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:leading-[1.4] [&_h3]:font-semibold [&_p]:mb-[18px] [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground [&_li]:mb-2 [&_li]:pl-1 [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted-foreground [&_dd]:text-[15px] [&_dd]:leading-[1.8] [&_dd]:text-muted-foreground [&_ul]:mt-[18px] [&_ul]:list-disc [&_ul]:pl-[22px] configured-section min-w-0 wrap-anywhere library-section composition-${values[0]} section-type-${values[1]} section-view-${values[2]}`;
}

export const presenterInlineStyle1: CSSProperties = { whiteSpace: "pre-line" };
