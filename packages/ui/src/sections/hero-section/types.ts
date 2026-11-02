import type { PortfolioProfile } from "@shared/config";

export type HeroSettingsEditorOptions = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
