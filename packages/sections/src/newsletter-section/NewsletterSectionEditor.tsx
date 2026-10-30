"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function NewsletterSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="newsletter" />;
}
