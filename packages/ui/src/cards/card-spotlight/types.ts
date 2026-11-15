import type { BaseCardProps } from "../card/CardBase";

export type CardSpotlightProps = Omit<BaseCardProps, "asChild"> & {
  radius?: number;
  color?: string;
};
