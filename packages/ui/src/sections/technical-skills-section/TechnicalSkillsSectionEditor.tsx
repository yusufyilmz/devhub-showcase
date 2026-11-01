"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function TechnicalSkillsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="technical-skills" />;
}
