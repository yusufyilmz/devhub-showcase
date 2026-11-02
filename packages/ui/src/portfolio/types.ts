import type { PortfolioProfile, PortfolioType } from "@shared/config";

export type LanguageSettingsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type PortfolioTypePickerOptions = {
  value: PortfolioType;
  onChange: (type: PortfolioType) => void;
};

export type ProfileFieldsOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};

export type ProfileFieldsOptions2 = string | string[];

export type CompletionItem = {
  label: string;
  tab: "Profile" | "Projects" | "Experience" | "Skills";
  complete: boolean;
  reason: string;
  essential: boolean;
};
export type PortfolioHistoryState = {
  past: PortfolioProfile[];
  present: PortfolioProfile;
  future: PortfolioProfile[];
};
export type EditorGuidanceProps = {
  profile: PortfolioProfile;
  onNavigate: (tab: CompletionItem["tab"], label: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  disabled?: boolean;
};
