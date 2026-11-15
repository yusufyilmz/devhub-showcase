import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";
export type ResponsivePortfolioPreviewProps = {
  children: ReactNode;
  arrange?: { active: boolean; disabled?: boolean; onToggle: () => void; saveAction?: ReactNode };
  initiallyOpen?: boolean;
  openRequest?: number;
  appearance?: PortfolioProfile["appearance"];
};
