import type React from "react";
import type { ReactNode } from "react";

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

export type SectionGridOptions = {
  items: SectionItem[];
  label: string;
  variant?: "cards" | "gallery";
  surface?: "semantic" | "portfolio";
};

export type SectionAccordionOptions = {
  items: SectionItem[];
  label: string;
  surface?: "semantic" | "portfolio";
};

export type SectionTabsOptions = {
  items: SectionItem[];
  label: string;
  surface?: "semantic" | "portfolio";
};

export type SectionCarouselOptions = {
  items: SectionItem[];
  label: string;
  previousLabel?: string;
  nextLabel?: string;
  surface?: "semantic" | "portfolio";
};

import type { PropsWithChildren } from "react";

export type SectionSurfaceProps = PropsWithChildren<{
  sectionId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  eyebrow?: string;
  asChild?: boolean;
}>;
