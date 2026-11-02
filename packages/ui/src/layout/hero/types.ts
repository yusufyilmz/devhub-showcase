import type { ReactNode } from "react";

export type HeroMedia = {
  kind: "image" | "video";
  url: string;
  poster?: string;
  position: "center" | "top" | "bottom";
  overlay: "soft" | "strong";
};

export type HeroSurfaceOptions = {
  media?: HeroMedia;
  children: ReactNode;
  labels?: { play: string; pause: string };
};
