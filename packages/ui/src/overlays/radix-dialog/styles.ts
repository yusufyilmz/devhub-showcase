import { cn } from "cn";

import { dialogStyles } from "../dialog/styles";

export const radixDialogStyles = {
  ...dialogStyles,
  dialogOverlay: cn(dialogStyles.dialogOverlay, "bg-black/50"),
} as const;
