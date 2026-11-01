"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function ProfileSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="profile" />;
}
