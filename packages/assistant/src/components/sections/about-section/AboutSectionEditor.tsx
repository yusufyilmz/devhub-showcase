"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function AboutSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="about" />;
}
