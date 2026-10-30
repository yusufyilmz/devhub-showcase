"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function MenuSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="menu" />;
}
