"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function QuickstartSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="quickstart" />;
}
