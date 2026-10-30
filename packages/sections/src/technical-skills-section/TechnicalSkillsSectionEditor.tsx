"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function TechnicalSkillsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="technical-skills" />;
}
