import type { ReactElement, ReactNode } from "react";

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
  trigger?: ReactElement;
  onIndexChange: (index: number | null) => void;
};
