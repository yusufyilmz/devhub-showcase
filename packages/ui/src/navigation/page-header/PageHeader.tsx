import type React from "react";

import { pageHeaderStyles } from "./styles";
import type { PageHeaderProps } from "./types";

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <div className={pageHeaderStyles.element1}>
    <div className={pageHeaderStyles.element2}>
      <h2 className={pageHeaderStyles.element3}>{title}</h2>
      <p className={pageHeaderStyles.element4}>{subtitle}</p>
    </div>
  </div>
);
