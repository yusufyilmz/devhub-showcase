import type { Language, PortfolioProfile } from "@shared/config";

export type MenuItemsOptions = {
  closeOnSelect?: boolean;
  language?: Language;
  hiddenLinks?: string[];
};

export type MobileMenuOptions = {
  language?: Language;
  hiddenLinks?: string[];
};

export type NavbarOptions = { profile?: PortfolioProfile };
