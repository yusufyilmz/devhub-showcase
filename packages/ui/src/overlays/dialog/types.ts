import type * as React from "react";
import type { ReactNode } from "react";

import type * as DialogPrimitive from "@radix-ui/react-dialog";

export type GalleryLightboxItem = {
  id: string;
  title: string;
  description?: string;
  thumbnail: ReactNode;
  content: ReactNode;
  href?: string;
};

export type GalleryLightboxOptions = {
  items: GalleryLightboxItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

export type DialogContentOptions = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};
