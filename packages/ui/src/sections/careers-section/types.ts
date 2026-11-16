import type { PortfolioProfile } from "@shared/config";

export type Props = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
