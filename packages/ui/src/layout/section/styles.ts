import { eyebrowClass } from "../../display/typography/eyebrow-class";

export const sectionStyles = {
  element1:
    "section-heading [position:sticky] [top:118px] [align-self:start] [&_.eyebrow]:[margin-bottom:12px] [&_h2]:[margin-bottom:16px] [font-size:30px] [font-weight:600] [line-height:1.25] [letter-spacing:-0.04em] [&_>_p:last-child]:[font-size:13px] [line-height:1.7] [color:var(--muted-foreground)] max-[767px]:[position:static] max-[767px]:[&_h2]:[margin-bottom:8px] [font-size:26px] [display:flex] [gap:14px] [align-items:center] [justify-content:space-between] [margin-bottom:20px] [&_h2]:[display:flex] [gap:8px] [align-items:center] max-[700px]:[margin-bottom:16px] max-[700px]:[&_h2]:[font-size:17px]",
  element2: eyebrowClass,
  element3:
    "section-content [min-width:0] [&_>_div]:[width:100%] [margin-top:0] [&_ol]:[padding-left:20px] [border-color:var(--border)] [&_ol_>_li]:[position:relative] [margin-bottom:28px] [&_ol_>_li:last-child]:[margin-bottom:0] [&_ol_>_li_>_div:last-child]:[margin:20px_0_0] [&_ul]:[box-shadow:none] [&_.bg-main-light-slate]:[background:var(--border)]",
} as const;

export const sectionElementsStyles = {
  element1:
    "section-view-accordion [&_details_>_div]:[font-size:0.875rem] [line-height:1.6] [color:var(--muted-foreground)] [display:grid] [gap:var(--spacing-s)] [min-width:0] [&_.section-disclosure-card[data-slot='card [padding:24px] [margin-bottom:20px] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:12px] max-[700px]:[padding:18px] [box-shadow:0_2px_10px_var(--shadow-color)]']]:[padding:0] [&_details[open]_summary_svg]:[transform:rotate(180deg)]",
  element2:
    "section-view-tabs [display:grid] [gap:var(--spacing-s)] [min-width:0] [&_[role='tablist']]:[display:flex] [&_[role='tablist']]:[flex-wrap:wrap] [&_[role='tab']]:[max-width:100%] [&_[aria-selected='true']]:[color:var(--foreground)]",
  element3:
    "section-view-carousel [&_>_ul_>_li]:[min-width:0] [overflow-wrap:anywhere] [display:grid] [gap:var(--spacing-s)] [min-width:0] [&_>_ul]:[display:flex] [gap:var(--spacing-s)] [min-width:0] [padding:0.25rem_0.125rem_0.875rem] [overflow-x:auto] [scroll-snap-type:x_mandatory] [scroll-padding-inline-start:0.125rem] [scrollbar-width:thin] [&_>_ul_>_li]:[flex:0_0_clamp(min(15rem,_85%),_45%,_25rem)] [scroll-snap-align:start]",
  element4: "section-view-controls [display:flex] [gap:0.375rem] [justify-content:flex-end]",
} as const;

export const sectionHeaderStyles = {
  baseClasses: "flex items-center gap-3 transition-all",
  baseClasses2: "cursor-pointer",
  element1: "flex-1",
  element2: "text-muted-foreground",
  getContainerClasses: "p-4 rounded-lg border",
  getContainerClasses2: "hover:bg-opacity-80",
  getContainerClasses3: "py-2 px-0",
  getContainerClasses4: "hover:opacity-80",
  getContainerClasses5: "p-4 pb-2 border-b border-border/40",
  getContainerClasses6: "hover:bg-accent/50",
  sectionHeader: "flex items-center justify-center",
  sectionHeader2: "font-semibold text-sm tracking-wide",
  sectionHeader3: "uppercase",
  sectionHeader4: "transition-colors",
  sectionHeader5: "text-xs",
  sectionHeader6: "shrink-0 transition-transform",
  sectionHeader7: "rotate-180",
} as const;

export const colorSchemeClasses = {
  error: "text-destructive bg-destructive/5 border-destructive/20",
  info: "text-info bg-info/5 border-info/20",
  primary: "text-primary bg-primary/5 border-primary/20",
  secondary: "text-secondary bg-secondary/5 border-secondary/20",
  success: "text-success bg-success/5 border-success/20",
  warning: "text-warning bg-warning/5 border-warning/20",
};

export function sectionClassName(...values: unknown[]): string {
  return `portfolio-section ${values[0]}`;
}

export function sectionGridClassName(...values: unknown[]): string {
  return `section-view-grid [ul&]:[display:grid] section-view-${values[0]}`;
}
