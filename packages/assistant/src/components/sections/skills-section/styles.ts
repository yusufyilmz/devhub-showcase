import { studioButtonClass } from "@shared/ui/button";
import { eyebrowClass } from "@shared/ui/typography";

export const skillItemStyles = {
  element1:
    "bg-main-light text-sm text-main-blue rounded-full px-3 py-1 shine-effect [transition:color_160ms,_background_160ms] inline-flex items-center",
} as const;

export const skillCategoryItemStyles = {
  element1:
    "section-card relative m-0 w-full rounded-[14px] border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-card p-6 shadow-[0_6px_26px_color-mix(in_srgb,var(--foreground)_5%,transparent)] transition-[border-color,box-shadow] duration-150 hover:border-[color-mix(in_srgb,var(--primary)_55%,transparent)] hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--foreground)_8%,transparent)] max-[767px]:p-[18px] [&_li]:cursor-default [&_li]:py-1.5 [&_li]:leading-[1.75] [&_.text-xs]:text-xs [&_.text-textColor-lightSlate]:text-[13px] [&_.text-textColor-lightSlate]:leading-[1.8]",
  element2: "flex flex-col",
  element3: "text-left font-semibold text-main-white mb-3 text-2xl",
  element4: "bg-main-light-slate mb-6 mt-0",
  element5: "flex justify-start flex-wrap gap-2",
} as const;

export const skillSectionStyles = {
  element1: "mt-8",
  element2: "flex h-full",
  element3: "overflow-y-auto mt-2 no-scrollbar [scrollbar-width:thin] w-full mb-10",
  element4: "pl-0 md:pl-4 py-4",
} as const;

export const skillsEditorStyles = {
  element1:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element2:
    "editor-card-heading mb-6 flex items-center justify-between gap-5 border-b border-border pb-5 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-3.5 [&_h3]:text-base [&_h3]:font-[550] [&_h3]:tracking-[-0.02em]",
  element3:
    "editor-field flex min-w-0 flex-col gap-[9px] text-xs text-muted-foreground [&_small]:text-[10px] [&_small]:leading-normal [&_small]:opacity-80",
  element4: "danger-button bg-transparent text-xs text-destructive shadow-none",
  element5:
    "editor-section-heading mb-5 flex flex-wrap items-center justify-between gap-4 max-[767px]:items-start [&_h2]:my-1 [&_h2]:mb-2 [&_h2]:text-[clamp(1.375rem,2.6vw,1.875rem)] [&_h2]:leading-[1.17] [&_h2]:font-[670] [&_h2]:tracking-[-0.035em] [&_p:not(.eyebrow)]:max-w-[62ch] [&_p:not(.eyebrow)]:text-[0.9375rem] [&_p:not(.eyebrow)]:leading-normal [&_p:not(.eyebrow)]:text-muted-foreground",
  element6: eyebrowClass,
  element7: studioButtonClass.secondary,
  element8: "form-error text-xs text-destructive",
} as const;
