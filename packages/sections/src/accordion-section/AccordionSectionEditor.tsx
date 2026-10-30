"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function AccordionSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="accordion" />;
}
