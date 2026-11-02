import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";

export type HeaderOptions = {
  profile?: PortfolioProfile;
  asChild?: boolean;
  children?: ReactNode;
};
