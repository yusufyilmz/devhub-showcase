export const collectionEditorStyles = {
  element1: "editor-collection",
  element2: "editor-section-heading",
  element5: "editor-card",
  element6: "editor-card-heading",
  element7: "editor-collection-actions",
  element9: "editor-fields",
} as const;

export const optionsEditorStyles = {
  element1: "editor-fields",
} as const;

export const editorPanelStyles = {
  checkbox:
    "mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  choice:
    "flex min-w-0 items-start gap-s rounded-lg border border-border bg-foreground/5 px-sm py-s text-sm leading-snug wrap-anywhere has-checked:border-primary/30",
  description: "text-sm leading-relaxed text-muted-foreground",
  legend: "px-xs text-sm font-semibold",
  panel:
    "ui-editor-panel grid min-w-0 gap-sm rounded-xl border border-border bg-card px-md pt-sm pb-md text-card-foreground",
} as const;

export const contentEditorStyles = {
  element1: "section-library-editor",
} as const;

export const sortableListStyles = {
  element1: "sortable-panel",
  element2: "sortable-list",
  element3: "sortable-handle",
  element4: "sortable-number",
  element5: "sortable-label",
  element6: "sortable-move",
  element7: "sortable-move",
  element8: "sortable-announcement",
} as const;
