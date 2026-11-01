"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function TextSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="text" />;
}
