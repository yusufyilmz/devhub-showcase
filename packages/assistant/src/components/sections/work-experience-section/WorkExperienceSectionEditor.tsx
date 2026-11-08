"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function WorkExperienceSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="work-experience" />;
}
