import type { CSSProperties } from "react";

import { studioButtonClass } from "@shared/ui/button";

export const heroSettingsEditorStyles = {
  element1:
    "editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px]",
  element2: studioButtonClass.secondary,
} as const;

export const heroSettingsEditorInlineStyle1: CSSProperties = { paddingBlock: "4rem" };
