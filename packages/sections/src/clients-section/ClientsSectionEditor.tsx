"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function ClientsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="clients" />;
}
