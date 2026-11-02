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
