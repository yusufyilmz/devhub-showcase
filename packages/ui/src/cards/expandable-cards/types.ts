import type { ReactNode } from "react";

export type ExpandableCardsProps = {
  cards: readonly {
    id: string | number;
    title: string;
    description?: string;
    content: ReactNode;
    thumbnail?: string;
  }[];
  className?: string;
};
