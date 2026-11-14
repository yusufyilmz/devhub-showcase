export const collectionEditorStyles = {
  element1:
    "editor-collection [display:grid] [gap:var(--spacing-sm)] [min-inline-size:0] [&_.editor-section-heading]:[display:flex] [flex-wrap:wrap] [gap:var(--spacing-s)] [align-items:center] [justify-content:space-between] [margin:0] [&_.editor-section-heading_h2]:[margin:0] [font-size:var(--text-xl)] [font-weight:650] [letter-spacing:-0.02em] [&_.editor-card]:[padding:var(--spacing-md)] [margin:0] [&_.editor-card-heading]:[display:flex] [flex-flow:row_wrap] [gap:var(--spacing-s)] [align-items:center] [justify-content:space-between] [padding-block-end:var(--spacing-s)] [margin-block-end:var(--spacing-sm)] [border-block-end:1px_solid_var(--border)] [&_.editor-card-heading_h3]:[min-inline-size:0] [font-size:var(--text-sm)] [font-weight:600] [overflow-wrap:anywhere] [&_.editor-fields]:[display:grid] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_12rem),_1fr))] [gap:var(--spacing-s)_var(--spacing-sm)] [&_.editor-field]:[display:grid] [gap:var(--spacing-xs)] [min-width:0] [font-size:var(--text-sm)] [color:var(--foreground)] [&_.editor-field.full-width]:[grid-column:1_/_-1] [&_.editor-field_small]:[font-size:var(--text-xs)] [line-height:1.5] [color:var(--muted-foreground)]",
  element2:
    "editor-section-heading mb-5 flex flex-wrap items-center justify-between gap-4 max-[767px]:items-start [&_h2]:my-1 [&_h2]:mb-2 [&_h2]:text-[clamp(1.375rem,2.6vw,1.875rem)] [&_h2]:leading-[1.17] [&_h2]:font-[670] [&_h2]:tracking-[-0.035em] [&_p:not(.eyebrow)]:max-w-[62ch] [&_p:not(.eyebrow)]:text-[0.9375rem] [&_p:not(.eyebrow)]:leading-normal [&_p:not(.eyebrow)]:text-muted-foreground",
  element5:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element6:
    "editor-card-heading mb-6 flex items-center justify-between gap-5 border-b border-border pb-5 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-3.5 [&_h3]:text-base [&_h3]:font-[550] [&_h3]:tracking-[-0.02em]",
  element7:
    "editor-collection-actions [display:flex] [flex-wrap:wrap] [gap:var(--spacing-xs)] [align-items:center]",
  element9: "editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]",
} as const;

export const optionsEditorStyles = {
  element1: "editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]",
} as const;

export const editorPanelStyles = {
  checkbox:
    "mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  choice:
    "flex min-w-0 items-start gap-s rounded-lg border border-border bg-foreground/5 px-sm py-s text-sm leading-snug wrap-anywhere has-checked:border-primary/30",
  description: "text-sm leading-relaxed text-muted-foreground",
  legend: "px-xs text-sm font-semibold",
  panel:
    "ui-editor-panel [&_.editor-fields]:[display:grid] [grid-template-columns:repeat(auto-fit,_minmax(min(100%,_12rem),_1fr))] [gap:var(--spacing-s)_var(--spacing-sm)] [&_.editor-field]:[display:grid] [gap:var(--spacing-xs)] [min-width:0] [font-size:var(--text-sm)] [color:var(--foreground)] [&_.editor-field.full-width]:[grid-column:1_/_-1] [&_.editor-field_small]:[font-size:var(--text-xs)] [line-height:1.5] [color:var(--muted-foreground)] grid min-w-0 gap-sm rounded-xl border border-border bg-card px-md pt-sm pb-md text-card-foreground",
} as const;

export const contentEditorStyles = {
  element1:
    "section-library-editor [display:grid] [gap:var(--spacing-sm)] [min-inline-size:0] [&_.editor-field]:[display:grid] [gap:var(--spacing-xs)] [min-width:0] [font-size:var(--text-sm)] [color:var(--foreground)] [&_.editor-field.full-width]:[grid-column:1_/_-1] [&_.editor-field_small]:[font-size:var(--text-xs)] [line-height:1.5] [color:var(--muted-foreground)]",
} as const;

export const sortableListStyles = {
  element1:
    "sortable-panel [min-width:0] [&_>_p]:[margin-block:1rem] [line-height:1.7] [color:var(--muted-foreground)]",
  element2:
    "sortable-list [display:grid] [gap:var(--spacing-xs)] [padding:0] [margin:0] [list-style:none] [&_>_li]:[display:flex] [gap:var(--spacing-xs)] [align-items:center] [padding:var(--spacing-xs)_var(--spacing-s)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:var(--radius-lg)] [&_>_li[data-draggable]]:[touch-action:none] [&_>_li[data-dragging]]:[border-color:var(--ring)] [&_>_li[data-dragging]]:[cursor:grabbing] [&_>_li[data-dragging]_.sortable-handle]:[cursor:grabbing] [&[data-content]]:[gap:1rem] [&[data-content]_>_li]:[position:relative] [&[data-content]_>_li[data-draggable]]:[touch-action:auto] [&[data-content]_.sortable-handle]:[touch-action:none] [&[data-content]_>_li[data-drop]::after]:[position:absolute] [&[data-content]_>_li[data-drop='before']::after]:[top:-0.5rem] [&[data-content]_>_li[data-drop='after']::after]:[bottom:-0.5rem]",
  element3:
    "sortable-handle [display:grid] [place-items:center] [min-width:44px] [min-height:44px] [font:inherit] [color:var(--foreground)] [background:transparent] [border:1px_solid_transparent] [border-radius:var(--radius-md)] hover:[background:color-mix(in_srgb,_var(--foreground)_6%,_transparent)] [font-size:1.4rem]",
  element4: "sortable-number text-xs text-muted-foreground tabular-nums",
  element5: "sortable-label min-w-0 flex-1 text-sm wrap-anywhere",
  element6:
    "sortable-move [display:grid] [place-items:center] [min-width:44px] [min-height:44px] [font:inherit] [color:var(--foreground)] [background:transparent] [border:1px_solid_transparent] [border-radius:var(--radius-md)] [&:enabled:hover]:[background:color-mix(in_srgb,_var(--foreground)_6%,_transparent)] [cursor:pointer] disabled:[cursor:default] [opacity:0.35]",
  element7:
    "sortable-move [display:grid] [place-items:center] [min-width:44px] [min-height:44px] [font:inherit] [color:var(--foreground)] [background:transparent] [border:1px_solid_transparent] [border-radius:var(--radius-md)] [&:enabled:hover]:[background:color-mix(in_srgb,_var(--foreground)_6%,_transparent)] [cursor:pointer] disabled:[cursor:default] [opacity:0.35]",
  element8: "sortable-announcement sr-only",
} as const;
