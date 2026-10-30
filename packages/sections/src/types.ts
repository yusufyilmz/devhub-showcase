import type {
  CustomSection,
  Language,
  SectionSourceField,
} from "@shared/content";
export type SectionProps = {
  section: CustomSection;
  language?: Language;
  preview?: boolean;
  anchors?: { id: string; title: string }[];
};
export type SectionEditorProps = {
  section: CustomSection;
  onChange: (section: CustomSection) => void;
  sourceItems?: Partial<
    Record<SectionSourceField, { id: string; title: string }[]>
  >;
};
