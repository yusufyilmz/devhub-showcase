import type * as React from "react";

export interface NotFoundProps {
  buttonText?: string;
  className?: string;
  description?: string;
  homeHref?: string;
  LinkComponent?: React.ComponentType<any>;
  onReturnHome?: () => void;
  secondaryAction?: React.ReactNode;
  title?: string;
}
