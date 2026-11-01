"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function CalendarLinkSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="calendar-link" />;
}
