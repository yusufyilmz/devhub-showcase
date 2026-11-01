"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function HeroSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="hero" />;
}
