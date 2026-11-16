import type React from "react";
import type { ReactNode } from "react";

import type { CardProps } from "../../cards";

export type SectionItem = { id: string; title: string; content: ReactNode };

export interface SectionHeaderProps {
  /**
   * Optional badge content (number or text)
   */
  badge?: string | number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Whether the section is collapsible
   * @default false
   */
  collapsible?: boolean;
  /**
   * Color scheme for the header
   * @default 'primary'
   */
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  /**
   * Whether the section is expanded (only used if collapsible)
   * @default true
   */
  defaultExpanded?: boolean;
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  /**
   * Click handler for the entire header
   */
  onClick?: () => void;
  /**
   * Callback when expand state changes
   */
  onExpandChange?: (expanded: boolean) => void;
  /**
   * Optional subtitle
   */
  subtitle?: string;
  /**
   * Section title
   */
  title: string;
  /**
   * Visual variant
   * @default 'standard'
   */
  variant?: "standard" | "card" | "minimal";
}

import type { PropsWithChildren } from "react";

export type SectionSurfaceProps = PropsWithChildren<{
  sectionId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  eyebrow?: string;
  asChild?: boolean;
}>;

export type CardType = CardProps["type"];

export type SectionCollectionOptions = {
  items: SectionItem[];
  label: string;
  surface?: "semantic" | "portfolio";
  type?: CardType;
  sectionId?: SectionSurfaceProps["sectionId"];
};

export type SectionGridOptions = SectionCollectionOptions & {
  variant?: "cards" | "gallery";
};

export type SectionAccordionOptions = SectionCollectionOptions;
export type SectionTabsOptions = SectionCollectionOptions;

export type SectionCarouselOptions = SectionCollectionOptions & {
  previousLabel?: string;
  nextLabel?: string;
};

export type SectionItemCardOptions = Pick<SectionCollectionOptions, "surface" | "type"> & {
  item: SectionItem;
  accordion?: boolean;
};
