export const skillItemStyles = {
  element1:
    "bg-main-light text-sm text-main-blue rounded-full px-3 py-1 shine-effect inline-flex items-center",
} as const;

export const skillCategoryItemStyles = {
  element1: "section-card",
  element2: "flex flex-col",
  element3: "text-left font-semibold text-main-white mb-3 text-2xl",
  element4: "bg-main-light-slate mb-6 mt-0",
  element5: "flex justify-start flex-wrap gap-2",
} as const;

export const skillSectionStyles = {
  element1: "mt-8",
  element2: "flex h-full",
  element3: "overflow-y-auto mt-2 no-scrollbar w-full mb-10",
  element4: "pl-0 md:pl-4 py-4",
} as const;

export const skillsEditorStyles = {
  element1: "editor-card",
  element2: "editor-card-heading",
  element3: "editor-field",
  element4: "danger-button",
  element5: "editor-section-heading",
  element6: "eyebrow",
  element7: "studio-secondary",
  element8: "form-error",
} as const;
