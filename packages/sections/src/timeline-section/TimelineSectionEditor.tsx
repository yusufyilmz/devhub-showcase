"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function TimelineSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="timeline" />;
}
