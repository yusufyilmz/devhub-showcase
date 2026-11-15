import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";
export type ResponsivePortfolioPreviewProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  appearance?: PortfolioProfile["appearance"];
};
