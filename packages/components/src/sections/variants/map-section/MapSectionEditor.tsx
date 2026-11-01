"use client";

import { SectionContentEditor } from "../../../editor";
import type { SectionEditorProps } from "../../types";

export function MapSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="map" />;
}
