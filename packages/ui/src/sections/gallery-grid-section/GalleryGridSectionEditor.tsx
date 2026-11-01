"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function GalleryGridSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="gallery-grid" />;
}
