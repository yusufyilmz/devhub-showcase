import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";

export type HeaderLink = { href: string; label: string };

export type HeaderOptions = {
  profile?: PortfolioProfile;
  asChild?: boolean;
  children?: ReactNode;
  brand?: ReactNode;
  links?: readonly HeaderLink[];
  actions?: ReactNode;
  navigationLabel?: string;
  menuLabel?: string;
};
