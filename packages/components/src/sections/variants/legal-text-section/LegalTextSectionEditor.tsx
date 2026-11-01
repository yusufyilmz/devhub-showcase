"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function LegalTextSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="legal-text" />;
}
