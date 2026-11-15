import type { ReactNode } from "react";

import type { PortfolioProfile } from "@shared/config";

export type FooterLinkGroup = {
  title: string;
  links: readonly { href: string; label: ReactNode; external?: boolean }[];
};

export type FooterOptions = {
  profile?: PortfolioProfile;
  asChild?: boolean;
  children?: ReactNode;
  brand?: ReactNode;
  description?: ReactNode;
  groups?: readonly FooterLinkGroup[];
  credit?: ReactNode;
  navigationLabel?: string;
};
