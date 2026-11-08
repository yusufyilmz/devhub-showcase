"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function TabsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="tabs" />;
}
