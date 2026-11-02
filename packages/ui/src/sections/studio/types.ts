import type {
  CustomSection,
  Language,
  PortfolioProfile,
  PortfolioSection,
  SectionRendererId,
} from "@shared/config";

import type { SectionItem } from "../../layout";
import type { SectionItem as SectionItem2 } from "../../layout/section";

export type ConfiguredSectionOptions = {
  profile: PortfolioProfile;
  section: PortfolioSection;
};

export type SectionViewOptions = {
  renderer: SectionRendererId;
  items: SectionItem[];
  label: string;
};

export type CustomPortfolioSectionOptions = {
  section: CustomSection;
  language?: Language;
  preview?: boolean;
  anchors?: { id: string; title: string }[];
};

export type CustomViewOptions = {
  renderer: CustomSection["renderer"];
  items: SectionItem2[];
  label: string;
};

export type CustomSectionsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type SectionEditorOptions = {
  section: CustomSection;
  profile: PortfolioProfile;
  onChange: (section: CustomSection) => void;
  onDuplicate?: () => void;
  onRemove: () => void;
};

export type SectionOrderEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type SectionSettingsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type SectionTemplatesEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type ConfiguredSectionOptions2 = string | null;
