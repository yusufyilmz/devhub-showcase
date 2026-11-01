"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function HowToSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="how-to" />;
}
