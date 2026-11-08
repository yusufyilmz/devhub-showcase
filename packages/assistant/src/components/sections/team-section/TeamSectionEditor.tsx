"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function TeamSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="team" />;
}
