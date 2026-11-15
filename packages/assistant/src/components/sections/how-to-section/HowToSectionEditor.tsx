"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function HowToSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="how-to" />;
}
