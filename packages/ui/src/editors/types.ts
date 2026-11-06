import type { ReactNode } from "react";

import type { AuthorableSectionType, CustomSection } from "@shared/config";

import type { SectionEditorProps } from "../sections/types";

export type Item = { id: string; label: string };

export type Drag = { id: string; items: Item[]; pointerId: number };

export type ItemFieldsOptions = {
  item: CustomSection["items"][number];
  onChange: (item: CustomSection["items"][number]) => void;
  view: string;
};

export type SortableListOptions = {
  disabled?: boolean;
  renderContent?: (id: string) => ReactNode;
  items: Item[];
  onChange: (ids: string[]) => void;
  label: string;
};

export type OptionsEditorOptions = SectionEditorProps & { type: AuthorableSectionType };

export type SourceEditorOptions = SectionEditorProps & { type: AuthorableSectionType };

export type SectionContentEditorOptions = SectionEditorProps & {
  type: AuthorableSectionType;
};

export interface CollectionEditorProps<T extends { id: string }> {
  create: () => T;
  getTitle: (item: T) => string;
  items: T[];
  maxItems?: number;
  onChange: (items: T[]) => void;
  onRemove?: (item: T) => void;
  render: (item: T, change: (item: T) => void) => ReactNode;
  title: string;
}
export interface CollectionEditorItem {
  id: string;
}
