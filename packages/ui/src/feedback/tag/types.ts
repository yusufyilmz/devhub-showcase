import type { ReactNode } from "react";

import type { sizes, variants } from "./styles";

export interface TagProps {
  children?: ReactNode;
  label?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}
