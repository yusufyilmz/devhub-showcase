"use client";

import { SectionContentEditor } from "../../../editor/content-editor";
import type { SectionEditorProps } from "../../types";

export function SocialLinksSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="social-links" />;
}
