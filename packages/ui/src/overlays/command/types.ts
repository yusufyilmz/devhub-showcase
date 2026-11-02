import type * as React from "react";

import type { Dialog } from "../dialog/Dialog";

export type CommandDialogOptions = React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
};
