"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function DashboardSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="dashboard" />;
}
