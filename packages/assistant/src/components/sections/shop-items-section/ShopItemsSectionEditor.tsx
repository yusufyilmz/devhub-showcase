"use client";

import { SectionContentEditor } from "../../editors/content-editor";
import type { SectionEditorProps } from "../types";

export function ShopItemsSectionEditor(props: SectionEditorProps) {
  return <SectionContentEditor {...props} type="shop-items" />;
}
