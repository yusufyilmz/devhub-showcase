"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function AboutHeroSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="about-hero" />;
}
