"use client";
import { SectionContentEditor } from "../shared/editor";
import type { SectionEditorProps } from "../types";
export function FeaturesSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="features" />;
}
