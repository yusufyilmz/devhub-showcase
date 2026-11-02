import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";
export type ResponsivePortfolioPreviewProps = {
  children: ReactNode;
  appearance?: PortfolioProfile["appearance"];
};
