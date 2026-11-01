"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function BlogPageSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="blog-page" />;
}
