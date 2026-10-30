"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function TeamSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="team" />;
}
