"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function MapSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="map" />;
}
