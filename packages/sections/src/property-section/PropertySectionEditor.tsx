"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function PropertySectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="property" />;
}
