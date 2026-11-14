import { studioButtonClass } from "../buttons/button/StudioButton";

export const googleImportReviewStyles = {
  element1: studioButtonClass.primary,
} as const;

export const googleImportEditorStyles = {
  consent:
    "editor-checkbox flex items-center gap-2.5 text-xs text-muted-foreground [&_input]:size-4 [&_input]:accent-primary google-import-consent [align-items:flex-start] [padding-block:0.75rem] [margin-block:0.75rem] [border-block-start:1px_solid_var(--border)] [&_input]:[margin-block-start:0.2rem]",
  option:
    "editor-checkbox flex items-center gap-2.5 text-xs text-muted-foreground [&_input]:size-4 [&_input]:accent-primary google-import-option [padding:0.5rem_0.75rem] [border:1px_solid_var(--border)] [border-radius:0.5rem] [&:has(:checked)]:[background:color-mix(in_srgb,_var(--primary)_8%,_transparent)] [border-color:color-mix(in_srgb,_var(--primary)_42%,_transparent)]",
  panel:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] google-import-panel [&_.editor-section-heading]:[padding-block-end:1.125rem] [border-block-end:1px_solid_var(--border)] [line-height:1.6] [&_.editor-checkbox]:[gap:0.625rem] [min-height:2.5rem] [font-size:0.875rem] [color:var(--foreground)] [&_.editor-checkbox_input]:[flex:0_0_1rem]",
  primary: studioButtonClass.primary,
  secondary: studioButtonClass.secondary,
} as const;
