export const collectionEditorStyles = {
  element1: "editor-collection grid min-w-0 gap-sm",
  element2:
    "editor-section-heading mb-5 flex flex-wrap items-center justify-between gap-4 max-[767px]:items-start [&_h2]:my-1 [&_h2]:mb-2 [&_h2]:text-[clamp(1.375rem,2.6vw,1.875rem)] [&_h2]:leading-[1.17] [&_h2]:font-[670] [&_h2]:tracking-[-0.035em] [&_p:not(.eyebrow)]:max-w-[62ch] [&_p:not(.eyebrow)]:text-[0.9375rem] [&_p:not(.eyebrow)]:leading-normal [&_p:not(.eyebrow)]:text-muted-foreground",
  element5: "editor-card m-0 min-w-0 rounded-xl border border-border/75 bg-card p-md",
  element6:
    "editor-card-heading mb-sm flex min-w-0 flex-wrap items-center justify-between gap-xs border-b border-border/60 pb-sm [&_h3]:min-w-0 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:wrap-anywhere",
  element7: "editor-collection-actions flex flex-wrap items-center gap-xs",
  element9:
    "editor-fields grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-sm [&_.editor-field]:grid [&_.editor-field]:min-w-0 [&_.editor-field]:gap-xs [&_.editor-field]:text-sm [&_.editor-field.full-width]:col-span-full [&_.editor-field_small]:text-xs [&_.editor-field_small]:text-muted-foreground",
} as const;

export const optionsEditorStyles = {
  element1:
    "editor-fields grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-sm [&_.editor-field]:grid [&_.editor-field]:min-w-0 [&_.editor-field]:gap-xs [&_.editor-field]:text-sm [&_.editor-field.full-width]:col-span-full [&_.editor-field_small]:text-xs [&_.editor-field_small]:text-muted-foreground",
} as const;

export const editorPanelStyles = {
  checkbox:
    "mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  choice:
    "flex min-w-0 items-start gap-s rounded-lg border border-border bg-foreground/5 px-sm py-s text-sm leading-snug wrap-anywhere has-checked:border-primary/30",
  description: "text-sm leading-relaxed text-muted-foreground",
  legend: "px-xs text-sm font-semibold",
  panel:
    "ui-editor-panel grid min-w-0 gap-sm rounded-xl border border-border/75 bg-card px-md pt-sm pb-md text-card-foreground",
} as const;

export const contentEditorStyles = {
  element1: "section-library-editor grid min-w-0 gap-sm",
} as const;

export const sortableListStyles = {
  element1:
    "sortable-panel min-w-0 [&>p]:my-sm [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-muted-foreground",
  element2:
    "sortable-list m-0 grid list-none gap-xs p-0 [&>li]:flex [&>li]:min-w-0 [&>li]:items-center [&>li]:gap-xs [&>li]:rounded-lg [&>li]:border [&>li]:border-border/75 [&>li]:bg-card [&>li]:px-sm [&>li]:py-xs [&>li[data-draggable]]:touch-none [&>li[data-dragging]]:cursor-grabbing [&>li[data-dragging]]:border-ring data-[content]:gap-md data-[content]:[&>li]:relative data-[content]:[&>li[data-draggable]]:touch-auto data-[content]:[&_.sortable-handle]:touch-none data-[content]:[&>li[data-drop=before]]:border-t-primary data-[content]:[&>li[data-drop=after]]:border-b-primary",
  element3:
    "sortable-handle grid size-11 shrink-0 place-items-center rounded-md border-transparent bg-transparent text-xl text-foreground enabled:hover:bg-muted",
  element4: "sortable-number text-xs text-muted-foreground tabular-nums",
  element5: "sortable-label min-w-0 flex-1 text-sm wrap-anywhere",
  element8: "sortable-announcement sr-only",
  moveButton:
    "sortable-move grid size-11 shrink-0 place-items-center rounded-md border-transparent bg-transparent text-foreground enabled:hover:bg-muted disabled:opacity-40",
} as const;
