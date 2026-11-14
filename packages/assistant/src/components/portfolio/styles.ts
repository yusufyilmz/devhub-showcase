import { eyebrowClass } from "@shared/ui/typography";

export const languageSettingsEditorStyles = {
  element1:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]",
  element2: "full-width col-span-full",
  element3: "full-width col-span-full",
} as const;

export const portfolioTypePickerStyles = {
  element1:
    "my-[30px] min-w-0 border-0 p-0 [&_legend]:mb-3.5 [&_legend]:text-2xl [&_legend]:font-semibold [&>p]:mb-[26px] [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-muted-foreground",
  element2: "grid grid-cols-2 gap-5 max-[600px]:grid-cols-1",
  element3:
    "grid cursor-pointer grid-cols-[20px_1fr] gap-3 rounded-xl border border-border bg-card p-[22px] data-[selected=true]:border-primary data-[selected=true]:shadow-[0_0_0_1px_var(--primary)] [&_input]:row-start-2 [&_input]:size-[18px] [&_input]:self-center [&_input]:accent-primary [&_strong]:col-start-2 [&_strong]:text-lg [&>span:not([data-type])]:col-span-full [&>span:not([data-type])]:text-[13px] [&>span:not([data-type])]:leading-relaxed [&>span:not([data-type])]:text-muted-foreground [&>small]:col-span-full [&>small]:text-[11px] [&>small]:leading-relaxed [&>small]:text-muted-foreground",
  element4:
    "group col-span-full block h-[155px] overflow-hidden [--pattern-ink:color-mix(in_srgb,currentColor_12%,transparent)] rounded-md border border-border bg-background p-5 data-[type=consultant]:relative data-[type=consultant]:pl-[45%] data-[type=consultant]:before:absolute data-[type=consultant]:before:top-5 data-[type=consultant]:before:left-5 data-[type=consultant]:before:h-[90px] data-[type=consultant]:before:w-1/4 data-[type=consultant]:before:bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] data-[type=consultant]:before:content-[''] data-[type=minimal]:px-[25%]",
  element5:
    "mb-[9px] block h-3 w-[65%] bg-[color-mix(in_srgb,var(--foreground)_50%,transparent)] group-data-[type=designer]:h-6 group-data-[type=designer]:w-[90%]",
  element6:
    "mb-[9px] block h-[5px] w-[40%] bg-[color-mix(in_srgb,var(--foreground)_50%,transparent)] opacity-50",
  element7:
    "mt-[18px] grid grid-cols-2 gap-2 group-data-[type=engineer]:grid-cols-[0.8fr_1fr] group-data-[type=engineer]:[&_i:first-child]:row-span-2 group-data-[type=engineer]:[&_i:first-child]:h-[110px] group-data-[type=designer]:grid-cols-3 group-data-[type=consultant]:grid-cols-1 group-data-[type=consultant]:[&_i]:h-3 group-data-[type=minimal]:flex group-data-[type=minimal]:flex-col group-data-[type=minimal]:gap-3 group-data-[type=minimal]:[&_i]:h-1 group-data-[type=minimal]:[&_i]:border-0 group-data-[type=minimal]:[&_i]:bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)] group-data-[type=trainer]:grid-cols-1 group-data-[type=trainer]:[&_i]:h-[22px] group-data-[type=creator]:grid-cols-2 group-data-[type=creator]:[&_i:first-child]:col-span-full group-data-[type=creator]:[&_i:first-child]:h-9 [&_i]:block [&_i]:h-[55px] [&_i]:border [&_i]:border-[color-mix(in_srgb,var(--primary)_30%,transparent)] [&_i]:bg-[color-mix(in_srgb,var(--primary)_15%,transparent)]",
} as const;

export const profileFieldsStyles = {
  element1:
    "editor-section-heading mb-5 flex flex-wrap items-center justify-between gap-4 max-[767px]:items-start [&_h2]:my-1 [&_h2]:mb-2 [&_h2]:text-[clamp(1.375rem,2.6vw,1.875rem)] [&_h2]:leading-[1.17] [&_h2]:font-[670] [&_h2]:tracking-[-0.035em] [&_p:not(.eyebrow)]:max-w-[62ch] [&_p:not(.eyebrow)]:text-[0.9375rem] [&_p:not(.eyebrow)]:leading-normal [&_p:not(.eyebrow)]:text-muted-foreground",
  element2: eyebrowClass,
  element3:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]",
} as const;

export const fieldVisibilityStyles = {
  checkbox:
    "editor-checkbox flex items-center gap-2.5 text-xs text-muted-foreground [&_input]:size-4 [&_input]:accent-primary",
} as const;
