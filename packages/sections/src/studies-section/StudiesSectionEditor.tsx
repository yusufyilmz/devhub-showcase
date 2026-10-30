"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function StudiesSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="studies" />;
}
