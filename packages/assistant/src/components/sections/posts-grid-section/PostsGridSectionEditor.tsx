"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function PostsGridSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="posts-grid" />;
}
