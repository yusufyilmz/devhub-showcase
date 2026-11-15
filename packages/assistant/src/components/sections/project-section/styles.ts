export const projectFormStyles = {
  element1:
    "flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg [--notification-tone:var(--primary)]",
  element2: "mb-4",
  element3: "mb-4 flex flex-col gap-1 text-sm",
  element4: "mb-4",
  element5: "w-full",
} as const;

export const projectItemStyles = {
  element1: "project-card [&_.reveal-heading_.work-media]:[margin-bottom:var(--spacing-sm)]",
  element2: "reveal-subtitle [margin-top:6px] [font-size:14px] [color:var(--muted-foreground)]",
  element3:
    "reveal-description [font-size:13px] [line-height:1.8] [color:var(--muted-foreground)] [white-space:pre-line]",
  element4: "flex flex-wrap gap-2 mt-4",
  element5: "flex gap-4 mt-5",
  element6: "text-main-blue underline",
  element7: "text-main-blue underline",
  element8: "reveal-credit [margin-top:20px] [font-size:11px] [color:var(--muted-foreground)]",
} as const;

export const projectListStyles = {
  element1: "animate-mount",
  element2: "bg-transparent",
  element3: "text-textColor-light",
  element4: "flex flex-col gap-2",
  element5:
    "flex items-center gap-1 text-sm text-main-light-slate hover:underline hover:text-button-primary transition-colors duration-200",
  element6: "w-4 h-4 text-main-light-slate",
} as const;

export const projectsSectionStyles = {
  element1: "mt-8",
  element2: "flex h-full no-scrollbar [scrollbar-width:thin]",
  element3: "overflow-y-auto mt-2 md:mt-8 no-scrollbar [scrollbar-width:thin] w-full",
  element4: "pl-0 md:pl-4 py-8",
} as const;
