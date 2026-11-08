"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function TableOfContentsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="table-of-contents" />;
}
