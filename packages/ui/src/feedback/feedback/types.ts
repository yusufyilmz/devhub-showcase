import type { ReactNode } from "react";

import type { variants } from "./styles";

export type FeedbackOptions = {
  variant?: keyof typeof variants;
  title?: string;
  description?: string;
  children?: ReactNode;
  onClose?: () => void;
};
