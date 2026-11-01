"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function NewsletterSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="newsletter" />;
}
