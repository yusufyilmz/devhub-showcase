"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function CalendarLinkSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="calendar-link" />;
}
