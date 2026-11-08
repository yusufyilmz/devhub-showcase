"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function ContactFormSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="contact-form" />;
}
