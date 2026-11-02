import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";

export type FooterOptions = {
  profile?: PortfolioProfile;
  asChild?: boolean;
  children?: ReactNode;
};
