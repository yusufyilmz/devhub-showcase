"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function CalendarLinkSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="calendar-link" />;
}
